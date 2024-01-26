import React, { ComponentType, useContext, useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Snackbar, FormLabel } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import styled from "styled-components";
import authService from "../../services/AuthService";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from '@material-ui/core/styles';

// @ts-ignore
import WelcomeBackground from '../../assets/login_background.jpg';

// import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
// import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '80px',
  },
  welcomeBackground: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
  },
  welcomeText: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    paddingBottom: '2rem',
    paddingTop: '2rem',
    border: '1px solid #ffffff',
    borderBottom: '0',
    borderTopRightRadius: '10px',
    borderTopLeftRadius: '10px',
  },
  welcomeContainer: {
    zIndex: 1,
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    paddingTop: '0',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  welcomeForm: {
    paddingTop: '1rem',
  },
  formField: {
    marginBottom: '1rem'
  },
  formButton: {
    width: '100%',
    marginTop: '1rem'
  }
}));

const WelcomeView: ComponentType<any> = () => {
    const classes = useStyles();
    // const [fullname, setFullname] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');
    const [labId, setLabId] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const { setAuthUser } = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!labId) {
            setErrorSnackbarOpen(true);
            return;
        }

        if (phoneNumberError) {
            setErrorSnackbarOpen(true);
            return;
        }

        setIsLoading(true);
        authService.getPhotographer(labId).then((authUser: any) => {
            setAuthUser(authUser)
        })
            .catch(() => setErrorSnackbarOpen(true))
            .finally(() => setIsLoading(false))
    };

    // const authUserWithOldToken = async (token: string) => {
    //     if (token) {
    //         setIsLoading(true);
    //         authService.getPhotographer(token).then((authUser: any) => {
    //             setAuthUser(authUser)
    //         })
    //             .catch(() => setErrorSnackbarOpen(true))
    //             .finally(() => setIsLoading(false))
    //     }
    // };

    const validatePhoneNumber = (value: string): boolean => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(value);
    };

    // const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = event.target.value;
    //     setPhoneNumber(value);
    //
    //     if (!validatePhoneNumber(value)) {
    //         setPhoneNumberError('Please enter a valid phone number');
    //     } else {
    //         setPhoneNumberError('');
    //     }
    // };

    const handleSnackbarClose = () => {
        setErrorSnackbarOpen(false);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             await Filesystem.rename({
    //                 from: '/data/user/0/photoorder.droid/files/junki.sql',
    //                 to: '/data/user/0/photoorder.droid/files/junkiSQLite.db',
    //             });
        
    //             const sqlite = new SQLiteConnection(CapacitorSQLite);
    //             const db = await sqlite.createConnection(
    //                 '/data/user/0/photoorder.droid/files/junki', 
    //                 false, 
    //                 'no-encryption', 
    //                 1, 
    //                 true
    //             );
                
    //             await db.open();
    
    //             const query = "SELECT * FROM Settings WHERE key='OriginalUserEnteredToken';";
    //             const result = await db.query(query);
                
    //             if (result?.values) {
    //                await authUserWithOldToken(result.values[0].Value)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    
    //     fetchData();
    // }, []);
    
    return (
        <S.View>
            <img 
                src={WelcomeBackground} 
                alt='background'
                className={classes.welcomeBackground}    
            />
            <div className={classes.content}>
                <Typography variant="h4" className={classes.welcomeText}>
                    Welcome
                </Typography>
                <Container maxWidth="sm" className={classes.welcomeContainer}>
                    <form onSubmit={handleSubmit} className={classes.welcomeForm}>
                        {/*<TextField*/}
                        {/*    label="Full Name"*/}
                        {/*    value={fullname}*/}
                        {/*    onChange={(e) => setFullname(e.target.value)}*/}
                        {/*    fullWidth*/}
                        {/*    margin="normal"*/}
                        {/*/>*/}
                        {/*<TextField*/}
                        {/*    label="Phone Number"*/}
                        {/*    value={phoneNumber}*/}
                        {/*    onChange={handlePhoneNumberChange}*/}
                        {/*    fullWidth*/}
                        {/*    margin="normal"*/}
                        {/*    error={!!phoneNumberError}*/}
                        {/*    helperText={phoneNumberError}*/}
                        {/*/>*/}
                        <TextField
                            label="Lab ID"
                            value={labId}
                            onChange={(e) => setLabId(e.target.value)}
                            fullWidth
                            margin="normal"
                            helperText="If you do not remember the LAB ID number, please enter the phone number of the photographer (add country prefix ex. 0030) or the e-mail."
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            className={classes.formButton}
                        >
                            {isLoading ? 'Loading...' : 'Submit'}
                        </Button>
                    </form>
                    <Snackbar
                        open={errorSnackbarOpen}
                        autoHideDuration={4000}
                        onClose={handleSnackbarClose}
                        >
                        <Alert severity="error">
                            Wrong LAB ID or internal server error. Please try again.
                        </Alert>
                    </Snackbar>
                </Container>
            </div>
        </S.View>
    );
};

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default WelcomeView;

const S = {
    View: styled.div`
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    `
}

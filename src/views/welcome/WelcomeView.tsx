import React, {ComponentType, useContext, useState} from 'react';
import { TextField, Button, Container, Typography, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import styled from "styled-components";
import authService from "../../services/AuthService";
import {AuthContext} from "../../contexts/AuthContext";

const WelcomeView: ComponentType<any> = () => {
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
        authService.getPhotographer(labId).then(authUser => {
            setAuthUser(authUser)
        })
            .catch(err => setErrorSnackbarOpen(true))
            .finally(() => setIsLoading(false))
    };

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

    return (
        <S.View>
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome
                </Typography>
                <form onSubmit={handleSubmit}>
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
                        style={{width: '100%'}}
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

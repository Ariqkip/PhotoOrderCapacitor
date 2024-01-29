import React, { useEffect, useState, useContext } from 'react';
import { Button, Container, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import { getSettingsInfo } from '../../services/TokenService';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAlert from '@material-ui/lab/Alert';
import { Divider } from '@material-ui/core';
import { setLocalStorageSettings } from '../../services/SettingsService';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  welcomeBackground: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    backgroundColor: "#5F9EA0"
  },
  settingsContainer: {
    color: '#ffffff',
    zIndex: 2,
  },
  titleText: {
    fontSize: '2rem',
  },
  divider: {
    backgroundColor: "#ffffff",
    marginBottom: '3rem', 
  },
  subtitleBlock: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  subtitleMainText: {
    fontSize: '1.2rem',
    fontWeight: "700",
    paddingRight: '1rem'
  },
  subtitleText: {
    fontSize: '1.2rem',
    borderRadius: '5px',
    border: 'none',
    padding: '10px',
    marginTop: '5px',
  },
  tokenBlock: {
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  token: {
    marginTop: '0'
  },
  formButton: {
    padding: '1rem',
    border: '2px solid white',
    backgroundColor: '#5F9EA0',
    color: '#fff',
    marginTop: '1rem',
    width: '100%',
    fontWeight: '800'
  }
}));

const S = {
  View: styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
  `,
};

const SettingsView = () => {
  const classes = useStyles();
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: authUser?.firstName || "",
    phone: authUser?.phone || "",
    email: authUser?.email || "",
    address: authUser?.street || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (
          !authUser?.firstName || 
          !authUser?.phone || 
          !authUser?.street || 
          !authUser?.email  
        ) {
          const data = await getSettingsInfo();
          setUserData({
            name: authUser?.firstName && data[2]?.Value,
            phone: authUser?.phone && data[3]?.Value,
            email: authUser?.email && data[1]?.Value,
            address: authUser?.street && data[0]?.Value
          });
        }
      } catch (error) {
        console.error('Error checking old settings data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setIsLoadingForm(true);
      const updatedUserData = {
        ...userData,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address
      };

      await setLocalStorageSettings(updatedUserData);
      setAuthUser({
        ...authUser,
        firstName: updatedUserData.name,
        phone: updatedUserData.phone,
        email: updatedUserData.email,
        street: updatedUserData.address
      });
      setSuccessSnackbarOpen(true);
    } catch (e) {
      setErrorSnackbarOpen(true);
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleSnackbarClose = () => {
    setErrorSnackbarOpen(false);
    setSuccessSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <S.View>
      <div className={classes.welcomeBackground} />
      <Container maxWidth="md" className={classes.settingsContainer}>
        <Typography className={classes.titleText}>
          Settings
        </Typography>
        <Divider className={classes.divider} />
        <Typography className={classes.tokenBlock}>
          <Typography className={classes.subtitleMainText}>Token:</Typography> 
          <Typography className={`${classes.subtitleText} ${classes.token}`}>{authUser?.mobileToken}</Typography>
        </Typography>
        <form onSubmit={handleSaveChanges} className={classes.welcomeForm}>
          <Typography className={classes.subtitleBlock}>
            <Typography className={classes.subtitleMainText}>Name & Surname:</Typography> 
            <input 
              className={classes.subtitleText} 
              type="text" 
              name="name" 
              value={userData.name} 
              onChange={handleInputChange} 
            />
          </Typography>
          <Typography className={classes.subtitleBlock}>
            <Typography className={classes.subtitleMainText}>Phone number:</Typography> 
            <input 
              className={classes.subtitleText} 
              type="number" 
              name="phone" 
              value={userData.phone} 
              onChange={handleInputChange} 
            />
          </Typography>
          <Typography className={classes.subtitleBlock}>
            <Typography className={classes.subtitleMainText}>Email:</Typography> 
            <input 
              className={classes.subtitleText} 
              type="email" 
              name="email" 
              value={userData.email} 
              onChange={handleInputChange} 
            />
          </Typography>
          <Typography className={classes.subtitleBlock}>
            <Typography className={classes.subtitleMainText}>Address:</Typography> 
            <input 
              className={classes.subtitleText} 
              type="text" 
              name="address" 
              value={userData.address} 
              onChange={handleInputChange} 
            />
          </Typography>
          <Button
            type="submit"
            disabled={isLoadingForm}
            className={classes.formButton}
          >
            {isLoadingForm 
              ? 
                <div 
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                  }}
                >
                  <CircularProgress color='#5F9EA0' size={25} />
                </div> 
              : 'Save Changes'
            }
          </Button>
        </form>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error">
            Internal server error. Please try again.
          </Alert>
        </Snackbar>
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="success">
            Data successfully saved.
          </Alert>
        </Snackbar>
      </Container>
    </S.View>
  );
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default SettingsView;

import React, { useEffect, useState, useContext } from 'react';
import { Button, Card, Container, Typography, Snackbar, Collapse, Divider, Box, TextField, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import DatabaseService from '../../services/TokenService';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAlert from '@material-ui/lab/Alert';
import { setLocalStorageSettings } from '../../services/SettingsService';
import PlusIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';

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
    width: '100%'
  },
  settingsCard: {
    position: 'relative',
    marginBottom: '1rem',
    borderRadius: "15px",
    boxShadow: "0px 0px 30px 0px #d6d6d6",
    padding: "2rem"
  },
  settingsContainer: {
    color: '#e2d7d7',
    zIndex: 2,
  },
  titleText: {
    color: "#3A3A3A",
    fontSize: '2rem',
  },
  divider: {
    backgroundColor: "#e2d7d7",
    marginBottom: '1rem', 
  },
  subtitleBlock: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  subtitleMainText: {
    fontSize: '1.2rem',
    paddingRight: '1rem',
    color: "#3A3A3A",
    fontWeight: "600"
  },
  subtitleText: {
    color: "#0000008A",
    fontSize: "1.25rem",
    fontWeight: "400",
    lineHeight: "1.43",
    borderRadius: '5px',
    border: '1px solid #e2d7d7',
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
    marginTop: '0',
    border: 'none'
  },
  formButton: {
    width: '100%',
    maxWidth: '320px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    marginLeft: "1rem",
    marginTop: "1rem",
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
    // padding: '1rem',
    // backgroundColor: '#fff',
    // color: "#3A3A3A",
    // border: "1px solid #0000008A",
    // marginTop: '1rem',
    // width: '100%',
    // borderRadius: "15px",
    // fontWeight: '800'
  },
  collapseButton: {
    color: '#0000008A',
    backgroundColor: '#fff',
    border: "1px solid #e2d7d7",
    borderRadius: '50%',
    height: '4rem',
    marginBottom: '2rem',
    marginRight: '1rem',
    '&:hover': {
      backgroundColor: '#fff',
    }
  },
  collapseButtonLable: {
    color: "#3A3A3A",
    fontWeight: "600",
  },
  collapseWrap: {
    marginBottom: '1rem',
  },
  collapseBox: {
    display: 'flex'
  },
  paper: {
    padding: '28px',
    paddingBottom: "0"
  },
  textfield: {
    width: '100%',
    marginBottom: '28px',
  },
}));

const S = {
  View: styled.div`
    display: flex;
    min-height: 85vh;
    padding-top: 16px;
    height: 100%;
    position: relative;
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
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    phone: authUser?.phone || "",
    email: authUser?.email || "",
    address: authUser?.street || "",
    zipCode: authUser?.zipCode || "",
    city: authUser?.city || "",
    country: authUser?.country || ""
  });
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isDeliveryInfoOpen, setIsDeliveryInfoOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (
          !authUser?.firstName || 
          !authUser?.phone || 
          !authUser?.street || 
          !authUser?.email ||
          !authUser?.zipCode ||
          !authUser?.city ||
          !authUser?.country
        ) {
          const data = await DatabaseService.getSettingsInfo();
          setUserData({
            firstName: authUser?.firstName && data[2]?.Value,
            lastName: authUser?.lastName || "",
            phone: authUser?.phone && data[3]?.Value,
            email: authUser?.email && data[1]?.Value,
            address: authUser?.street && data[0]?.Value,
            zipCode: authUser?.zipCode,
            city: authUser?.city,
            country: authUser?.country
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
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        zipCode: userData.zipCode,
        city: userData.city,
        country: userData.country
      };

      await setLocalStorageSettings(updatedUserData);
      setAuthUser({
        ...authUser,
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        phone: updatedUserData.phone,
        email: updatedUserData.email,
        street: updatedUserData.address,
        zipCode: userData.zipCode,
        city: userData.city,
        country: userData.country
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
        {/* <Card className={classes.settingsCard}> */}
          <Typography className={classes.titleText}>
            Settings
          </Typography>
          <Divider className={classes.divider} />
          <Typography className={classes.tokenBlock}>
            <Typography className={classes.subtitleMainText}>Token:</Typography> 
            <Typography className={`${classes.subtitleText} ${classes.token}`}>{authUser?.mobileToken}</Typography>
          </Typography>
          <form onSubmit={handleSaveChanges} className={classes.welcomeForm}>
            <p style={{ color: "#000000DE", fontSize: "14px" }}>Basic information:</p>

            <Paper square className={classes.paper}>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='firstName'
                  id='basic-first-name'
                  label={t('First name')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.firstName} 
                  onChange={handleInputChange}
                />
              </Typography>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='lastName'
                  id='basic-last-name'
                  label={t('Last name')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.lastName} 
                  onChange={handleInputChange}
                />
              </Typography>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='phone'
                  id='basic-phone'
                  label={t('Phone')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.phone} 
                  onChange={handleInputChange}
                />
              </Typography>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='email'
                  id='basic-email'
                  label={t('Email')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.email} 
                  onChange={handleInputChange}
                />
              </Typography>
            </Paper>

            <p style={{ color: "#000000DE", fontSize: "14px" }}>Delivery information:</p>

            <Paper square className={classes.paper}>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='address'
                  id='basic-address'
                  label={t('Street address')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.address} 
                  onChange={handleInputChange}
                />
              </Typography>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='zipCode'
                  id='basic-zipCode'
                  label={t('ZIP Code')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.zipCode} 
                  onChange={handleInputChange}
                />
              </Typography>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='city'
                  id='basic-city'
                  label={t('City')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.city} 
                  onChange={handleInputChange}
                />
              </Typography>
              <Typography className={classes.subtitleBlock}>
                <TextField
                  name='country'
                  id='basic-country'
                  label={t('Country')}
                  variant='outlined'
                  className={classes.textfield}
                  value={userData.country} 
                  onChange={handleInputChange}
                />
              </Typography>
            </Paper>

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
                      color: '#0000008A'
                    }}
                  >
                    <CircularProgress color='#0000008A' size={25} />
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
        {/* </Card> */}
      </Container>
    </S.View>
  );
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default SettingsView;

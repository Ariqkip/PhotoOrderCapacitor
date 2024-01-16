import { ComponentType, useContext, useEffect } from 'react';
import { Button, Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ContactPhoneIcon from '@material-ui/icons/Phone';
import { usePhotographer } from '../../contexts/PhotographerContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { useGetPhotographer } from '../../services/OrderUtils';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: '100%',
    backgroundColor: 'black',
    color: 'white',
  },
  gridConainer: {
    height: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  logoContainer: {
    marginTop: '5rem',
  },
  logo: {
    width: '100%',
    maxWidth: '250px',
  },
  boldText: {
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.5rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: '#4556ac',
    width: 'fit-content',
    color: 'white',
    padding: '0.5rem',
    '&:hover': {
      backgroundColor: '#ffffff',
      color: '#000000',
    },
  },
  callIcon: {
    color: 'white',
    paddingRight: '0.5rem',
    '&:hover': {
      color: '#000000',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  spinner: {
    color: '#743c6e',
  },
}));

function isLoading(query: any) {
  if (query.isLoading) return true;
  if (query.isFetching) return true;

  return false;
}

const PhotographerWelcomeView: ComponentType<any> = ({ userId }) => {
  const classes = useStyles();

  const { authUser } = useContext(AuthContext);
  const history = useHistory();

  const photographerQuery = useGetPhotographer(userId ?? 0);

  const [photographer, dispatch] = usePhotographer();
  const { data } = photographerQuery;

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_INFO', data: data })
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (data && !isLoading(photographerQuery)) {
      const timeoutId = setTimeout(() => {
        history.push(`/photographer/${authUser.id}`);
      }, 3000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [authUser.id, data, history, photographerQuery]);

  return (
    <>
      <Backdrop
        className={classes.backdrop}
        open={isLoading(photographerQuery)}
      >
        <CircularProgress className={classes.spinner} />
      </Backdrop>
      {!isLoading(photographerQuery) && (        
        <S.View>
          <Container maxWidth="md" className={classes.container}>
            <Grid
              container
              spacing={3}
              className={classes.gridConainer}
              direction='column'
            >
                <Grid item className={classes.logoContainer}>
                  <img
                    src={photographer.logoUrl}
                    alt='company logo'
                    className={classes.logo}
                  />
                </Grid>
                <Grid item className={classes.gridItem}>
                  <Typography variant="h5" align="center" gutterBottom className={classes.boldText}>
                      Black point
                  </Typography>
                  <Typography variant="h5" align="center" gutterBottom>
                    {photographer.street} {photographer.companyName}
                  </Typography>
                  <a href={photographer.website} className={classes.link}>
                    {photographer.website}
                  </a>
                  <Button 
                    className={classes.callButton}
                    variant="contained"
                    onClick={() => {window.location.href = `tel:${photographer.phone}`}}
                  >
                    <ContactPhoneIcon className={classes.callIcon} />
                    Call Us
                  </Button>
              </Grid>
            </Grid>
          </Container>
        </S.View>
      )}
    </>
  );
};

export default PhotographerWelcomeView;

const S = {
  View: styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

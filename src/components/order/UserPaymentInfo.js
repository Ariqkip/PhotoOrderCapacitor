//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StoreIcon from '@material-ui/icons/Store';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CreditCardIcon from '@material-ui/icons/CreditCard';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    marginTop: '28px',
  },
  paper: {
    padding: '28px',
    height: '100%',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '200px',
  },
  gridCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  green: {
    color: '#6fb327',
  },
  cardState: {
    fontSize: '26px',
    textAlign: 'center',
  },
}));

const UserPaymentInfo = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth='md' className={classes.container}>
      <Grid
        container
        spacing={3}
        justifyContent='space-evenly'
        alignItems='stretch'
      >
        <Grid item sm={6} md={3}>
          <Paper square className={classes.paper}>
            <Grid
              container
              spacing={3}
              className={classes.gridCard}
              direction='column'
            >
              <Grid item>
                <StoreIcon fontSize='large' className={classes.green} />
              </Grid>
              <Grid item>
                <Typography variant='body2'>{t('On Shop')}</Typography>
              </Grid>
              <Grid item>
                <Typography className={[classes.cardState, classes.green]}>
                  {t('SELECTED')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item sm={6} md={3}>
          <Paper square className={classes.paper}>
            <Grid
              container
              spacing={3}
              className={classes.gridCard}
              direction='column'
            >
              <Grid item>
                <AccountBalanceIcon fontSize='large' />
              </Grid>
              <Grid item>
                <Typography variant='body2'>{t('Bank Transfer')}</Typography>
              </Grid>
              <Grid item>
                {' '}
                <Typography className={[classes.cardState]}>
                  {t('Comming SOON')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item sm={6} md={3}>
          <Paper square className={classes.paper}>
            <Grid
              container
              spacing={3}
              className={classes.gridCard}
              direction='column'
            >
              <Grid item>
                <CreditCardIcon fontSize='large' />
              </Grid>
              <Grid item>{t('Card')}</Grid>
              <Grid item>
                <Typography className={[classes.cardState]}>
                  {t('Comming SOON')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserPaymentInfo;

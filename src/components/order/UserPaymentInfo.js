//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

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
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    marginTop: '28px',
  },
  paymentInfo: {
    padding: '28px',
    marginBottom: '18px',
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
  red: {
    color: '#f44336',
  },
  cardState: {
    fontSize: '26px',
    textAlign: 'center',
  },
}));

const UserPaymentInfo = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [order, orderDispatch] = useOrder();
  console.log('%cLQS logger: ', 'color: #c931eb', { order });

  function ChangePaymentMethod(type) {
    orderDispatch({
      type: 'ORDER_SET_PAYMENT_METHOD',
      payload: {
        paymentMethod: type,
      },
    });
  }

  function IsSelected(type) {
    const orderType = order?.paymentMethod ?? 0;
    return type === orderType;
  }

  return (
    <Container maxWidth='md' className={classes.container}>
      {IsSelected(1) && (
        <Paper square className={classes.paymentInfo}>
          <Typography variant='overline'>
            <ErrorOutlineIcon fontSize='small' className={classes.red} />{' '}
            {t('Payment informations')}:
          </Typography>

          <Typography className={[]}>
            {t('Please paste this text in Viva Wallet dialog window')}:
          </Typography>
        </Paper>
      )}
      {IsSelected(2) && (
        <Paper square className={classes.paymentInfo}>
          <Typography variant='overline'>
            <ErrorOutlineIcon fontSize='small' className={classes.red} />{' '}
            {t('Payment informations')}:
          </Typography>

          <Typography className={[]}>
            {t('Please make a payment to this account')}:
          </Typography>
        </Paper>
      )}
      <Grid
        container
        spacing={3}
        justifyContent='space-evenly'
        alignItems='stretch'
      >
        <Grid item sm={6} md={3}>
          <Paper
            square
            className={classes.paper}
            onClick={() => ChangePaymentMethod(0)}
          >
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
                {IsSelected(0) && (
                  <Typography className={[classes.cardState, classes.green]}>
                    {t('SELECTED')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item sm={6} md={3}>
          <Paper
            square
            className={classes.paper}
            onClick={() => ChangePaymentMethod(1)}
          >
            <Grid
              container
              spacing={3}
              className={classes.gridCard}
              direction='column'
            >
              <Grid item>
                <AccountBalanceIcon
                  fontSize='large'
                  className={classes.green}
                />
              </Grid>
              <Grid item>
                <Typography variant='body2'>{t('Bank Transfer')}</Typography>
              </Grid>
              <Grid item>
                {IsSelected(1) && (
                  <Typography className={[classes.cardState, classes.green]}>
                    {t('SELECTED')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item sm={6} md={3}>
          <Paper
            square
            className={classes.paper}
            onClick={() => ChangePaymentMethod(2)}
          >
            <Grid
              container
              spacing={3}
              className={classes.gridCard}
              direction='column'
            >
              <Grid item>
                <CreditCardIcon fontSize='large' className={classes.green} />
              </Grid>
              <Grid item>{t('Card')}</Grid>
              <Grid item>
                {IsSelected(2) && (
                  <Typography className={[classes.cardState, classes.green]}>
                    {t('SELECTED')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserPaymentInfo;

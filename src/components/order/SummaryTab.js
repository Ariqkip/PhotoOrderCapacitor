//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '28px',
  },
  gridContainer: {
    alignItems: 'space-between',
    justifyContent: 'center',
  },
  mb28: {
    marginBottom: '28px',
  },
  typoLeft: {
    flexGrow: 1,
    textAlign: 'start',
  },
  typoCenter: {
    flexGrow: 1,
    textAlign: 'center',
  },
  typoRight: {
    flexGrow: 1,
    textAlign: 'end',
  },
}));

const SummaryTab = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [order, orderDispatch] = useOrder();

  const renderUploadedFilesinfo = () => {
    const uploadedFiles = order.orderItems.length;
    return (
      <Typography className={classes.typoLeft}>
        Uploaded {uploadedFiles} photos
      </Typography>
    );
  };

  const renderPrintsInfo = () => {
    const printsOrdered = order.orderItems.reduce(
      (sum, item) => sum + item.qty,
      0
    );
    return (
      <Typography className={classes.typoCenter}>
        Ordered {printsOrdered} prints
      </Typography>
    );
  };

  return (
    <Container maxWidth='md'>
      <Paper square className={classes.paper}>
        <Grid
          container
          spacing={3}
          className={[classes.gridContainer, classes.mb28]}
        >
          <Grid item xs={12} sm={4}>
            {renderUploadedFilesinfo()}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderPrintsInfo()}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography className={classes.typoRight}>Total TODO</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.gridContainer}>
          SEND ORDER BTN
        </Grid>
      </Paper>
    </Container>
  );
};

export default SummaryTab;

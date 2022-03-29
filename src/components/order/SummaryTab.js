//Core
import React, { useState, useEffect } from 'react';

//Components
import SendOrderButton from './SendOrderButton';

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import { getPrice, formatPrice } from '../../core/helpers/priceHelper';

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

  const [total, setTotal] = useState(0);

  const [photographer] = usePhotographer();
  const [order, orderDispatch] = useOrder();

const renderUploadedFilesinfo = () => {
  const uploadedFiles = order.orderItems.filter((i) => !i.isLayerItem).length;
  return (
    <Typography className={classes.typoLeft}>
      Uploaded {uploadedFiles} photos
    </Typography>
  );
};

const renderPrintsInfo = () => {
  const filesToCount = order.orderItems.filter((i) => !i.isLayerItem);
  const printsOrdered = filesToCount.reduce((sum, item) => sum + item.qty, 0);
  return (
    <Typography className={classes.typoCenter}>
      Ordered {printsOrdered} prints
    </Typography>
  );
};

const renderTotalCost = () => {
  return (
    <Typography className={classes.typoRight}>
      Total cost {formatPrice(total)} €
    </Typography>
  );
};

useEffect(() => {
  const bill = order.orderItems.map((item) => {
    if (item.isLayerItem === true) return 0;
    return getPrice(item.productId, item.qty, photographer);
  });
  let newTotal = bill.reduce((sum, item) => sum + item, 0);
  if (order.shippingSelected) {
    newTotal += photographer.shippingPrice;
  }
  setTotal(newTotal);
}, [order.orderItems, order.shippingSelected, photographer]);

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
            {renderTotalCost()}
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.gridContainer}>
          <SendOrderButton />
        </Grid>
      </Paper>
    </Container>
  );
};

export default SummaryTab;

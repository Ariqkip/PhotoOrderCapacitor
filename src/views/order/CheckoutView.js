//Core
import React, { useState, useEffect } from 'react';

//Components
import SummaryTab from '../../components/order/SummaryTab';
import UserBasicInfo from '../../components/order/UserBasicInfo';
import UserDeliveryInfo from '../../components/order/UserDeliveryInfo';
import UserPaymentInfo from '../../components/order/UserPaymentInfo';
import ThankYouCard from '../../components/order/ThankYouCard';

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const CheckoutView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [order] = useOrder();
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    let timer;

    if (order.status === 'SUCCESS') {
      setShowThankYou(true)
    }

    if (order.status !== 'SUCCESS') {
      timer = setTimeout(() => {
        setShowThankYou(false);
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [order.status]);

  return (
    <div className={classes.root}>
      {showThankYou ? (
        <ThankYouCard />
      ) : (
        <>
          <SummaryTab />
          <UserBasicInfo />
          <UserDeliveryInfo />
          <UserPaymentInfo />
        </>
      )}
    </div>
  );
};

export default CheckoutView;

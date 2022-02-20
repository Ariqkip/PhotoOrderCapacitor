//Core
import React, { useState } from 'react';

//Components
import SummaryTab from '../../components/order/SummaryTab';
import UserBasicInfo from '../../components/order/UserBasicInfo';
import UserDeliveryInfo from '../../components/order/UserDeliveryInfo';
import UserPaymentInfo from '../../components/order/UserPaymentInfo';

//Hooks
import { useTranslation } from 'react-i18next';

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

  return (
    <>
      <SummaryTab />
      <UserBasicInfo />
      <UserDeliveryInfo />
      <UserPaymentInfo />
    </>
  );
};

export default CheckoutView;

//Core
import React, { useEffect } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import OrderService from '../../services/OrderService';

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const UploadManager = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [order, orderDispatch] = useOrder();

  const uploadFiles = async () => {
    if (order.status !== 'INITIALIZED') return;

    const uploadInProcess = order.orderItems.find(
      (item) => item.status === 'processing'
    );
    if (uploadInProcess) return;

    const itemToUpload = order.orderItems.find(
      (item) => item.status === 'idle'
    );
    if (!itemToUpload) return;

    orderDispatch({
      type: 'ORDER_ITEM_SET_STATE_PROCESSING',
      payload: { guid: itemToUpload.fileGuid },
    });

    const service = OrderService();
    await service
      .UploadImage({
        orderId: order.orderId,
        orderGuid: order.orderGuid,
        productId: itemToUpload.productId,
        fileAsBase64: itemToUpload.fileAsBase64,
        fileName: itemToUpload.fileName,
        fileGuid: itemToUpload.guid,
        attributes: itemToUpload.attributes,
      })
      .then(
        (res) => {
          orderDispatch({
            type: 'ORDER_ITEM_SET_STATE_SUCCESS',
            payload: { guid: res.data.TrackingGuid },
          });
        },
        (err) => {
          orderDispatch({
            type: 'ORDER_ITEM_SET_STATE_FAILED',
            payload: { guid: itemToUpload.fileGuid },
          });
        }
      )
      .catch((err) => {
        orderDispatch({
          type: 'ORDER_ITEM_SET_STATE_FAILED',
          payload: { guid: itemToUpload.fileGuid },
        });
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      uploadFiles();
      //tryFinalizeOrder();
    }, 200);
    return () => clearInterval(interval);
  });

  return <></>;
};

export default UploadManager;

//Core
import React, { useEffect, useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../../contexts/OrderContext';

//Utils
import { createGuid } from '../../../core/helpers/guidHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Paper from '@material-ui/core/Paper';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '16px',
    height: '65px',
    display: 'flex',
    alignItems: 'center',
  },
  aligner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnail: {
    height: '65px',
  },
  fileName: {
    width: '100%',
    flexGrow: 1,
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    wordWrap: 'break-word',
    [theme.breakpoints.down('sm')]: {
      width: '1px',
    },
  },
  centerVertical: {
    display: 'flex',
    alignItems: 'center',
  },
  success: {
    color: '#28a745',
  },
  failure: {
    color: '#dc3545',
  },
}));

const AttributeListItem = ({ attribute, order, product, pack, key, hideIncrease, hideQuantity }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [, orderDispatch] = useOrder();
  const [file, setFile] = useState({});

  useEffect(async()=>{
    let orderItem = order.orderItems
      .filter((item) => item.productId === product.id)
      .find(item => item.fileName === product.name + " " + attribute.name);
    if(!orderItem){
      orderItem = {
        maxSize: product.size,
        guid: createGuid(),
        // fileAsBase64: reader.result,
        // fileUrl: product.imageUrl,
        fileName: product.name + " " + attribute.name,
        productId: product.id,
        set: pack,
        qty: 0,
        status: 'success',
      };
    }
    setFile(orderItem);
  }, [order, product])

  const handleAddQuantity = async() => {
    if(file.qty === 0){
      const orderItem = {
        ...file,
        status: 'idle',
      };
      setFile(orderItem)

      const data = await fetch(product.imageUrl);
      const blob = await data.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const orderItem = {
          ...file,
          fileAsBase64: reader.result,
          fileUrl: product.imageUrl,
          qty: 1,
          status: 'idle',
        };
        setFile(orderItem)
        orderDispatch({ type: 'ADD_ORDER_ITEM', payload: orderItem });
      }
    }else{
      orderDispatch({
        type: 'INCREASE_ORDER_ITEM_QTY',
        payload: { guid: file.guid },
      });
    }
  };

  const handleRemoveQuantity = () => {
    orderDispatch({
      type: 'DECRESE_ORDER_ITEM_QTY',
      payload: { guid: file.guid },
    });
  };

  return (
    <Paper square key={key} className={classes.root}>
      <img
        src={product.imageUrl}
        className={classes.thumbnail}
        alt={product.fileName}
      />
      <div className={classes.aligner}>
        <span className={classes.fileName}>{file.fileName}</span>
        <div className={classes.centerVertical}>
          {file.status === 'idle' && <CircularProgress size={18} />}
          {file.status === 'success' && (
            <DoneIcon className={classes.success} />
          )}
          {file.status === 'failed' && (
            <ErrorOutlineIcon className={classes.failure} />
          )}
          <IconButton aria-label='delete' onClick={handleRemoveQuantity}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          {!hideQuantity && <span>{file.qty}</span>}
          {!hideIncrease && (
            <IconButton aria-label='delete' onClick={handleAddQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default AttributeListItem;

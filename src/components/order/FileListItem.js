//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils

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
    marginLeft: '8px',
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

const FileListItem = ({ file, key }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [, orderDispatch] = useOrder();

  const handleAddQuantity = () => {
    orderDispatch({
      type: 'INCREASE_ORDER_ITEM_QTY',
      payload: { guid: file.guid },
    });
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
        src={file.fileUrl}
        className={classes.thumbnail}
        alt={file.fileName}
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
          <span>{file.qty}</span>
          <IconButton aria-label='delete' onClick={handleAddQuantity}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

export default FileListItem;

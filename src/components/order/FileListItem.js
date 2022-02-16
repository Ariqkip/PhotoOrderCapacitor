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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Paper from '@material-ui/core/Paper';

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
          {file.state === 'idle' && <CircularProgress size={18} />}
          <IconButton
            aria-label='delete'
            color='secondary'
            onClick={handleRemoveQuantity}
          >
            <RemoveCircleIcon />
          </IconButton>
          <span>{file.qty}</span>
          <IconButton
            aria-label='delete'
            color='primary'
            onClick={handleAddQuantity}
          >
            <AddCircleIcon />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

export default FileListItem;

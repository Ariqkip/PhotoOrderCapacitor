//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
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
}));

const FileListItem = ({ file, key }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Paper square key={key} className={classes.root}>
      <img
        src={file.tempURL}
        className={classes.thumbnail}
        alt={file.fileName}
      />
      <div className={classes.aligner}>
        <span className={classes.fileName}>{file.fileName}</span>
        <div>
          <IconButton aria-label='delete' color='secondary'>
            <RemoveCircleIcon />
          </IconButton>
          <span>0</span>
          <IconButton aria-label='delete' color='primary'>
            <AddCircleIcon />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

export default FileListItem;

//Core
import React, { useState } from 'react';

//Components

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

const NotFound = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return <p>404</p>;
};

export default NotFound;

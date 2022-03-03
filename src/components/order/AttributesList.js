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

const AttributesList = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  if (!product) return null;
  if (product.attributes?.length < 1) return null;

  return <p>AttributesList</p>;
};

export default AttributesList;

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

const CategoryCard = ({ category }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  console.log('%cLQS logger: ', 'color: #c931eb', { category });

  return <p>Default component</p>;
};

export default CategoryCard;

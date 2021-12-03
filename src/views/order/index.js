//Core
import React, { useState, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

//Components
import Layout from './Layout';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const OrderIndex = ({ match }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Layout>
      <Suspense fallback={<CircularProgress />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/ok`} />
        </Switch>
      </Suspense>
    </Layout>
  );
};

export default OrderIndex;

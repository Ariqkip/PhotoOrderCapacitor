//Core
import React, { useState, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

//Views
const ViewPhotographer = React.lazy(() =>
  import(/* webpackChunkName: "views-photographer" */ '../views/order/index')
);

const View3dPresenter = React.lazy(() =>
  import(/* webpackChunkName: "views-3dPresenter" */ '../views/show3d/index')
);

const View404 = React.lazy(() =>
  import(/* webpackChunkName: "views-404" */ '../views/NotFoundView')
);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const SuspenseContainer = () => {
  return (
    <>
      <CssBaseline />

      <Grid
        container
        style={{ height: '100vh', paddingTop: '75px' }}
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        <Grid item xs>
          <CircularProgress />
          <br />
          Loading
        </Grid>
      </Grid>
    </>
  );
};

const Router = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Suspense fallback={<SuspenseContainer />}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path='/share3d/:photographerId/:productId/:guid'
            render={(props) => <View3dPresenter {...props} />}
          />
          <Route
            path='/photographer/:id'
            render={(props) => <ViewPhotographer {...props} />}
          />
          {/* HACK: temporary redirect in case of old urls */}
          <Route
            path='/:id'
            render={(props) => <ViewPhotographer {...props} />}
          />
          <Route render={(props) => <View404 {...props} />} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;

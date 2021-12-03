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

const Router = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Suspense fallback={<CircularProgress />}>
      <BrowserRouter>
        <Switch>
          <Route
            path='/photographer/:id'
            render={(props) => <ViewPhotographer {...props} />}
          />
          <Route
            path='/share3d/:guid'
            render={(props) => <View3dPresenter {...props} />}
          />
          <Route path='/404' render={(props) => <View404 {...props} />} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;

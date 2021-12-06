//Core
import React, { useState, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

//Components
import Layout from './Layout';
import CategoriesView from './CategoriesView';
import ProductsView from './ProductsView';
import CheckoutView from './CheckoutView';
import ContactView from './ContactView';

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
    <Layout photographerId={match?.params?.id ?? 0}>
      <Suspense fallback={<CircularProgress />}>
        <Switch>
          <Redirect
            exact
            from={`${match.url}/`}
            to={`${match.url}/categories`}
          />
          <Route
            exact
            path={`${match.url}/categories`}
            render={(props) => <CategoriesView {...props} />}
          />
          <Route
            exact
            path={`${match.url}/products`}
            render={(props) => <ProductsView {...props} />}
          />
          <Route
            path={`${match.url}/checkout`}
            render={(props) => <CheckoutView {...props} />}
          />
          <Route
            path={`${match.url}/contact`}
            render={(props) => <ContactView {...props} />}
          />
        </Switch>
      </Suspense>
    </Layout>
  );
};

export default OrderIndex;

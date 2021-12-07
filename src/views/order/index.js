//Core
import React, { useState, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: false,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000 * 10, //10 minutes
      retry(failureCount, error) {
        if (error.status === 404) return false;
        else if (failureCount < 2) return true;
        else return false;
      },
    },
  },
});

const OrderIndex = ({ match }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default OrderIndex;

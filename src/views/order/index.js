//Core
import React, { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

//Components
import Layout from './Layout';
import CategoriesView from './CategoriesView';
import ProductsView from './ProductsView';
import CheckoutView from './CheckoutView';
import ContactView from './ContactView';

//Hooks
import { useTranslation } from 'react-i18next';
import { useGetPhotographer } from '../../services/OrderUtils';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  spinner: {
    color: '#743c6e',
  },
}));

const cleanMatchUrl = (match) => {
  if (match.url.endsWith('/')) {
    return match.url.slice(0, -1);
  }

  return match.url;
};

const SuspenseContainer = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth='sm'>
        <Typography
          component='div'
          style={{ backgroundColor: '#cfe8fc', height: '100vh' }}
        />
      </Container>
    </>
  );
};

const OrderIndex = ({ match }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const url = cleanMatchUrl(match);
  const [, dispatch] = usePhotographer();

  const photographerQuery = useGetPhotographer(match?.params?.id ?? 0);
console.log('%cLQS render order.index: ', 'color: #c931eb', {
  photographerQuery,
});

function redirectCategoriesFlag(query) {
  if (!query.isSuccess) return false;
  if (!query.data?.Categories) return false;
  if (query.data?.Categories?.length < 1) return false;

  return true;
}

function isLoading(query) {
  if (query.isLoading) return true;
  if (query.isFetching) return true;

  return false;
}

const { data } = photographerQuery;
useEffect(() => {
  if (data) {
    dispatch({ type: 'SET_INFO', data: data });
  }
}, [data, dispatch]);

return (
  <Layout photographerId={match?.params?.id ?? 0}>
    <Backdrop className={classes.backdrop} open={isLoading(photographerQuery)}>
      <CircularProgress className={classes.spinner} />
    </Backdrop>
    <Suspense fallback={<SuspenseContainer />}>
      <Switch>
        {redirectCategoriesFlag(photographerQuery) && (
          <Redirect exact from={`${url}/`} to={`${url}/categories`} />
        )}
        {!redirectCategoriesFlag(photographerQuery) && (
          <Redirect exact from={`${url}/`} to={`${url}/products`} />
        )}
        <Route
          exact
          path={`${url}/categories`}
          render={(props) => <CategoriesView {...props} />}
        />
        <Route
          exact
          path={`${url}/products`}
          render={(props) => <ProductsView {...props} />}
        />
        <Route
          path={`${url}/products/:itemId`}
          render={(props) => <ProductsView {...props} />}
        />
        <Route
          path={`${url}/checkout`}
          render={(props) => <CheckoutView {...props} />}
        />
        <Route
          path={`${url}/contact`}
          render={(props) => <ContactView {...props} />}
        />
      </Switch>
    </Suspense>
  </Layout>
);
};

export default OrderIndex;

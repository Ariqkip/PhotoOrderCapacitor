//Core
import React, { Suspense } from 'react';
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

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const OrderIndex = ({ match }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const url = cleanMatchUrl(match);

  const photographerQuery = useGetPhotographer(match?.params?.id ?? 0);
  console.log('%cLQS logger: ', 'color: #c931eb', { photographerQuery });

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

  return (
    <Layout photographerId={match?.params?.id ?? 0}>
      <Backdrop
        className={classes.backdrop}
        open={isLoading(photographerQuery)}
      >
        <CircularProgress className={classes.spinner} />
      </Backdrop>
      <Suspense fallback={<CircularProgress />}>
        <Switch>
          {redirectCategoriesFlag(photographerQuery) && (
            <Redirect exact from={`${url}/`} to={`${url}/categories`} />
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

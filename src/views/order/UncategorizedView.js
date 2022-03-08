//Core
import React, { useState, useEffect } from 'react';

//Components
import ProductTypeRenderer from '../../components/order/ProductTypeRenderer';
import CategoryCardSkeleton from '../../components/order/CategoryCardSkeleton';

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';
import { useGetProducts } from '../../services/OrderUtils';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingLeft: '60px',
    paddingRight: '60px',
  },
  grid: {
    flexGrow: 1,
  },
}));

//TODO: this should be independent component/ same code in ProductsView
function RenderSkeletonList() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={1} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={2} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={3} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={4} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={5} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={6} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CategoryCardSkeleton key={7} />
      </Grid>
    </Grid>
  );
}

const UncategorizedView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [photographer, dispatch] = usePhotographer();
  const productsQuery = useGetProducts(photographer?.photographId ?? 0);

  const isLoading = () => {
    if (
      photographer &&
      photographer.products &&
      photographer.products.length > 0
    )
      return false;

    return true;
  };

  const renderProducts = () => {
    let productsList = photographer?.products ?? [];
    productsList = productsList.filter((p) => {
      if (p.categories?.length === 0) return true;
      else return false;
    });
    return (
      <Grid container spacing={3}>
        {productsList.map((product) => {
          if (product.isAutoGenerated === true) return null;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductTypeRenderer key={product.id} product={product} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const { data } = productsQuery;
  console.log('%cLQS logger: ', 'color: #c931eb', { data });
  useEffect(() => {
    if (data) {
      dispatch({ type: 'ADD_PRODUCTS', data: data });
    }
  }, [data, dispatch]);

  return (
    <div className={classes.root}>
      {isLoading() && RenderSkeletonList()}
      {!isLoading() && renderProducts()}
    </div>
  );
};

export default UncategorizedView;

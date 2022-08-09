//Core
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//Components
import CategoryCardSkeleton from '../../components/order/CategoryCardSkeleton';
import ProductBasicCard from '../../components/order/ProductBasicCard';
import ProductTypeRenderer from '../../components/order/ProductTypeRenderer';
import BanerSlider from '../../components/order/BanerSlider';

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

function RenderSkeletonList() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={1} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={2} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={3} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={4} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={5} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={6} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={7} />
      </Grid>
    </Grid>
  );
}

const ProductsView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { categoryId } = useParams();
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
    if (categoryId) {
      const catId = Number(categoryId);
      productsList = productsList.filter((p) => {
        const cat = p.categories?.find((c) => c.id === catId);
        if (cat) return true;
        else return false;
      });
    }
    return (
      <Grid container spacing={3}>
        {productsList.map((product) => {
          if (product.isAutoGenerated === true) return null;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
              <ProductTypeRenderer key={product.id} product={product} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const { data } = productsQuery;
  useEffect(() => {
    if (data) {
      dispatch({ type: 'ADD_PRODUCTS', data: data });
    }
  }, [data, dispatch]);

  return (
    <div className={classes.root}>
      <BanerSlider photographerId={photographer.photographId} />
      {isLoading() && RenderSkeletonList()}
      {!isLoading() && renderProducts()}
    </div>
  );
};

export default ProductsView;

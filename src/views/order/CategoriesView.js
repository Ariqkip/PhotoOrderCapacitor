//Core
import React, { useState } from 'react';

//Components
import CategoryCard from '../../components/order/CategoryCard';
import CategoryCardSkeleton from '../../components/order/CategoryCardSkeleton';

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';

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

const CategoriesView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [photographer] = usePhotographer();

  const renderCategories = () => {
    return (
      <Grid container spacing={3}>
        {photographer.productCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.Id}>
            <CategoryCard key={category.Id} category={category} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const isLoading = () => {
    if (
      photographer.productCategories &&
      photographer.productCategories.length > 0
    )
      return false;

    return true;
  };

  return (
    <div className={classes.root}>
      {isLoading() && RenderSkeletonList()}
      {!isLoading() && renderCategories()}
    </div>
  );
};

export default CategoriesView;

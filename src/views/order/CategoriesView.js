//Core
import React, { useState } from 'react';

//Components
import CategoryCard from '../../components/order/CategoryCard';
import CategoryCardSkeleton from '../../components/order/CategoryCardSkeleton';

//Hooks
import { useTranslation } from 'react-i18next';

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

  return <div className={classes.root}>{RenderSkeletonList()}</div>;
};

export default CategoriesView;

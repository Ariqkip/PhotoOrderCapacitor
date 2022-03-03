//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils
import { formatPrice } from '../../core/helpers/priceHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  cardDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.3rem',
    marginBottom: '16px',
  },
}));

const PriceRangeList = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  if (!product) return null;
  if (product.productPrices?.length < 1) return null;

  const renderPriceRange = (priceRange) => {
    const prices = priceRange
      .filter((item) => item.isDeleted === false)
      .map((item) => (
        <Box key={item.id}>
          <span>
            From <b>{item.priceLevelFrom}</b> to{' '}
            <b>{item.priceLevelTo === 0 ? '∞' : item.priceLevelTo}</b> pcs:{' '}
            <b>{formatPrice(item.price)} €</b>
          </span>
        </Box>
      ));

    return prices;
  };

  return (
    <Typography
      variant='body'
      color='textSecondary'
      component='p'
      className={classes.cardDesc}
    >
      {renderPriceRange(product.productPrices)}
    </Typography>
  );
};

export default PriceRangeList;

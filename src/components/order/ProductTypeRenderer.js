//Core
import React, { useState } from 'react';

//Components
import ProductBasicCard from './ProductBasicCard';
import ProductRangeCard from './ProductRangeCard';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const TYPES = {
  BASIC: 0,
  RANGE: 1,
  RENDER_CUP: 3,
};

const ProductTypeRenderer = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const calculateProductType = () => {
    if (product.productType === 1) return TYPES.RENDER_CUP;
    if (product.productPrices.length > 0) return TYPES.RANGE;

    return TYPES.BASIC;
  };

  const productType = calculateProductType();

  console.log('%cLQS logger: ', 'color: #c931eb', { product, productType });

  return (
    <>
      {productType === TYPES.BASIC && <ProductBasicCard product={product} />}
      {productType === TYPES.RANGE && <ProductRangeCard product={product} />}
    </>
  );
};

export default ProductTypeRenderer;

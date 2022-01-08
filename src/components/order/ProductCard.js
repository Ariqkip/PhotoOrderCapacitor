//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  media: {
    height: 340,
  },
}));

const ProductCard = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card classname={classes.root} key={product.id}>
      <CardActionArea
        onClick={() => {
          console.log('%cLQS logger: ', 'color: #c931eb', {});
        }}
      >
        <CardMedia
          className={classes.media}
          image={product.ImageUrl}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant='h6' component='h6'>
            {product.name}
          </Typography>
          <Typography variant='body' color='textSecondary' component='p'>
            {product.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;

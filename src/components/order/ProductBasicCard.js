//Core
import React, { useState } from 'react';

//Components
import BasicDialog from './BasicDialog';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils
import { formatPrice } from '../../core/helpers/priceHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const placeholderImg = 'https://via.placeholder.com/400?text=No%20image';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  media: {
    width: '100%',
    height: 340,
  },
  cardArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: '1.3rem',
    lineHeight: '1.8rem',
    fontWeight: 600,
    display: 'inline-block',
  },
  cardTitleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  cardDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.3rem',
    marginBottom: '16px',
  },
}));

const ProductBasicCard = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className={classes.root} key={`basic_card_${product.id}`}>
        <CardActionArea
          className={classes.cardArea}
          onClick={() => setDialogOpen(true)}
        >
          <CardMedia
            className={classes.media}
            image={product.ImageUrl ?? placeholderImg}
            title={product.name}
          />
          <CardContent className={classes.fullWidth}>
            <Box
              component='div'
              className={[classes.cardTitleBox, classes.fullWidth]}
            >
              <Typography
                gutterBottom
                component='p'
                className={classes.cardTitle}
              >
                {product.name}
              </Typography>
              <Typography
                gutterBottom
                component='p'
                className={classes.cardTitle}
              >
                € {formatPrice(product.price)}
              </Typography>
            </Box>
            <Typography
              variant='body'
              color='textSecondary'
              component='p'
              className={classes.cardDesc}
            >
              {product.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <BasicDialog
        product={product}
        key={`basic_dialog_${product.id}`}
        isOpen={isDialogOpen}
        closeFn={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ProductBasicCard;

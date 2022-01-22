//Core
import React, { useState, useLayoutEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';

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
  const history = useHistory();
  const location = useLocation();
  const { itemId } = useParams();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpen = (itemId) => {
    const url = history.location.pathname;
    const newUrl = `${url}/${itemId}`;
    history.push(newUrl);
  };

  const handleClose = (itemId) => {
    const url = history.location.pathname;
    const newUrl = url
      .slice(0, url.length - itemId.toString().length)
      .slice(0, -1);

    setDialogOpen(false);
    history.push(newUrl);
  };

  useLayoutEffect(() => {
    if (product.id == itemId) {
      setDialogOpen(true);
    }
  }, [itemId, product]);

  return (
    <>
      <Card className={classes.root} key={`basic_card_${product.id}`}>
        <CardActionArea
          className={classes.cardArea}
          onClick={() => handleOpen(product.id)}
        >
          <CardMedia
            className={classes.media}
            image={product.imageUrl ?? placeholderImg}
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
        closeFn={() => handleClose(product.id)}
      />
    </>
  );
};

export default ProductBasicCard;

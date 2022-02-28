//Core
import React, { useState } from 'react';

//Components
import RoundButton from './../core/RoundButton';
import FileListItem from './FileListItem';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Divider from '@material-ui/core/Divider';

const placeholderImg = 'https://via.placeholder.com/400?text=No%20image';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  fillWidth: {
    width: '100%',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetweenContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: '#3A3A3A',
    fontWeight: 600,
    marginBottom: '20px',
  },
  description: {
    marginBottom: '20px',
  },
  mb24: {
    marginBottom: '24px',
  },
}));

const NextButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}))(Button);

const OtherButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: '#28a745',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #28a745',
    '&:hover': {
      color: 'white',
      backgroundColor: '#28a745',
    },
  },
}))(Button);

const RemoveButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: '#dc3545',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #dc3545',
    '&:hover': {
      color: 'white',
      backgroundColor: '#dc3545',
    },
  },
}))(Button);

const AttributesDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  let fileInput = null;

  const [pack, setPack] = useState(1);
  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();

  const [productAttributes, setProductAttributes] = useState([
    ...product.attributes,
  ]);
  console.log('%cLQS logger: ', 'color: #c931eb', {
    productAttributes,
    photographer,
  });

  const fileInputHandler = (event) => {
    const { files } = event.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const trackingGuid = createGuid();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const orderItem = {
          maxSize: product.size,
          guid: trackingGuid,
          fileAsBase64: reader.result,
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          productId: product.id,
          set: pack,
          qty: 1,
          status: 'idle',
        };

        orderDispatch({ type: 'ADD_ORDER_ITEM', payload: orderItem });
      };
    }
  };

  const handleUploadClick = () => {
    fileInput.click();
  };

  const renderFiles = () => {
    return order.orderItems
      .filter((item) => item.productId === product.id)
      ?.map((item) => <FileListItem key={item.guid} file={item} />);
  };

  const handleRemoveAll = () => {
    orderDispatch({
      type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
      payload: { productId: product.id },
    });
  };

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
  };

  const renderOptions = () => {
    if (productAttributes && productAttributes.length > 0) {
      return (
        <>
          <Typography variant='h5'>{t('Options')}:</Typography>
          {/* {photographer.productAttributes.map(group) => {
              //TODO: foreach group of attributes check product available attr and render btns
          }} */}
        </>
      );
    }

    return <></>;
  };

  return (
    <Dialog
      key={product.id}
      fullWidth={true}
      maxWidth={'md'}
      open={isOpen ?? false}
      onClose={closeFn}
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Grid container spacing={3} className={classes.mb24}>
            <Grid item xs={12} md={6}>
              <Container>
                <img
                  src={product.imageUrl ?? placeholderImg}
                  alt=''
                  style={{ width: '100%' }}
                />
              </Container>
              <Box className={classes.centerContent}>
                <input
                  type='file'
                  style={{ display: 'none' }}
                  inputprops={{ accept: 'image/*' }}
                  multiple
                  onChange={fileInputHandler}
                  ref={(input) => {
                    fileInput = input;
                  }}
                />
                <RoundButton onClick={() => handleUploadClick()}>
                  <Box className={classes.centerContent}>
                    <AddPhotoAlternateIcon />
                    <span>{t('Pick files')}</span>
                  </Box>
                </RoundButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.spaceBetweenContent}>
                <Box>
                  <Typography variant='h6' className={classes.title}>
                    {product.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h6' className={classes.title}>
                    {product.price} €
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' className={classes.description}>
                {product.description}
              </Typography>
              {renderOptions()}
            </Grid>
          </Grid>
          {renderFiles()}
        </DialogContentText>
        <Divider />
      </DialogContent>
      <DialogActions>
        <RemoveButton onClick={handleRemoveAll} color='primary'>
          {t('REMOVE ALL FILES')}
        </RemoveButton>
        <OtherButton onClick={closeFn} color='primary'>
          {t('Choose other products')}
        </OtherButton>
        <NextButton onClick={handleNext} color='primary'>
          {t('Next step')} <ShoppingCartIcon fontSize='small' />
        </NextButton>
      </DialogActions>
    </Dialog>
  );
};

export default AttributesDialog;

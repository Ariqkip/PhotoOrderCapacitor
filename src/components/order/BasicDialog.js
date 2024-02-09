//Core
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';

//Components
import RoundButton from './../core/RoundButton';
import FileListItem from './FileListItem';
import PriceRangeList from './PriceRangeList';
import AttributesList from './AttributesList';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';
import { formatPrice, getLabelPrice } from '../../core/helpers/priceHelper';
import { getFileDimensions, getCompressedImage, isHeicFile } from '../../core/helpers/uploadImageHelper';
import OrderService from '../../services/OrderService';
import { getUnsavedImages } from '../../services/TokenService';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
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
import CircularProgress from '@material-ui/core/CircularProgress';

const placeholderImg = 'https://via.placeholder.com/400?text=No%20image';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
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
  p6: {
    padding: '6px',
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

const OptionsButton = withStyles((theme) => ({
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

const BasicDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const fileInput = useRef(null);
  const scrollToRef = useRef(null);
  const scrollOptionsRef = useRef(null);

  const [pack, setPack] = useState(1);
  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();
  const orderService = OrderService();
  const [orderData, setOrderData] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputGallery = useRef(null);
  const fileInputDrive = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [test, setTest] = useState();

  useEffect(() => {
    const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
    
    setOrderData(orderDataFromStorage);

    async function initOldImages() {
      const unsavedImage = await getUnsavedImages();
      const isUnsavedImagesUploaded = localStorage.getItem("isUnsavedImagesUploaded");
      const isHaveUnsavedImages = 
        unsavedImage && 
        unsavedImage?.length > 0 && 
        !orderDataFromStorage?.orderItems?.length &&
        !isUnsavedImagesUploaded &&
        unsavedImage?.[0].ProductId === product.id;
        
      const updatedOrderData = { ...orderData };
      
      if (isHaveUnsavedImages) {
        unsavedImage.map((imgObj) => {
          const orderItem = {
            maxSize: product.size,
            guid: createGuid(),
            fileAsBase64: imgObj.imageData,
            fileUrl: null,
            fileName: imgObj?.FileName,
            productId: imgObj?.ProductId,
            set: pack,
            qty: 1,
            status: 'idle',
          };
  
          if (!updatedOrderData?.orderItems) {
            updatedOrderData.orderItems = [];
          }
  
          updatedOrderData?.orderItems.push(orderItem);
          orderService.setCurrentOrderToStorage(updatedOrderData, photographer.photographId);
          
          setOrderData(updatedOrderData);
          orderDispatch({ type: 'ADD_ORDER_ITEM', payload: {...orderItem, fileAsBase64: imgObj.imageData} });
        })
      }
    }

    !orderDataFromStorage?.orderItems?.length && initOldImages()
  }, []);  

  const executeScroll = () =>
    scrollToRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    
  const executeOptionsScroll = () =>
    scrollOptionsRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });

  // const [test, setTest] = useState();

  // const selectFile = async () => {
  //   try {
  //     const fileUri = await Filesystem.getUri({ 
  //       path: '1661526806164_scooter.jpg',
  //       directory: Directory.Pictures,
  //     });
  
  //     setTest(fileUri);
  //   } catch (error) {
  //     console.error('Error selecting file:', error);
  //   }
  // };
    
  const fileInputHandler = useCallback(async (event) => {
    const { files } = event.target;
    const filesArray = Array.from(files);
  
    for (const file of filesArray) {
      try {
        const isHeic = isHeicFile(file.name);
        if (!file.type.startsWith('image') && !isHeic) {
          continue;
        }
  
        const trackingGuid = createGuid();
        const reader = new FileReader();
        const { width, height, convertedFile } = await getFileDimensions(file);
        
        const compressedFile = !isHeic && await getCompressedImage({
          width,
          height,
          maxSize: product.size,
          file
        });
  
        reader.readAsDataURL(isHeic ? convertedFile : compressedFile);
        reader.onloadend = async () => {
          const orderItem = {
            maxSize: product.size,
            guid: trackingGuid,
            fileAsBase64: null,
            fileUrl: URL.createObjectURL(isHeic ? convertedFile : compressedFile),
            fileName: isHeic ? convertedFile.name : compressedFile.name,
            productId: product.id,
            set: pack,
            qty: 1,
            status: 'idle',
          };

          const updatedOrderData = { ...orderData };

          if (!updatedOrderData?.orderItems) {
            updatedOrderData.orderItems = [];
          }
          updatedOrderData?.orderItems.push(orderItem);
          const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
          const orderDataList = orderDataFromStorage?.orderItems;

          orderService.setCurrentOrderToStorage(
            { 
              ...updatedOrderData, 
              orderItems: [...orderDataList, orderItem],  
            },
            photographer.photographId
          );

          setOrderData(updatedOrderData);
          orderDispatch({ type: 'ADD_ORDER_ITEM', payload: {...orderItem, fileAsBase64: reader.result} });
          handleCloseModal();
          executeScroll();
        };
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
  }, [product, pack, orderDispatch, executeScroll]);

  const isAllImagesDone = () => {
    return order?.orderItems.every(item => item.status === "success");
  };

  const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));

  useEffect(() => {
    if (orderDataFromStorage?.orderItems?.length > 0 && orderDataFromStorage?.orderItems?.length !== order?.orderItems?.length) {
      orderDispatch({ type: 'ADD_ORDER_ITEMS_AT_END', payload: orderDataFromStorage.orderItems });
    }
  }, [orderDataFromStorage?.orderItems?.length]);

  const renderFiles = () => {
    return order?.orderItems
      .filter((item) => item.productId === product.id)
      .map((item) => <FileListItem key={item.guid} file={item} />)
  };

  const handleRemoveAll = () => {
    const updatedOrderData = { ...orderData, orderItems: [] };
    orderService.setCurrentOrderToStorage(updatedOrderData, photographer.photographId);
    setOrderData(updatedOrderData);

    orderDispatch({
      type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
      payload: { productId: product.id },
    });
  };

  const isNextDisabled = () => {
    const files = order?.orderItems.filter((item) => item.productId === product.id);
    return files.length === 0;
  };  

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
  };

  const calculatePrice = () => {
    const quantity = order?.orderItems
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.qty, 0);
    return getLabelPrice(product.id, quantity, photographer, order);
  };

  const attributesAvailable = () => {
    if (!product) return false;
    if (!product.attributes) return false;

    return product.attributes.length > 0;
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
                  style={{ width: '100%', maxHeight: '800px' }}
                />
              </Container>
              <Box className={classes.centerContent}>
                <RoundButton onClick={handleOpenModal}>
                  <Box className={classes.centerContent}>
                    <AddPhotoAlternateIcon />
                    <span>{t('Pick files')}</span>
                  </Box>
                </RoundButton>
              </Box>
              <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogContent style={{ display: 'flex', flexDirection: 'column'}}>
                  <RoundButton 
                    onClick={() => fileInputGallery.current.click()}
                    style={{ width: '100%', marginBottom: '1rem' }}  
                  >
                    Gallery
                  </RoundButton>
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    inputprops={{ accept: 'image/*, .heic' }}
                    multiple
                    onChange={fileInputHandler}
                    ref={fileInputGallery}
                    accept="image/*, .heic"
                  />
                  <RoundButton 
                    onClick={() => fileInputDrive.current.click()}
                    style={{ width: '100%' }}  
                  >
                    Google Drive
                  </RoundButton>
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/*,.heic,application/vnd.google-apps.drive-sdk'
                    multiple
                    onChange={fileInputHandler}
                    ref={fileInputDrive}
                  />
                </DialogContent>
              </Dialog>
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
                    {formatPrice(calculatePrice())} €
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' className={classes.description}>
                {product.description}
              </Typography>
              <PriceRangeList
                product={product}
                photographer={photographer}
                order={order}
              />
              <div ref={scrollOptionsRef} />
              <AttributesList product={product} pack={pack} />
            </Grid>
          </Grid>
          <div ref={scrollToRef} />
          {renderFiles()}
        </DialogContentText>
        <Divider />
      </DialogContent>
      <DialogActions>
        <Grid
          container
          spacing={0}
          direction='row'
          justifyContent='space-between'
        >
          <Grid
            item
            xs={6}
            md={4}
            className={`${classes.centerContent} ${classes.p6}`}
          >
            <RemoveButton onClick={handleRemoveAll} color='primary'>
              {t('REMOVE ALL')}
            </RemoveButton>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            className={`${classes.centerContent} ${classes.p6}`}
          >
            <NextButton
              onClick={handleNext}
              color='primary'
              disabled={isNextDisabled() || !isAllImagesDone()}
            >
              {!isAllImagesDone() ? (
                <CircularProgress size={22} />
              ) : (
                <>
                  {t('Next step')} <ShoppingCartIcon fontSize='small' />
                </>
              )}
            </NextButton>
          </Grid>
          <Hidden mdUp>
            {attributesAvailable() && (
              <Grid
                item
                xs={12}
                className={`${classes.centerContent} ${classes.p6}`}
              >
                <OptionsButton onClick={executeOptionsScroll} color='primary'>
                  {t('OPTIONS')}
                </OptionsButton>
              </Grid>
            )}
          </Hidden>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default BasicDialog;

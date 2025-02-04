//Core
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory } from '@capacitor/filesystem';

//Components
import RoundButton from '../core/RoundButton';
import FileListItem from './FileListItem';
import PriceRangeList from './PriceRangeList';
import AttributesList from './AttributesList';
import Render3dDialog from './Render3dDialog';
import Render3dWizard from './Render3dWizard/Render3dWizard';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';
import { formatPrice, getLabelPrice } from '../../core/helpers/priceHelper';
import { getCompressedImage } from '../../core/helpers/uploadImageHelper';
import DatabaseService from '../../services/TokenService';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Divider from '@material-ui/core/Divider';
import OrderService from '../../services/OrderService';
import TokenService from '../../services/TokenService';
import { ContentUriResolver } from 'capacitor-content-uri-resolver';

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

const getProductCategory = (url) => {
  const urlPaths = url.split('/');
  return urlPaths[urlPaths.length - 2];
};

const Basic3dDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const context = useOrder();

  const scrollToRef = useRef(null);
  const scrollOptionsRef = useRef(null);

  const [pack, setPack] = useState(1);
  const [open3d, setOpen3d] = useState(false);
  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();
  const orderService = OrderService();

  const [isReadyReupload, setIsReadyReupload] = useState(false);
  const [itemsToReupload, setItemsToReupload] = useState([]);

  const orderDataFromStorage = JSON.parse(
    orderService.getCurrentOrderFromStorage(photographer.photographId)
  );

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

  const getShortImagePath = (path) => {
    const slashIndices = [];

    for (let i = 0; i < path?.length; i++) {
      if (path[i] === '/') {
        slashIndices.push(i);
      }
    }

    if (slashIndices.length < 4) {
      return path;
    }

    return path.substring(slashIndices[3]);
  };

  const getMaxFileLimit = () => {
    const max = product?.sizes?.length ?? 1;
    return max;
  };

  const getUploadedFilesCount = () => {
    if (!order || order.orderItems?.length === 0) return 0;

    const uploadedFiles = order.orderItems.filter(
      (i) => i.productId === product.id
    );
    return uploadedFiles?.length ?? 0;
  };

  const disableUploadButton = () => {
    const limit = getMaxFileLimit();
    const current = getUploadedFilesCount();

    return current >= limit;
  };

  const fileInputHandler = useCallback(async () => {
    try {
      const limit = getMaxFileLimit();
      const actual = getUploadedFilesCount();

      if (limit <= actual) return;

      var files = [];
      if (Capacitor.getPlatform() === 'ios') {
        const result = await TokenService.pickPhotoFromIOS();
        files = result.files;
      } else {
        const result = await FilePicker.pickImages({
          multiple: true,
        });
        files = result.files;
      }

      const iterator = files[Symbol.iterator]();
      let nextFile = iterator.next();

      const updatedOrderData = { ...orderDataFromStorage };
      const updatedUnsavedFiles = [];

      const processNextFile = async () => {
        if (!nextFile.done) {
          const file = nextFile.value;
          const trackingGuid = createGuid();

          let absolutePath = null;
          let readFileResult;

          if (Capacitor.getPlatform() === 'android') {
            const pathResult =
              await ContentUriResolver.getAbsolutePathFromContentUri({
                context: context,
                contentUri: file.path,
              });
            absolutePath = pathResult.absolutePath;
            const shortPath = getShortImagePath(absolutePath);

            readFileResult = await Filesystem.readFile({
              path: shortPath,
              directory: Directory.ExternalStorage,
            });
          } else if (Capacitor.getPlatform() === 'ios') {
            // for ios , do not read image data again
            readFileResult = { data: file.data };
          } else {
            readFileResult = await Filesystem.readFile({
              path: file.path,
            });
          }

          const base64Data = readFileResult.data;
          
          const compressedFile = await getCompressedImage({
            width: file.width,
            height: file.height,
            maxSize: product.size,
            file: { data: base64Data, name: file.name },
          });
          
          const orderItem = {
            price: formatPrice(calculatePrice()),
            maxSize: product.size,
            guid: trackingGuid,
            fileAsBase64: null,
            fileUrl: 'test',
            fileName: compressedFile.file.name,
            productId: product.id,
            filePath: absolutePath || file.path || file.localId,
            categoryId: getProductCategory(location.pathname),
            set: pack,
            qty: 1,
            status: 'idle',
          };

          if (!updatedOrderData?.orderItems) {
            updatedOrderData.orderItems = [];
          }
          updatedOrderData?.orderItems.push(orderItem);
          updatedUnsavedFiles.push({ filePath: file.path, guid: trackingGuid });

          orderDispatch({
            type: 'ADD_ORDER_ITEM',
            payload: {
              ...orderItem,
              fileAsBase64: compressedFile.fileAsBase64,
            },
          });
          executeScroll();
          nextFile = iterator.next();
          processNextFile();
        } else {
          orderService.setCurrentOrderToStorage(
            {
              ...updatedOrderData,
              unsavedFiles: updatedUnsavedFiles,
            },
            photographer.photographId
          );
        }
      };

      processNextFile();
    } catch (error) {
      console.error('Error picking images:', error);
    }
  }, [product, pack, orderDispatch, executeScroll]);

  const isAllImagesDone = () => {
    return order?.orderItems.every((item) => item.status === 'success');
  };

  useEffect(() => {
    const reuploadData = async () => {
      const orderDataFromStorage = JSON.parse(
        orderService.getCurrentOrderFromStorage(photographer.photographId)
      );
      const isThereAnyUnsavedFiles = orderDataFromStorage?.unsavedFiles?.length;

      if (isThereAnyUnsavedFiles) {
        setIsReadyReupload(true);
        setItemsToReupload(orderDataFromStorage?.unsavedFiles);
      }

      if (orderDataFromStorage?.readyToReupload) {
        await handleReupload(orderDataFromStorage?.unsavedFiles);
      }
    };

    reuploadData();
  }, [orderDataFromStorage?.id]);

  useEffect(() => {
    if (
      orderDataFromStorage?.orderItems?.length > 0 &&
      orderDataFromStorage?.orderItems?.length !== order?.orderItems?.length
    ) {
      // handle succeed orders
      const successsOrderData = orderDataFromStorage?.orderItems
        ? orderDataFromStorage?.orderItems?.filter(
            (item) => item.status === 'success'
          )
        : orderDataFromStorage;

      orderDispatch({
        type: 'ADD_ORDER_ITEMS_AT_END',
        payload: successsOrderData,
      });
    }
  }, [orderDataFromStorage?.orderItems?.length]);

  const renderFiles = () => {
    return order.orderItems
      .filter(
        (item) => item.productId === product.id
      )
      ?.map((item) => (
        <FileListItem
          key={item.guid}
          file={item}
          hideQuantity={true}
          hideIncrease={true}
        />
      ));
  };

  const handleRemoveAll = () => {
    const orderDataFromStorage = JSON.parse(
      orderService.getCurrentOrderFromStorage(photographer.photographId)
    );
    const updatedOrderData = {
      ...orderDataFromStorage,
      orderItems: [],
      unsavedFiles: [],
    };
    orderService.setCurrentOrderToStorage(
      updatedOrderData,
      photographer.photographId
    );

    localStorage.setItem('isUnsavedImagesUploaded', 'true');

    orderDispatch({
      type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
      payload: { productId: product.id },
    });
  };

  const isNextDisabled = () => {
    const limit = getMaxFileLimit();
    const current = getUploadedFilesCount();
    
    return current !== limit;
  };

  const calculatePrice = () => {
    // const quantity = order.orderItems
    //   .filter((item) => item.productId === product.id)
    //   .reduce((sum, item) => sum + item.qty, 0);
    return getLabelPrice(product.id, 1, photographer, order);
  };

  const attributesAvailable = () => {
    if (!product) return false;
    if (!product.attributes) return false;

    return product.attributes.length > 0;
  };

  const handleReupload = async (reuploadItems) => {
    const filesToReupload = reuploadItems.filter(
      (item) => item.productId === product.id
    );
    console.log('handleReupload ', reuploadItems);

    const updatedOrderData = { ...orderDataFromStorage, unsavedFiles: [] };
    for (const itemObj of filesToReupload) {
      try {
        let imgObj = {};
        try {
          if (Capacitor.getPlatform() === 'ios') {
            if (itemObj.filePath.startsWith('file://')) {
              // for ios is from doc dir
              const base64data = await OrderService().getBase64DataWithFilePath(
                itemObj.filePath
              );
              imgObj = {
                data: base64data,
                name: itemObj.fileName ?? itemObj.filePath.split('/').pop(),
              };
            } else {
              // for ios is from photo library
              const photo = await TokenService.fetchiOSPhotoDataByID(
                itemObj.filePath
              );
              const compressedFile = await getCompressedImage({
                width: photo.width,
                height: photo.height,
                maxSize: product.size,
                file: { data: photo.data, name: itemObj.fileName },
              });

              imgObj = {
                data: compressedFile.fileAsBase64,
                name:
                  photo.name ||
                  itemObj.fileName ||
                  itemObj.filePath.split('/').pop(),
              };
            }
          } else {
            imgObj = itemObj.filePath.startsWith('content://media')
              ? await DatabaseService.readImageContent(itemObj.filePath)
              : await DatabaseService.getLastOrderImageFromDevice(
                  itemObj.filePath
                );
          }
        } catch (error) {
          if (!imgObj.data) {
            return;
          }
        }

        const orderItem = {
          price: formatPrice(calculatePrice()),
          maxSize: product.size,
          guid: createGuid(),
          fileAsBase64: imgObj.data,
          fileUrl: null,
          filePath: itemObj.filePath,
          fileName: imgObj.name ?? createGuid(),
          categoryId: getProductCategory(location.pathname),
          productId: product.id,
          set: pack,
          isLayerItem: true,
          qty: 1,
          status: 'idle',
        };

        updatedOrderData?.orderItems.push(orderItem);
        orderDispatch({
          type: 'ADD_ORDER_ITEM',
          payload: { ...orderItem, fileAsBase64: imgObj.data },
        });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }
    orderService.setCurrentOrderToStorage(
      updatedOrderData,
      photographer.photographId
    );

    setIsReadyReupload(false);
  };

  return (
    <>
      <Dialog
        key={`3d_${product.id}`}
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
                  {t('filesLimit', { limit: getMaxFileLimit() })}
                </Box>
                <Box className={classes.centerContent}>
                  <RoundButton
                    onClick={fileInputHandler}
                    disabled={disableUploadButton()}
                  >
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
                onClick={() => setOpen3d(true)}
                color='primary'
                disabled={
                  isNextDisabled() || 
                  !isAllImagesDone()}
              >
                {!isAllImagesDone() ? (
                  <CircularProgress size={18} />
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
                  xs={6}
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
      {open3d ? (
        <Render3dWizard
          key={`3d_pr_dialog_${product.id}`}
          isOpen={open3d}
          closeFn={() => setOpen3d(false)}
          product={product}
          pack={pack}
          photographer={photographer}
        />
      ) : <></>}
    </>
  );
};

export default Basic3dDialog;

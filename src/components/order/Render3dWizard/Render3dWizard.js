//Core
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory } from '@capacitor/filesystem';

//Components
import View3d from '../../3d/View3d';
import RoundButton from './../../core/RoundButton';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useOrder } from '../../../contexts/OrderContext';

//Utils
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createGuid } from '../../../core/helpers/guidHelper';
import OrderService from '../../../services/OrderService';
import TokenService from '../../../services/TokenService';
import { ContentUriResolver } from 'capacitor-content-uri-resolver';
import { getCompressedImage } from '../../../core/helpers/uploadImageHelper';
import { formatPrice, getLabelPrice } from '../../../core/helpers/priceHelper';

//UI
import AddPhotoAlternateOutlined from '@material-ui/icons/AddPhotoAlternateOutlined';
import Box from '@material-ui/core/Box';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteOutlineOutlined from'@material-ui/icons/DeleteOutlineOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

import PhotoFrame from '../../PhotoFrame/PhotoFrame';

//Assets
import shareImg from '../../../assets/share2.jpg';
import { useStyles, NextButton, OtherButton} from './Buttons';


const Render3dWizard = ({ product, isOpen, closeFn, pack, photographer }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const context = useOrder();
  const location = useLocation();

  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [finalImage, setFinalImage] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [editorRef, setEditorRef] = useState();
  const [editorRatio, setEditorRatio] = useState(0);
  const [hideSelectors, setHideSelectors] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(-1);
  
  const orderService = OrderService();
  const [order, orderDispatch] = useOrder();
  
  const drawingCanvasRef = useRef(null);

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${photographer.photographId}/checkout`);
  };

  const handleClose = () => {
    setIsShareOpen(false);
    closeFn();
  };

  function getOrderItem(items) {
    if (!items || items.length == 0) return null;

    const result = items.find(
      (i) =>
        i.productId == product.id && !i.isLayerItem && i.status == 'success'
    );

    return result;
  }

  function getProductConfig(i) {
    if (!product) return null;
    const { sizes } = product;
    if (!sizes) return null;

    return product.sizes[i];
  }

  const steps = React.useMemo(() => {
    function getSteps() {
      const images = order?.orderItems.filter(
        (i) => i.productId === product.id
      ); 

      images.forEach((s, index) => {
        const sizeConfig = getProductConfig(index);
        if (sizeConfig) {
          s["productConfig"] = sizeConfig
        };
      });

      const editStep = {
        type: 'edit',
        data: images,
      };

      const previewStep = {
        type: 'preview',
        data: {},
      };

      return [editStep, previewStep];
    }

    const newSteps = getSteps();
    return newSteps;
  }, [order.orderItems.length]);
  useEffect(() => {
    let last = steps.length - 1;
    if (last < 0) last = 0;
    setActiveStep(0);
  }, [steps.length]);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const getOrderFromStorage = () => {
    return JSON.parse(
      orderService.getCurrentOrderFromStorage(photographer.photographId)
    );
  };

  function saveTexture(model) {
    const trackingGuid = createGuid();
    const orderDataFromStorage = getOrderFromStorage();

    orderService
      .UploadImage({
        orderId: order?.orderId || orderDataFromStorage?.orderId,
        orderGuid: order?.orderGuid || orderDataFromStorage?.orderGuid,
        productId: product.id,
        fileAsBase64: model,
        fileName: `${trackingGuid}.jpg`,
        fileGuid: trackingGuid,
        attributes: [],
      }).then((res) => {
        const orderDataFromStorage = getOrderFromStorage();
        const updatedOrderItems = orderDataFromStorage?.orderItems;
        updatedOrderItems.push({
          status: 'success',
          price: 0,
          fileAsBase64: null,
          imageGuid: trackingGuid,
          fileUrl: res.data.ImageUri,
          fileName: `${trackingGuid}.jpg`,
          productId: product.id,
          set: pack,
          qty: 1,
          itemAttributes: [],
          filePath: ""
        })

        const updatedOrder = {
          ...orderDataFromStorage,
          // status: 'FINALIZING',
          orderItems: updatedOrderItems,
          unsavedFiles: [],
        };

        orderService.setCurrentOrderToStorage(
          updatedOrder,
          photographer.photographId
        );
      })

    
    setIsShareOpen(true);
  }

  function handleCopy() {
    setCopied(true);
  }

  function isShareDisabled() {
    if (!order) return true;

    const { orderItems } = order;
    const item = getOrderItem(orderItems);
    if (!item) return true;

    return false;
  }

  function isAcceptUploading() {
    const { orderItems } = order;
    const acceptedItem = orderItems.find(
      (i) => i.productId == product.id && !i.isLayerItem
    );

    if (!acceptedItem) return false;

    if (acceptedItem.status == 'processing') return true;

    return false;
  }
  isAcceptUploading();
  function isThisLastStep() {
    if (steps.length == activeStep + 1) return true;

    return false;
  }

  function showAcceptButton() {
    const last = activeStep + 1 >= steps.length;
    const result = last 

    return result;
  }

  const showShareButton = isThisLastStep();
  const showNextButton = isThisLastStep();

  const shareUrl = () => {
    const baseUrl = window.location.origin;
    const { photographerId } = product;
    const { id } = product;

    const item = getOrderItem(order.orderItems);
    const fullGuidUrl = item?.fileUrl ?? '';
    const storageUrl = `${process.env.REACT_APP_STORAGE_PATH}/customerorderphoto`;
    const shortGuid = fullGuidUrl.replace(`${storageUrl}/`, '');
    const encodedGuid = encodeURIComponent(shortGuid);

    return `${baseUrl}/share3d/${photographerId}/${id}/${encodedGuid}`;
  };

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

  const calculatePrice = () => {
    return getLabelPrice(product.id, 1, photographer, order);
  };

  const getProductCategory = (url) => {
    const urlPaths = url.split('/');
    return urlPaths[urlPaths.length - 2];
  };

  const fileInputAddHandler = useCallback(async () => {
    try {
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

      const updatedOrderData = { ...order.orderItems };
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
}, [product, pack, orderDispatch]);

  useEffect(() => {
    const last = activeStep + 1 == steps.length;
    if (isOpen && last) {
      setTimeout(() => {
        setRefresh((prev) => prev + 1);
      }, 5000);
    }
  }, [steps.length, refresh, activeStep, isOpen]);

  const removeSelectedPhoto = () =>{
    setSelectedPhoto(null);
    orderDispatch({
      type: 'DECRESE_ORDER_ITEM_QTY',
      payload: { guid: steps[0].data[selectedPhoto].guid },
    });
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={isOpen ?? false}
        onClose={handleClose}
        scroll='paper'
      >
        <DialogContent>
          <Stepper alternativeLabel nonLinear activeStep={activeStep}>
            {steps.map((step, index) => {
              const stepProps = {};
              const buttonProps = {};
              if (step.type == 'edit' && step.data[0]?.fileUrl) {
                buttonProps.icon=(<EditIcon/>);
              }
              if (step.type == 'preview' && product.imageUrl) {
                buttonProps.icon=<VisibilityIcon/>;
              }
              if (step.type == 'share') {
                buttonProps.optional = (
                  <div
                    className={`${
                      index == activeStep
                        ? classes.thumbImageSelected
                        : classes.thumbImage
                    } ${classes.shareBox}`}
                  >
                    <DoneAllIcon />
                  </div>
                );
              }
              return (
                <Step key={step.data.guid} {...stepProps}>
                  <StepButton
                    onClick={handleStep(index)}
                    // completed={isStepComplete(index)}
                    {...buttonProps}
                  >
                    {/* {label} */}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>

          {steps.map((step, index) => {
            if (step.type == 'edit') {
              if(index === activeStep && finalImage){
                setHideSelectors(false);
                setFinalImage(null);
              }
              const stepImages = step.data.map(d=>(<img src={d.fileUrl} naturalWidth={d?.productConfig?.width} naturalHeight={d?.productConfig?.height}/>));
              const replaceFileBtn = (
                <div>
                  <RoundButton
                    size='small'
                    onClick={fileInputAddHandler}
                    disabled={selectedPhoto<0}
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <Box className={classes.centerContent}>
                      <CachedIcon />
                      <span>{t('Replace file')}</span>
                    </Box>
                  </RoundButton>
                </div>
              );
              const removeFileBtn = (
                <div>
                  <RoundButton
                    size='small'
                    onClick={() => removeSelectedPhoto()}
                    disabled={selectedPhoto<0}
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <Box className={classes.centerContent}>
                      <DeleteOutlineOutlined />
                      <span>{t('Remove photo')}</span>
                    </Box>
                  </RoundButton>
                </div>
              )
              const addFloatingImageBtn = (
                <div>
                  <RoundButton
                    size='small'
                    onClick={fileInputAddHandler}
                    disabled={false}
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <Box className={classes.centerContent}>
                      <AddPhotoAlternateOutlined />
                      <span>{t('Add photo')}</span>
                    </Box>
                  </RoundButton>
                </div>
              );
              return (
                <div className={ index == activeStep ? classes.visible : classes.hidden }>

                  <PhotoFrame
                    stepData={step.data}
                    frameUrl={product.layerImageUrl}
                    photos={stepImages}
                    hideSelectors={hideSelectors}
                    setSelectedPhoto={setSelectedPhoto}
                    setEditorRef={setEditorRef}
                    setEditorRatio={setEditorRatio}
                    replaceFileBtn={replaceFileBtn}
                    removeFileBtn={removeFileBtn}
                    addFloatingImageBtn={addFloatingImageBtn}/>
                </div>
              )
            }
            if (step.type == 'preview') {
              if(index === activeStep && !finalImage){
                if(!hideSelectors){
                  setHideSelectors(true);
                }else{

                  setTimeout(()=>{
                    const uri = editorRef.current.toDataURL({
                      pixelRatio: editorRatio
                    });
                    setFinalImage(uri);
                  }, 500);
                }
              }
              return (
                <div className={classes.centerContent}>
                  <div
                    className={
                      index === activeStep ? classes.visible : classes.hidden
                    }
                  >
                    {finalImage && (
                      <View3d
                        textureUrl={finalImage}
                        modelUrl={product.objUrl}
                        saveFn={() => {}}
                      />
                    )}
                    {!finalImage && (
                      <div className={classes.centerContent}>
                        <CircularProgress />
                      </div>
                    )}
                    <canvas ref={drawingCanvasRef} className={classes.hidden} />
                  </div>
                </div>
              );
            }
            if (step.type == 'share') {
              return (
                <div className={classes.centerContent}>
                  <div
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <p>share page step</p>
                  </div>
                </div>
              );
            }
          })}

          <Divider />
        </DialogContent>
        <DialogActions>
          <div className={classes.btnContainer}>
            {showAcceptButton() ? (
              <>
                <OtherButton
                  onClick={() => setActiveStep(0)}
                  color='primary'
                  className={classes.m6}
                >
                  {t('Back')}
                </OtherButton>
                <NextButton
                  onClick={() => saveTexture(finalImage)}
                  color='primary'
                  className={classes.m6}
                  disabled={isAcceptUploading()}
                >
                  {isAcceptUploading() ? <CircularProgress /> : t('Accept')}
                </NextButton>
              </>
            ):(
              <>
                <OtherButton
                  onClick={closeFn}
                  color='primary'
                  className={classes.m6}
                >
                  {t('Back')}
                </OtherButton>
                <NextButton
                  onClick={() => setActiveStep(1)}
                  color='primary'
                  className={classes.m6}
                  disabled={isAcceptUploading()}
                >
                  {isAcceptUploading() ? <CircularProgress /> : t('Next')}
                </NextButton>
              </>
            )}
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={isShareOpen ?? false}
        onClose={handleClose}
      >
        <DialogContent>
          <div
            className={`${classes.centerHorizontal}, ${classes.centerContent}`}
          >
            <img
              src={shareImg}
              alt='Share img'
              style={{ width: '300px', height: '300px' }}
            />
            <div className={classes.newLines}>{t('ShareCTA')}</div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className={classes.btnContainer}>
            {showShareButton && (
              <CopyToClipboard text={shareUrl()}>
                <OtherButton
                  onClick={handleCopy}
                  color='primary'
                  className={classes.m6}
                  disabled={isShareDisabled()}
                >
                  {copied ? t('Copied') : t('Share')}
                </OtherButton>
              </CopyToClipboard>
            )}
            {showNextButton && (
              <NextButton
                onClick={handleNext}
                color='primary'
                className={classes.m6}
              >
                {t('Next step')}
              </NextButton>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Render3dWizard;

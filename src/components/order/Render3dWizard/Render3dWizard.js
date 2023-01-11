//Core
import React, { useState, useEffect, useRef } from 'react';

//Components
import View3d from '../../3d/View3d';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../../contexts/OrderContext';

//Utils
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createGuid } from '../../../core/helpers/guidHelper';

//UI
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import PhotoFrame from '../../PhotoFrame/PhotoFrame';

//Assets
import shareImg from '../../../assets/share2.jpg';
import { useStyles, NextButton, OtherButton} from './Buttons';


const Render3dWizard = ({ product, isOpen, closeFn, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  let fileInput = null;

  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [finalImage, setFinalImage] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [editorRef, setEditorRef] = useState();

  const [order, orderDispatch] = useOrder();

  const drawingCanvasRef = useRef(null);

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
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
      const images = order.orderItems.filter(
        (i) => i.productId === product.id && i.isLayerItem === true
      );
      images.forEach((s, index) => {
        const sizeConfig = getProductConfig(index);
        if (sizeConfig) s.productConfig = sizeConfig;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.orderItems]);

  useEffect(() => {
    let last = steps.length - 1;
    if (last < 0) last = 0;
    setActiveStep(0);
  }, [steps.length]);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  function saveTexture(model) {
    const trackingGuid = createGuid();
    const newOrderItem = {
      maxSize: product.size,
      guid: trackingGuid,
      fileAsBase64: model,
      fileUrl: '',
      fileName: `${trackingGuid}.jpg`,
      productId: product.id,
      set: pack,
      qty: 1,
      status: 'idle',
    };

    orderDispatch({ type: 'ADD_ORDER_ITEM_TEXTURE_3D', payload: newOrderItem });
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
    const isShareDisabledResult = isShareDisabled();
    const last = activeStep + 1 >= steps.length;
    const result = last && isShareDisabledResult;

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

  const handleUploadClick = () => {
    fileInput.click();
  };

  const fileInputHandler = (e) => {
    const { files } = e.target;
    const newFile = files[0] ?? null;

    if (!newFile) return;

    const trackingGuid = createGuid();
    const reader = new FileReader();
    reader.readAsDataURL(newFile);

    const currentItem = steps[activeStep].data ?? null;

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function () {
        const orderItem = {
          oldGuid: currentItem.guid,
          newGuid: trackingGuid,
          maxSize: product.size,
          fileAsBase64: reader.result,
          fileUrl: URL.createObjectURL(newFile),
          fileName: newFile.name,
          productId: product.id,
          set: pack,
          qty: 1,
          status: 'idle',
          isLayerItem: true,
          width: tempImg.width,
          height: tempImg.height,
        };

        orderDispatch({ type: 'REPLACE_ORDER_ITEM', payload: orderItem });
      };
    };
  };

  useEffect(() => {
    const last = activeStep + 1 == steps.length;
    if (isOpen && last) {
      setTimeout(() => {
        setRefresh((prev) => prev + 1);
      }, 5000);
    }
  }, [steps.length, refresh, activeStep, isOpen]);

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
                buttonProps.optional = (
                  <img
                    src={step.data[0].fileUrl}
                    alt={step.data[0].fileName}
                    className={
                      index == activeStep
                        ? classes.thumbImageSelected
                        : classes.thumbImage
                    }
                  />
                );
              }
              if (step.type == 'preview' && product.imageUrl) {
                buttonProps.optional = (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={
                      index == activeStep
                        ? classes.thumbImageSelected
                        : classes.thumbImage
                    }
                  />
                );
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
                setFinalImage(null)
              }
              const stepImages = step.data.map(d=>(<img src={d.fileUrl} naturalWidth={d.width} naturalHeight={d.height}/>));
              return (
                <div className={ index == activeStep ? classes.visible : classes.hidden }>
                  <PhotoFrame data={step.data} frame={product.layerImageUrl} photos={stepImages} setEditorRef={setEditorRef}/>
                </div>
              )
            }
            if (step.type == 'preview') {
              if(index === activeStep && !finalImage){
                const uri = editorRef.current.toDataURL({
                  pixelRatio: 2
                });
                setFinalImage(uri)
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
            <OtherButton
              onClick={closeFn}
              color='primary'
              className={classes.m6}
            >
              {t('Back')}
            </OtherButton>
            {showAcceptButton() && (
              <NextButton
                onClick={() => saveTexture(finalImage)}
                color='primary'
                className={classes.m6}
                disabled={isAcceptUploading()}
              >
                {isAcceptUploading() ? <CircularProgress /> : t('Accept')}
              </NextButton>
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

//Core
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

//Components
import Cropper from '../3d/Cropper';
import View3d from '../3d/View3d';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';
import { CopyToClipboard } from 'react-copy-to-clipboard';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

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
  fullWidth: {
    width: '100%',
  },
  p6: {
    padding: '6px',
  },
  m6: {
    margin: '6px',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerHorizontal: {
    display: 'flex',
    justifyContent: 'center',
  },
  visible: {
    display: 'block',
    width: '100%',
  },
  hidden: {
    display: 'none',
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
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  thumbImage: {
    width: '100%',
    maxWidth: '100px',
    height: '100%',
    maxHeight: '60px',
    marginTop: '4px',
  },
  thumbImageSelected: {
    width: '100%',
    maxWidth: '100px',
    height: '100%',
    maxHeight: '60px',
    marginTop: '4px',
    border: 'solid 2px blue',
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

const Render3dWizard = ({ product, isOpen, closeFn, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [finalImage, setFinalImage] = useState(null);
  const [finalImageReady, setFinalImageReady] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [order, orderDispatch] = useOrder();

  const drawingCanvasRef = useRef(null);

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
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

  function getSteps() {
    const images = order.orderItems.filter(
      (i) => i.productId === product.id && i.isLayerItem === true
    );

    const cropSteps = images.map((s, index) => {
      const sizeConfig = getProductConfig(index);
      if (sizeConfig) s.productConfig = sizeConfig;
      return {
        type: 'crop',
        data: s,
      };
    });

    const previewStep = {
      type: 'preview',
      data: {},
    };
    return [...cropSteps, previewStep];
  }

  const steps = getSteps();

  useEffect(() => {
    let lastStep = steps.length - 1;
    if (lastStep < 0) lastStep = 0;
    setActiveStep(lastStep);
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
      fileName: trackingGuid,
      productId: product.id,
      set: pack,
      qty: 1,
      status: 'idle',
    };

    orderDispatch({ type: 'ADD_ORDER_ITEM_TEXTURE_3D', payload: newOrderItem });
  }

  useEffect(() => {
    function loadImage(src, callback) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        callback(img);
      };

      img.src = src;
    }

    function generateTexture() {
      if (!product) return null;
      if (!product.layerImageUrl) return null;
      if (!steps) return null;
      if (steps.length < 2) return null;

      const err_result = product.layerImageUrl;
      if (!drawingCanvasRef) return err_result;
      if (!drawingCanvasRef.current) return err_result;

      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');

      loadImage(product.layerImageUrl, function (i) {
        canvas.width = i.naturalWidth;
        canvas.height = i.naturalHeight;
        ctx.drawImage(i, 0, 0);
        ctx.save();

        steps.forEach((element) => {
          if (element.type != 'crop') return;

          loadImage(element.data.fileUrl, function (e) {
            const sx = element?.data?.completedCropObj?.x ?? 0;
            const sy = element?.data?.completedCropObj?.y ?? 0;
            const sWidth = element?.data?.completedCropObj?.width ?? 0;
            const sHeight = element?.data.completedCropObj?.height ?? 0;
            const dx = element?.data?.productConfig?.positionX ?? 0;
            const dy = element?.data.productConfig?.positionY ?? 0;
            const dWidth = element?.data?.productConfig?.width ?? 0;
            const dHeight = element?.data?.productConfig?.height ?? 0;

            ctx.drawImage(e, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            ctx.save();
          });
        });
      });

      const url = drawingCanvasRef.current.toDataURL();
      if (url) {
        setFinalImageReady(true);
        return url;
      }

      return product.layerImageUrl;
    }
    const newFinalImage = generateTexture();

    setFinalImage(newFinalImage);
  }, [product, steps]);

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

  function isThisLastStep() {
    if (steps.length == activeStep + 1) return true;

    return false;
  }

  const showAcceptButton = isShareDisabled();

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

  useEffect(() => {
    setTimeout(() => {
      setRefresh((prev) => prev + 1);
    }, 2000);
  }, [finalImageReady]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'lg'}
      open={isOpen ?? false}
      onClose={closeFn}
      scroll='body'
    >
      <DialogContent>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((step, index) => {
            const stepProps = {};
            const buttonProps = {};
            if (step.type == 'crop' && step.data.fileUrl) {
              buttonProps.optional = (
                <img
                  src={step.data.fileUrl}
                  alt={step.data.fileName}
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
          if (step.type == 'crop') {
            const key = step.data.guid;
            return (
              <div className={classes.centerHorizontal}>
                <Cropper
                  uniqKey={key}
                  display={index == activeStep}
                  orderItem={step.data}
                  cropConfig={step.data.productConfig}
                />
              </div>
            );
          } else {
            return (
              <div className={classes.centerContent}>
                <div
                  className={
                    index == activeStep ? classes.visible : classes.hidden
                  }
                >
                  <View3d
                    textureUrl={finalImage}
                    modelUrl={product.objUrl}
                    saveFn={() => {}}
                  />

                  <canvas ref={drawingCanvasRef} className={classes.hidden} />
                </div>
              </div>
            );
          }
        })}

        <Divider />
      </DialogContent>
      <DialogActions>
        <div className={classes.btnContainer}>
          <OtherButton onClick={closeFn} color='primary' className={classes.m6}>
            {t('Back')}
          </OtherButton>
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
          {showAcceptButton && showNextButton && (
            <NextButton
              onClick={() => saveTexture(finalImage)}
              color='primary'
              className={classes.m6}
            >
              {t('Accept')}
            </NextButton>
          )}
          {!showAcceptButton && showNextButton && (
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
  );
};

export default Render3dWizard;

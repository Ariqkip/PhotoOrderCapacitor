//Core
import React, { useState, useEffect, useRef } from 'react';

//Components
import Cropper from '../3d/Cropper';
import View3d from '../3d/View3d';

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

  const [activeStep, setActiveStep] = React.useState(0);
  const [finalImage, setFinalImage] = useState(null);

  const [order] = useOrder();

  const drawingCanvasRef = useRef(null);

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
  // console.log('%cLQS logger: ', 'color: #c931eb', { steps });

  useEffect(() => {
    let lastStep = steps.length - 1;
    if (lastStep < 0) lastStep = 0;
    setActiveStep(lastStep);
  }, [steps.length]);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  function saveTexture(model) {
    console.log('%cLQS logger: saveTexture ', 'color: red', { model });
  }

  useEffect(() => {
    function loadImage(src, callback) {
      console.log('%cLQS logger: loadImage 01', 'color: #c931eb', {});
      var img = new Image();
      img.crossOrigin = 'anonymous';
      console.log('%cLQS logger: loadImage 02', 'color: #c931eb', {});
      img.onload = function () {
        callback(img);
      };
      console.log('%cLQS logger: loadImage 03', 'color: #c931eb', {});
      img.src = src;
      console.log('%cLQS logger: loadImage 04', 'color: #c931eb', {});
    }

    function generateTexture() {
      if (!product) return null;
      if (!product.layerImageUrl) return null;

      const err_result = product.layerImageUrl;
      if (!drawingCanvasRef) return err_result;
      if (!drawingCanvasRef.current) return err_result;

      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');

      loadImage(product.layerImageUrl, function (i) {
        console.log('%cLQS logger: after loadImage', 'color: #c931eb', { i });
        canvas.width = i.naturalWidth;
        canvas.height = i.naturalHeight;
        ctx.drawImage(i, 0, 0);
        ctx.save();

        steps.forEach((element) => {
          if (element.type != 'crop') return;

          console.log('%cLQS logger: ', 'color: #c931eb', { element });
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

      //     const sx = steps[0]?.data?.completedCropObj?.x ?? 0;
      //     const sy = steps[0]?.data?.completedCropObj?.y ?? 0;
      //     const sWidth = steps[0]?.data?.completedCropObj?.width ?? 0;
      //     const sHeight = steps[0]?.data.completedCropObj?.height ?? 0;
      //     const dx = steps[0]?.data?.productConfig?.positionX ?? 0;
      //     const dy = steps[0]?.data.productConfig?.positionY ?? 0;
      //     const dWidth = steps[0]?.data?.productConfig?.width ?? 0;
      //     const dHeight = steps[0]?.data?.productConfig?.height ?? 0;
      //     ctx.save();
      //     ctx.drawImage(img1, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      //     ctx.save();
      //     console.log('%cLQS texture 06-03-02 ', 'color: #c931eb', {});
      //   };
      //   const img1model = steps[0].data;
      //   img1.src = img1model.fileUrl;
      //   console.log('%cLQS texture 06-04 ', 'color: #c931eb', {});

      //   //wklejam crop img2
      //   var img2 = new Image();
      //   img2.crossOrigin = 'anonymous';
      //   console.log('%cLQS texture 06-05 ', 'color: #c931eb', {});
      //   img2.onload = function () {
      //     console.log('%cLQS texture 06-05-01 ', 'color: #c931eb', {});
      //     const sx = steps[1]?.data?.completedCropObj?.x ?? 0;
      //     const sy = steps[1]?.data?.completedCropObj?.y ?? 0;
      //     const sWidth = steps[1]?.data?.completedCropObj?.width ?? 0;
      //     const sHeight = steps[1]?.data?.completedCropObj?.height ?? 0;
      //     const dx = steps[1]?.data.productConfig?.positionX ?? 0;
      //     const dy = steps[1]?.data.productConfig?.positionY ?? 0;
      //     const dWidth = steps[1]?.data.productConfig?.width ?? 0;
      //     const dHeight = steps[1]?.data.productConfig?.height ?? 0;
      //     ctx.save();
      //     ctx.drawImage(img2, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      //     ctx.save();
      //     console.log('%cLQS texture 06-05-02 ', 'color: #c931eb', {});
      //   };
      //   const img2model = steps[1].data;
      //   img2.src = img2model.fileUrl;
      //   console.log('%cLQS texture 06-06 ', 'color: #c931eb', {});
      // };
      // templateImg.src = product.layerImageUrl;

      const url = drawingCanvasRef.current.toDataURL();
      console.log('%cLQS texture 07 ', 'color: #c931eb', { url });
      if (url) return url;
      console.log('%cLQS texture 08 ', 'color: #c931eb', {});
      return product.layerImageUrl;
    }
    console.log('%cLQS >>>>>>>>>>>>> logger: ', 'color: red', {});

    setFinalImage(generateTexture());
  }, [product, steps]);

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
        <div className={classes.centerHorizontal}>
          {steps.map((step, index) => {
            if (step.type == 'crop') {
              const key = step.data.guid;
              return (
                <Cropper
                  uniqKey={key}
                  display={index == activeStep}
                  orderItem={step.data}
                  cropConfig={step.data.productConfig}
                />
              );
            } else {
              return (
                <div
                  className={
                    index == activeStep ? classes.visible : classes.hidden
                  }
                >
                  <View3d
                    textureUrl={finalImage}
                    modelUrl={product.objUrl}
                    saveFn={saveTexture}
                  />
                  <canvas ref={drawingCanvasRef} className={classes.hidden} />
                </div>
              );
            }
          })}
        </div>
        <Divider />
      </DialogContent>
      <DialogActions>
        <div className={classes.btnContainer}>
          <OtherButton onClick={closeFn} color='primary' className={classes.m6}>
            {t('Back')}
          </OtherButton>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default Render3dWizard;

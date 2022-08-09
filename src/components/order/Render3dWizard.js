//Core
import React, { useState, useEffect } from 'react';

//Components
import Cropper from '../3d/Cropper';

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
  fillWidth: {
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

  const [order] = useOrder();

  function getOrderItem(items) {
    if (!items || items.length == 0) return null;

    const result = items.find(
      (i) =>
        i.productId == product.id && !i.isLayerItem && i.status == 'success'
    );

    return result;
  }

  const { orderItems } = order;

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
  console.log('%cLQS logger: ', 'color: #c931eb', { steps });

  useEffect(() => {
    let lastStep = steps.length - 1;
    if (lastStep < 0) lastStep = 0;
    setActiveStep(lastStep);
  }, [steps.length]);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

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
              return <p>3d cup</p>;
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

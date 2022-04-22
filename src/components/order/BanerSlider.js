//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

//Utils

//UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: '6px',
    // backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: 255,
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    objectFit: 'fit',
    cursor: 'pointer',
  },
}));

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const mockBaner = [
  {
    id: 1,
    label: 'Brand new robot! Only today!',
    photographerId: 2320,
    productId: 7272,
    imgPath:
      'https://store-images.s-microsoft.com/image/apps.42747.13709482571966621.5e316da9-8395-4437-8282-7501e28d3ed3.9b0392ac-1883-444e-afd0-3e4be91f5d43?mode=scale&q=90&h=1080&w=1920',
  },
  {
    label: 'SALE - get your own cup, last chance!',
    photographerId: 2320,
    productId: 5399,
    imgPath:
      'https://sklep.terradeco.com.pl/userdata/public/gfx/37963/Dado-Wallpapers-Golden-Fern-Rettificato-60x120.jpg',
  },
];

const BanerSlider = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const history = useHistory();

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = mockBaner.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleClickBaner = (step) => {
    history.push(
      `/photographer/${step.photographerId}/products/${step.productId}`
    );
  };

  return (
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography>{mockBaner[activeStep].label}</Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {mockBaner.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img
                className={classes.img}
                src={step.imgPath}
                alt={step.label}
                onClick={() => handleClickBaner(step)}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position='static'
        variant='text'
        activeStep={activeStep}
        nextButton={
          <Button
            size='small'
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </div>
  );
};

export default BanerSlider;

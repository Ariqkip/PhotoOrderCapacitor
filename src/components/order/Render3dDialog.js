//Core
import React, { useState } from 'react';

//Components
import RoundButton from '../core/RoundButton';
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

const Render3dDialog = ({ model, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'lg'}
      open={isOpen ?? false}
      onClose={closeFn}
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'></DialogContentText>
        <Divider />
      </DialogContent>
      <DialogActions>
        <RemoveButton onClick={() => {}} color='primary'>
          {t('REMOVE ALL FILES')}
        </RemoveButton>
        <OtherButton onClick={() => {}} color='primary'>
          {t('Choose other products')}
        </OtherButton>
        <NextButton onClick={() => {}} color='primary'>
          {t('Next step')}
        </NextButton>
      </DialogActions>
    </Dialog>
  );
};

export default Render3dDialog;

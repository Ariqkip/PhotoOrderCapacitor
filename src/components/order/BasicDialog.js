//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

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
    justifyContent: 'center',
  },
}));

const BasicDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();

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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Container>
                <img
                  src={product.imageUrl ?? placeholderImg}
                  alt=''
                  style={{ width: '100%' }}
                />
              </Container>
              <Box className={classes.centerContent}>
                <Button>Pick Files</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              B
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFn} color='primary'>
          Disagree
        </Button>
        <Button onClick={closeFn} color='primary' autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BasicDialog;

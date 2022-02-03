//Core
import React, { useState } from 'react';

//Components
import RoundButton from './../core/RoundButton';

//Hooks
import { useTranslation } from 'react-i18next';
import { useFiles } from '../../contexts/FileContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';

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
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Typography from '@material-ui/core/Typography';

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
}));

const BasicDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  let fileInput = null;

  const [set, setSet] = useState(1);
  const [files, dispatch] = useFiles();

  const fileInputHandler = (event) => {
    const { files } = event.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const trackingGuid = createGuid();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const item = {
          set: set,
          productId: product.id,
          fileAsBase64: reader.result,
          fileName: file.name,
          guid: trackingGuid,
          tempURL: URL.createObjectURL(file),
          status: 'idle',
        };
        //addFile(item);
        dispatch({ type: 'ADD_FILE', data: item });
      };
    }
  };

  const handleUploadClick = () => {
    fileInput.click();
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
                <input
                  type='file'
                  style={{ display: 'none' }}
                  inputprops={{ accept: 'image/*' }}
                  multiple
                  onChange={fileInputHandler}
                  ref={(input) => {
                    fileInput = input;
                  }}
                />
                <RoundButton onClick={() => handleUploadClick()}>
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
                    {product.price} €
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' className={classes.description}>
                {product.description}
              </Typography>
              image list
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

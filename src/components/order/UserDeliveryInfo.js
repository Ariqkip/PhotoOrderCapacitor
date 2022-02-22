//Core
import React, { useState, useLayoutEffect } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import { formValidationHelper } from '../../core/helpers/formValidationHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '28px',
  },
  textfield: {
    width: '100%',
    marginBottom: '28px',
  },
  title: {
    marginBottom: 0,
  },
}));

const fieldValidation = {
  shippingName: {
    error: '',
    minLength: 2,
    maxLength: 50,
  },
  shippingAddress: {
    error: '',
    minLength: 2,
    maxLength: 150,
  },
  shippingEmail: {
    error: '',
    validate: 'email',
  },
};

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const UserDeliveryInfo = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [photographer] = usePhotographer();
  const [order, orderDispatch] = useOrder();

  const handleFormChange = (e) => {
    let { name, value } = e.target;

    const error = formValidationHelper(name, value, fieldValidation);

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const setShippingSelection = (e) => {
    const { checked } = e.target;

    orderDispatch({
      type: 'ORDER_SET_SHIPPING',
      payload: {
        shipping: checked,
      },
    });
  };

  const setShippingName = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      shippingName: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_SHIPPING_NAME',
      payload: { shippingName: value },
    });
    handleFormChange(e);
  };

  const setShippingAddress = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      shippingAddress: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_SHIPPING_ADDRESS',
      payload: { shippingAddress: value },
    });
    handleFormChange(e);
  };

  const setShippingEmail = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      shippingEmail: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_SHIPPING_EMAIL',
      payload: { shippingEmail: value },
    });
    handleFormChange(e);
  };

  const renderDeliveryForm = () => {
    if (order.shippingSelected) {
      return (
        <Paper square className={classes.paper}>
          <TextField
            required
            name='shippingName'
            id='shipping-name'
            label={t('Name')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingName || ''}
            onChange={setShippingName}
            error={!!formErrors.shippingName}
            helperText={formErrors.shippingName}
          />
          <TextField
            required
            name='shippingAddress'
            id='shipping-address'
            label={t('Address')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingAddress || ''}
            onChange={setShippingAddress}
            error={!!formErrors.shippingAddress}
            helperText={formErrors.shippingAddress}
          />
          <TextField
            required
            name='shippingEmail'
            id='shipping-email'
            label={t('Email')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingEmail || ''}
            onChange={setShippingEmail}
            error={!!formErrors.shippingEmail}
            helperText={formErrors.shippingEmail}
          />
        </Paper>
      );
    }

    return <></>;
  };

  useLayoutEffect(() => {
    setFormValues({
      shippingName: order.shippingName,
      shippingAddress: order.shippingAddress,
      shippingEmail: order.shippingEmail,
    });
  }, [order.shippingAddress, order.shippingEmail, order.shippingName]);

  return (
    <Container maxWidth='md'>
      <p className={classes.title}>
        {t('Add delivery')} (+{photographer.shippingPrice} €)
      </p>
      <IOSSwitch
        name='shipping'
        checked={order.shippingSelected}
        onChange={setShippingSelection}
      />
      {renderDeliveryForm()}
    </Container>
  );
};

export default UserDeliveryInfo;

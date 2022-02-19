//Core
import React, { useState, useLayoutEffect } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import formValidationHelper from '../../core/helpers/formValidationHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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
}));

const fieldValidation = {
  firstName: {
    error: '',
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    error: '',
    minLength: 2,
    maxLength: 50,
  },
  email: {
    error: '',
    validate: 'email',
  },
  phone: {
    error: '',
    validate: 'phone',
    maxLength: 14,
  },
};

const UserBasicInfo = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [order, orderDispatch] = useOrder();

  const handleFormChange = (e) => {
    let { name, value } = e.target;

    const error = formValidationHelper(name, value, fieldValidation);

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const setFirstName = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      firstName: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_FIRST_NAME',
      payload: { firstName: value },
    });
    handleFormChange(e);
  };

  const setLastName = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      lastName: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_LAST_NAME',
      payload: { lastName: value },
    });
    handleFormChange(e);
  };

  const setEmail = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      email: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_EMAIL',
      payload: { email: value },
    });
    handleFormChange(e);
  };

  const setPhone = (e) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      phone: value,
    }));
    orderDispatch({
      type: 'ORDER_SET_PHONE',
      payload: { phone: value },
    });
    handleFormChange(e);
  };

  useLayoutEffect(() => {
    setFormValues({
      firstName: order.firstName === 'missing' ? '' : order.firstName,
      lastName: order.lastName === 'missing' ? '' : order.lastName,
      email: order.email === 'missing' ? '' : order.email,
      phone: order.phone === 'missing' ? '' : order.phone,
    });
  }, [order.email, order.firstName, order.lastName, order.phone]);

  return (
    <Container maxWidth='md'>
      <p>Basic informations</p>
      <Paper square className={classes.paper}>
        <TextField
          required
          name='firstName'
          id='basic-first-name'
          label={t('First name')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.firstName || ''}
          onChange={setFirstName}
          error={!!formErrors.firstName}
          helperText={formErrors.firstName}
        />
        <TextField
          required
          name='lastName'
          id='basic-last-name'
          label={t('Last name')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.lastName || ''}
          onChange={setLastName}
          error={!!formErrors.lastName}
          helperText={formErrors.lastName}
        />
        <TextField
          required
          name='email'
          id='basic-email'
          label={t('Email')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.email || ''}
          onChange={setEmail}
          error={!!formErrors.email}
          helperText={formErrors.email}
        />
        <TextField
          required
          name='phone'
          id='basic-phone'
          label={t('Phone')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.phone || ''}
          onChange={setPhone}
          error={!!formErrors.phone}
          helperText={formErrors.phone}
        />
      </Paper>
    </Container>
  );
};

export default UserBasicInfo;

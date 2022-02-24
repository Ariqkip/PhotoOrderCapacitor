//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import { valueValidationHelper } from '../../core/helpers/formValidationHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  error: {
    color: '#dc3545',
  },
  progress: {
    marginLeft: '8px',
  },
}));

const ActiveButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '320px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}))(Button);

const DisabledButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '320px',
    color: '#d4d4d4',
    borderRadius: '50px',
    padding: '12px 28px',
    cursor: 'not-allowed',
    backgroundColor: '#343a40',
    '&:hover': {
      backgroundColor: '#4a444a',
    },
  },
}))(Button);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 420,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const SendOrderButton = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [order, orderDispatch] = useOrder();

  const clearMissingValue = (value) => {
    if (value === undefined) return '';
    if (value === 'missing') return '';

    return value;
  };

  const validateSendOrder = () => {
    let errors = [];

    const validateFirstName = valueValidationHelper(
      t('First name'),
      clearMissingValue(order.firstName),
      {
        minLength: 2,
        maxLength: 50,
      }
    );
    if (validateFirstName) {
      errors.push(validateFirstName);
    }

    const validateLastName = valueValidationHelper(
      t('Last name'),
      clearMissingValue(order.lastName),
      {
        minLength: 2,
        maxLength: 50,
      }
    );
    if (validateLastName) {
      errors.push(validateLastName);
    }

    const validateEmail = valueValidationHelper(
      t('Email'),
      clearMissingValue(order.email),
      {
        validate: 'email',
      }
    );
    if (validateEmail) {
      errors.push(validateEmail);
    }

    const validatePhone = valueValidationHelper(
      t('Phone'),
      clearMissingValue(order.phone),
      {
        validate: 'phone',
      }
    );
    if (validatePhone) {
      errors.push(validatePhone);
    }

    const orderedItems =
      order.orderItems.reduce((sum, item) => sum + item.qty, 0) > 0;
    if (!orderedItems) {
      errors.push(t('No products in the cart'));
    }

    return errors;
  };

  function RenderButton({ children }) {
    const errors = validateSendOrder();

    const renderChildren = () => {
      if (order.status === 'FINALIZING')
        return (
          <>
            {t('Sending')}{' '}
            <CircularProgress size={22} className={classes.progress} />
          </>
        );

      if (order.status === 'SUCCESS') return <>{t('SUCCESS')}</>;

      return children;
    };

    if (errors.length === 0)
      return (
        <ActiveButton
          size='large'
          onClick={() => orderDispatch({ type: 'FINALIZE' })}
          disabled={order.status !== 'INITIALIZED'}
        >
          {renderChildren()}
        </ActiveButton>
      );

    return (
      <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
        <HtmlTooltip
          open={tooltipOpen}
          arrow
          enterDelay={500}
          leaveDelay={500}
          title={
            <React.Fragment>
              <Typography className={classes.error}>Cant continue</Typography>
              {errors.map((e, i) => (
                <li key={`validation_error_${i}`}>{e}</li>
              ))}
            </React.Fragment>
          }
        >
          <DisabledButton
            size='large'
            onClick={() => setTooltipOpen(true)}
            onMouseEnter={() => setTooltipOpen(true)}
          >
            {children}
          </DisabledButton>
        </HtmlTooltip>
      </ClickAwayListener>
    );
  }

  return <RenderButton>{t('Send order')}</RenderButton>;
};

export default SendOrderButton;

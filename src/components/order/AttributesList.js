//Core
import React, { useState, useEffect } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import useMediaQuery from '@material-ui/core/useMediaQuery';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  title: {
    width: '100%',
    fontSize: '1.3rem',
    lineHeight: '1.8rem',
    fontWeight: 600,
    display: 'inline-block',
    textDecoration: 'underline',
  },
  groupName: {
    margin: 0,
  },
  groupSelection: {
    marginBottom: '8px',
  },
  attributeButton: {
    width: '100%',
  },
  attributeRow: {
    padding: '3px !important',
  },
  mb16: {
    marginBottom: '16px',
  },
}));

const AttributesList = ({ product, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const matches = useMediaQuery('(min-width:600px)');

  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();

  const calculateAttributeGroups = () => {
    const groupIds = [
      ...new Set(product.attributes.map((p) => p.attributesGroupId)),
    ];
    return photographer.productAttributes.filter((a) =>
      groupIds.includes(a.Id)
    );
  };

  const attributesGroups = calculateAttributeGroups();

  const calculateAttributes = (group) => {
    return product.attributes
      .filter((a) => a.attributesGroupId === group.Id)
      .sort((a, b) => a.position < b.position);
  };

  const handleAttributeClick = (groupId, attributeId) => {
    const newConfig = {
      productId: product.id,
      pack: pack,
      groupId: groupId,
      selected: attributeId,
    };
    orderDispatch({ type: 'ORDER_ITEM_SET_ATTRIBUTES', payload: newConfig });
  };

  const getButtonVariant = (groupId, attributeId) => {
    const config = order?.orderItemsConfig.find(
      (c) => c.productId === product.id && c.pack === pack
    );

    if (config) {
      const group = config.configs.find((opt) => opt.groupId === groupId);
      if (group) {
        if (group.selected === attributeId) return 'contained';
        else return 'outlined';
      }
    }

    const attributes = product.attributes.filter(
      (a) => a.attributesGroupId === groupId
    );
    if (attributes) {
      if (attributes[0].id === attributeId) return 'contained';
    }

    return 'outlined';
  };

  const renderAttributes = (group) => {
    const att = calculateAttributes(group);

    return (
      <>
        <Typography
          gutterBottom
          component='p'
          className={[classes.groupName, classes.mb16]}
        >
          {group.Name}:
        </Typography>
        <Grid container spacing={3} className={classes.mb16}>
          {att.map((a) => (
            <Grid item xs={12} sm={6} md={4} className={classes.attributeRow}>
              <Button
                disableElevation
                key={a.id}
                color='primary'
                variant={getButtonVariant(group.Id, a.id)}
                onClick={() => handleAttributeClick(group.Id, a.id)}
                className={classes.attributeButton}
              >
                {a.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <>
      {product && product.attributes?.length > 0 && (
        <>
          <Typography gutterBottom component='p' className={classes.title}>
            {t('Options')}:
          </Typography>
          {attributesGroups.map((g) => renderAttributes(g))}
        </>
      )}
    </>
  );
};

export default AttributesList;

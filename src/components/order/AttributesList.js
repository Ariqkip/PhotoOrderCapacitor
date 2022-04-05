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
        <Typography gutterBottom component='p' className={classes.groupName}>
          {group.Name}:
        </Typography>
        <ButtonGroup
          color='primary'
          aria-label='outlined primary button group'
          className={classes.groupSelection}
          orientation={`${matches ? `horizontal` : `vertical`}`}
        >
          {att.map((a) => (
            <Button
              key={a.id}
              variant={getButtonVariant(group.Id, a.id)}
              onClick={() => handleAttributeClick(group.Id, a.id)}
            >
              {a.name}
            </Button>
          ))}
        </ButtonGroup>
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

//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils

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

const AttributesList = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [photographer] = usePhotographer();
  console.log('%cLQS logger: ', 'color: #c931eb', { photographer });

  if (!product) return null;
  if (product.attributes?.length < 1) return null;

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
        >
          {att.map((a) => (
            <Button key={a.id}>{a.name}</Button>
          ))}
        </ButtonGroup>
      </>
    );
  };

  return (
    <>
      <Typography gutterBottom component='p' className={classes.title}>
        {t('Options')}:
      </Typography>
      {attributesGroups.map((g) => renderAttributes(g))}
    </>
  );
};

export default AttributesList;

//Core
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const MenuList = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <List>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/products`}
      >
        <ListItemIcon>
          <AddShoppingCartIcon />
        </ListItemIcon>
        <ListItemText>{t('Products')}</ListItemText>
      </ListItem>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/checkout`}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText>{t('Finish order')}</ListItemText>
      </ListItem>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/contact`}
      >
        <ListItemIcon>
          <ContactPhoneIcon />
        </ListItemIcon>
        <ListItemText>{t('Contact')}</ListItemText>
      </ListItem>
    </List>
  );
};

export default MenuList;

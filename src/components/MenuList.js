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
import HomeIcon from '@material-ui/icons/Home';

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
        to='/'
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText>Dashboard</ListItemText>
      </ListItem>
    </List>
  );
};

export default MenuList;

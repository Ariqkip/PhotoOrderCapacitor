//Core
import React, { useState } from 'react';

//Components
import MenuList from './MenuList';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx'; // this is for controling dynamic class name assingment

const drawerWidth = 260;
const anchor = 'left';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    minHeight: 48,
    //  height: 35
  },
}));

const MenuDrawer = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Drawer
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.draweropen,
        [classes.drawerClose]: !props.draweropen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.draweropen,
          [classes.drawerClose]: !props.draweropen,
        }),
      }}
      anchor={anchor}
      open={props.draweropen}
      onClose={() => props.requestClose && props.requestClose()}
    >
      <MenuList
        requestClose={() => props.requestClose && props.requestClose()}
      />
    </Drawer>
  );
};

export default MenuDrawer;

//Core
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

//Components
import MenuDrawer from './MenuDrawer';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils
import clsx from 'clsx';

//UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#fff',
    color: '#8f8f8f',
    height: '64px',
    justifyContent: 'center',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    height: 20,
    width: 20,
  },
  closeButton: {
    height: 20,
    width: 20,
  },
  hide: {
    display: 'none',
  },
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
  regular: {
    minHeight: 48,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  gutters: {
    paddingLeft: 12,
  },
  title: {
    flexGrow: 1,
  },
  colorSecondary: {
    padding: 6,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    '&:focus': {
      outline: 0,
      border: 0,
    },
  },
  navButton: {
    color: '#8f8f8f',
    width: '100px',
    textAlign: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  sectionDesktop: {
    display: 'none',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const AppMenu = ({ photographerId }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.sectionMobile}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={() => {
                setDrawerOpen(true);
              }}
              edge='start'
              //hidden={currentLogin == null ? true : false}
              className={clsx(classes.menuButton, {
                [classes.hide]: drawerOpen,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              className={classes.title}
            >
              {t('Menu')}
            </Typography>
          </div>
          <div className={classes.sectionDesktop}>
            <NavLink
              to={`/photographer/${photographerId}/products`}
              activeStyle={{ fontWeight: 'bold' }}
              className={classes.navButton}
            >
              Products
            </NavLink>
            <NavLink
              to={`/photographer/${photographerId}/checkout`}
              activeStyle={{ fontWeight: 'bold' }}
              className={classes.navButton}
            >
              Finish order
            </NavLink>
            <NavLink
              to={`/photographer/${photographerId}/contact`}
              activeStyle={{ fontWeight: 'bold' }}
              className={classes.navButton}
            >
              Contact
            </NavLink>
          </div>
        </Toolbar>
      </AppBar>
      <MenuDrawer
        draweropen={drawerOpen}
        requestClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AppMenu;

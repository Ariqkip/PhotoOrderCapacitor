import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import RoundButton from './../../core/RoundButton';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  menuBtn: {
    display: "inline-grid",
    margin: "0px 5px"
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const BackBtn = ({icon, text, fun}) =>{
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.menuBtn}>
      <RoundButton
        size='small'
        onClick={fun}
        disabled={false}
        className={
          true ? classes.visible : classes.hidden
        }
      >
        <Box className={classes.centerContent}>
          {icon}
          <span>{text}</span>
        </Box>
      </RoundButton>
    </div>
  )
}

export default BackBtn;

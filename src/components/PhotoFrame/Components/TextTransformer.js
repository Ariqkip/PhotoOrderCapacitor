import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import RoundButton from './../../core/RoundButton';
import Box from '@material-ui/core/Box';
import ColorPicker from 'material-ui-color-picker'
import Typography from '@material-ui/core/Typography';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import UndoIcon from '@material-ui/icons/Undo';
import { makeStyles } from '@material-ui/core/styles';
import '../PhotoFrame.css'


const useStyles = makeStyles((theme) => ({
  scaleAndRotationPlaceholder: {
    marginTop:"10px",
    width: "100%",
    height: "55px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down(500)]: {
      height: "110px"
    },
    [theme.breakpoints.down(350)]: {
      height: "130px"
    }
  },
  resizeLabel:{
    margin: "auto",
    textTransform: "uppercase",
    fontSize: "0.8125rem",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Nunito,sans-serif",
    fontWeight: "500",
    lineHeight: "1.75"
  },
  menuBtn: {
    display: "inline-grid"
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const TextTransformer = ({textSelectedId, textLayers, setTextLayers}) =>{
  const { t } = useTranslation();
  const classes = useStyles();
  const [menuState, setMenuState] = useState(null)
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(null);

  const selectedText = textLayers[textSelectedId];

  const mainMenu = (
    <>
      <div className={classes.menuBtn}>
        <input
          type="text"
          value={selectedText.text}
          onChange={(e)=>{
            const newTextLayers = [...textLayers];
            const editedTextLayer = {...selectedText}
            editedTextLayer.text = e.target.value;
            newTextLayers[textSelectedId] = editedTextLayer;
            setTextLayers(newTextLayers);
          }}
        />
        <Typography className={classes.resizeLabel} gutterBottom>
          {t('Text')}
        </Typography>
      </div>
      <div className={classes.menuBtn}>
        <RoundButton
          size='small'
          onClick={()=>setMenuState('shape')}
          disabled={false}
          className={
            true ? classes.visible : classes.hidden
          }
        >
          <Box className={classes.centerContent}>
            <FormatShapesIcon />
            <span>{t('Shape')}</span>
          </Box>
        </RoundButton>
      </div>
      <div className={classes.menuBtn}>
        <RoundButton
          size='small'
          onClick={()=>setMenuState('colors')}
          disabled={false}
          className={
            true ? classes.visible : classes.hidden
          }
        >
          <Box className={classes.centerContent}>
            <ColorLensIcon />
            <span>{t('Colors')}</span>
          </Box>
        </RoundButton>
      </div>
    </>
  );

  const backBtn=(
    <div className={classes.menuBtn}>
      <RoundButton
        size='small'
        onClick={()=>setMenuState(null)}
        disabled={false}
        className={
          true ? classes.visible : classes.hidden
        }
      >
        <Box className={classes.centerContent}>
          <UndoIcon />
          <span>{t('Back')}</span>
        </Box>
      </RoundButton>
    </div>
  )

  const shapeMenu = (
    <>
      <div className={classes.menuBtn}>
        <input
          type="range" min="-180" max="180"
          value={selectedText.rotation}
          onChange={(e)=>{
            const newTextLayers = [...textLayers];
            const editedTextLayer = {...selectedText}
            editedTextLayer.rotation = parseInt(e.target.value);
            newTextLayers[textSelectedId] = editedTextLayer;
            setTextLayers(newTextLayers);
        }} />
        <Typography className={classes.resizeLabel} gutterBottom>
          {t('Rotation')}
        </Typography>
      </div>
      <div className={classes.menuBtn}>
        <input
          type="range" min="25" max="200"
          value={selectedText.fontSize}
          onChange={(e)=>{
            const newTextLayers = [...textLayers];
            const editedTextLayer = {...selectedText}
            editedTextLayer.fontSize = parseInt(e.target.value);
            newTextLayers[textSelectedId] = editedTextLayer;
            setTextLayers(newTextLayers);
        }} />
        <Typography className={classes.resizeLabel} gutterBottom>
          {t('Font size')}
        </Typography>
      </div>
      <div className={classes.menuBtn}>
        <input
          type="range" min="0" max="10"
          value={selectedText.strokeWidth}
          onChange={(e)=>{
            const newTextLayers = [...textLayers];
            const editedTextLayer = {...selectedText}
            editedTextLayer.strokeWidth = parseInt(e.target.value);
            newTextLayers[textSelectedId] = editedTextLayer;
            setTextLayers(newTextLayers);
        }} />
        <Typography className={classes.resizeLabel} gutterBottom>
          {t('Stroke Width')}
        </Typography>
      </div>
      {backBtn}
    </>
  );

  const colorsMenu = (
    <>
      <div className={classes.menuBtn}>
        <ColorPicker
          defaultValue={selectedText.fillColor}
          value={selectedText.fillColor}
          onChange={color=>{
            const newTextLayers = [...textLayers];
            const editedTextLayer = {...selectedText}
            editedTextLayer.fillColor = color;
            newTextLayers[textSelectedId] = editedTextLayer;
            setTextLayers(newTextLayers);
            console.log(color)
        }} />
        <Typography className={classes.resizeLabel} gutterBottom>
          {t('Fill Color')}
        </Typography>
      </div>
      <div className={classes.menuBtn}>
        <ColorPicker
          defaultValue={selectedText.strokeColor}
          value={selectedText.strokeColor}
          onChange={color=>{
            const newTextLayers = [...textLayers];
            const editedTextLayer = {...selectedText}
            editedTextLayer.strokeColor = color;
            newTextLayers[textSelectedId] = editedTextLayer;
            setTextLayers(newTextLayers);
        }} />
        <Typography className={classes.resizeLabel} gutterBottom>
          {t('Stroke Color')}{selectedText.strokeColor}
        </Typography>
      </div>
      {backBtn}
    </>
  )

  return(
    <div className={classes.scaleAndRotationPlaceholder}>
        {!menuState && mainMenu}
        {menuState === 'shape' && shapeMenu}
        {menuState === 'colors' && colorsMenu}
    </div>
  )
}


export default TextTransformer;

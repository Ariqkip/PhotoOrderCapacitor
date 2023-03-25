import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import ColorPicker from 'material-ui-color-picker'
import Typography from '@material-ui/core/Typography';
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
  resizeBtn: {
    display: "inline-grid"
  },
  changeFileBtn: {
    display: "inline-grid"
  }
}));

const TextTransformer = ({textSelectedId, textLayers, setTextLayers}) =>{
  const { t } = useTranslation();
  const classes = useStyles();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(null);

  const selectedText = textLayers[textSelectedId];

  return(
    <div className={classes.scaleAndRotationPlaceholder}>
        <div>
          <div className={classes.resizeBtn}>
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
        </div>
        <div>
          <div className={classes.resizeBtn}>
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
          <div className={classes.resizeBtn}>
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
          <div className={classes.resizeBtn}>
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
          <div className={classes.resizeBtn}>
            <ColorPicker
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
          <div className={classes.resizeBtn}>
            <ColorPicker
              value={selectedText.strokeColor}
              onChange={color=>{
                const newTextLayers = [...textLayers];
                const editedTextLayer = {...selectedText}
                editedTextLayer.strokeColor = color;
                newTextLayers[textSelectedId] = editedTextLayer;
                setTextLayers(newTextLayers);
            }} />
            <Typography className={classes.resizeLabel} gutterBottom>
              {t('Stroke Color')}
            </Typography>
          </div>





        </div>
    </div>
  )
}


export default TextTransformer;

import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  scaleAndRotationPlaceholder: {
    width: "100%",
    height: "94px"
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

const ScaleAndRotationTransformer = ({initPos, imgRef, selectedId, replaceFileBtn}) =>{
  const { t } = useTranslation();
  const classes = useStyles();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(null);

  useEffect(()=>{
    if(initPos){
      const x = initPos.x + initPos.width/2;
      const y = initPos.y + initPos.height/2;
      setPosition({
        x: x + 'px',
        y: y + 'px'
      })
    }
    if(imgRef){
      const s = imgRef.attrs.scaleX || 1;
      setScale((s-1)*10);
    }
  },[position])

  useEffect(()=>{
    if(imgRef){
      imgRef.setAttrs({
        scaleX: 1 + scale/10,
        scaleY: 1 + scale/10,
      })
    }
  },[scale])

  useEffect(()=>{
    if(imgRef){
      setScale((imgRef.attrs.scaleX-1)*10 || 0);
    }
  },[imgRef])

  return(
    <>
      {selectedId ?
        <Box component="span" sx={{ p: 2, border: '1px dashed grey', backgroundColor: 'lightgrey' }}>
          <div className={classes.resizeBtn}>
            <input
              type="range" min="1" max="10"
              value={scale}
              onChange={(e)=>{
                const s = parseInt(e.target.value);
                setScale(s)
            }} />
            <Typography className={classes.resizeLabel} gutterBottom>
              {t('Resize file')}
            </Typography>
          </div>
          <div className={classes.changeFileBtn}>
            {replaceFileBtn}
          </div>
        </Box> :
        <div className={classes.scaleAndRotationPlaceholder}/>
      }
    </>
  )
}


export default ScaleAndRotationTransformer;

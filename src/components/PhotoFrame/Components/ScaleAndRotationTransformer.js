import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  scaleAndRotationContainer: {
    width: "100%",
    height: "58px"
}}));

const ScaleAndRotationTransformer = ({initPos, imgRef, selectedId}) =>{
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

  return(
    <>
      {selectedId ?
        <Box component="span" sx={{ p: 2, border: '1px dashed grey', backgroundColor: 'lightgrey' }}>
          <div className='ScaleAndRotationTransformer'>
            <input
              type="range" min="1" max="10"
              value={scale}
              onChange={(e)=>{
                const s = parseInt(e.target.value);
                setScale(s)
            }} />
          </div>
        </Box> :
        <div className={classes.scaleAndRotationContainer}/>
      }
    </>
  )
}


export default ScaleAndRotationTransformer;

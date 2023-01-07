import React, {useEffect, useState} from 'react';

const ScaleAndRotationTransformer = (props) =>{
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(null);

  useEffect(()=>{
    if(props.position){
      const x = props.position.x + props.position.width/2;
      const y = props.position.y + props.position.height/2;
      setPosition({
        x: x + 'px',
        y: y + 'px'
      })
    }
    if(props.imgRef){
      const s = props.imgRef.attrs.scaleX || 1;
      setScale((s-1)*10);
    }
  },[props.position])

  useEffect(()=>{
    if(props.imgRef){
      props.imgRef.setAttrs({
        scaleX: 1 + scale/10,
        scaleY: 1 + scale/10,
      })
    }
  },[scale])

  return(
    position &&
    <div style={{ position:'absolute', top:position.y, left:position.x}}>
      <div className='ScaleAndRotationTransformer'>
        <input
          type="range" min="1" max="10"
          value={scale}
          onChange={(e)=>{
            const s = parseInt(e.target.value);
            setScale(s)
        }} />
      </div>
    </div>
  )
}


export default ScaleAndRotationTransformer;

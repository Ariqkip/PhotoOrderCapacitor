import React from 'react';
import useImage from 'use-image';
import { Image, Layer } from 'react-konva';

const Frame = (props) =>{
  const [frameImg] = useImage('https://oistigmesstorage.blob.core.windows.net/product/5/9713/template/design-2.png', 'Anonymous');
  return(
    <Layer listening={false}>
      <Image image={frameImg} x={0} y={0} width={props.width} height={props.height}/>
    </Layer>
  )
}

export default Frame;

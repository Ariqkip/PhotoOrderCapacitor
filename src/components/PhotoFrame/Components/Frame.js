import React from 'react';
import useImage from 'use-image';
import { Image, Layer } from 'react-konva';

const Frame = ({frameUrl, width, height}) =>{
  const [frameImg] = useImage(frameUrl, 'Anonymous');
  return(
    <Layer listening={false}>
      <Image image={frameImg} x={0} y={0} width={width} height={height}/>
    </Layer>
  )
}

export default Frame;

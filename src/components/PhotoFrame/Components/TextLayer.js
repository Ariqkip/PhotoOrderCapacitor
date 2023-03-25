import React, {useEffect, useState} from 'react';
import { Image, Layer, Text, TextPath } from 'react-konva';


const TextLayer = ({config, onSelect}) =>{
console.log(config)

    return(
      <Layer>
        <Text
          x={config.x}
          y={config.y}
          rotation={config.rotation}
          text={config.text}
          fontSize={config.fontSize}
          fill={config.fillColor}
          stroke={config.strokeColor}
          strokeWidth={config.strokeWidth}
          draggable
          onClick={onSelect}
        />
      </Layer>
    )
}

export default TextLayer;

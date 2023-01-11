import React, {useEffect, useState} from 'react';
import './PhotoFrame.css';

import { Stage, Layer } from 'react-konva';

import Frame from './Components/Frame';
import TransformableImage from './Components/TransformableImage';
import ScaleAndRotationTransformer from './Components/ScaleAndRotationTransformer';


const PhotoFrame = ({ data, frame, photos, setEditorRef }) => {
    const width = 748;
    const height = 315;

    const crateLayers = (initialLayers, photos) =>{
      const photoss = [];
      initialLayers.forEach((iL,i)=>{
        if(photos[i]){
          const photo = {};
          const layerRatio = iL.width / iL.height;
          const photoRatio = photos[i].props.naturalWidth / photos[i].props.naturalHeight;

          let width = 0;
          let height = 0;

          if(layerRatio > photoRatio){
            width = iL.width;
            height = photos[i].props.naturalHeight * (iL.width / photos[i].props.naturalWidth );
          }else{
            width = photos[i].props.naturalWidth * (iL.height / photos[i].props.naturalHeight );
            height = iL.height;
          }
          photo.x = iL.width/2;
          photo.y = iL.height/2;
          photo.offsetX = width/2;
          photo.offsetY = height/2;
          photo.width = width;
          photo.height = height;
          photo.id = "photo"+i;
          photo.img = photos[i];
          photoss.push(photo);
        }
      })
      return photoss;
    }

    const initialLayers = data.map(d=>{return{
      x:d.productConfig.positionX/3,
      y:d.productConfig.positionY/3,
      width:d.productConfig.width/3,
      height:d.productConfig.height/3,
      clipX: 0,
      clipY: 0,
      clipWidth: d.productConfig.width/3,
      clipHeight: d.productConfig.height/3
     }});

    const [layers, setLayers] = useState(crateLayers(initialLayers, photos));
    const [selectedId, selectShape] = useState(null);
    const [transformerPosition, setTransformerPosition] = useState(null);
    const imgRef = React.useRef([]);
    const trRef = React.useRef();
    const stageRef = React.useRef(null);

    useEffect(() => {
      setEditorRef(stageRef);
    },[stageRef])

    useEffect(() => {
      const ref = imgRef.current[selectedId];
      if (ref && trRef.current) {
        trRef.current.nodes([ref]);
        trRef.current.getLayer().batchDraw();
      }
    }, [selectedId, trRef]);

    useEffect(() =>{
      const layerIndex = layers.indexOf(layers.find((img,i)=>img.id === selectedId));
      if(layerIndex>=0){
        setTransformerPosition(initialLayers[layerIndex]);
      }else{
        setTransformerPosition(null);
      }
    }, [selectedId]);

    useEffect(()=>{
      setLayers(crateLayers(initialLayers, photos));
    }, [photos])

    const checkDeselect = (e) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        selectShape(null);
      }
    };

  return (
    <>
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}>
        {layers.map((rect, i) =>
          <Layer key={i} {...initialLayers[i]}>
            <TransformableImage
              shapeProps={rect}
              imgRef={imgRef}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = layers.slice();
                rects[i] = newAttrs;
                setLayers(rects);
              }}
            />
          </Layer>
        )}
        {frame && <Frame frameUrl={frame} width={width} height={height}/>}
    </Stage>
    <ScaleAndRotationTransformer position={transformerPosition} imgRef={imgRef.current[selectedId]}/>
    </>
  );
};

export default PhotoFrame;

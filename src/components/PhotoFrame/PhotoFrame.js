import React, {useEffect, useState} from 'react';
import { useImageSize } from 'react-image-size';
import { Stage, Layer } from 'react-konva';

//UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import Frame from './Components/Frame';
import TransformableImage from './Components/TransformableImage';
import ScaleAndRotationTransformer from './Components/ScaleAndRotationTransformer';

const useStyles = makeStyles((theme) => ({
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: "300px",
}}));

const PhotoFrame = ({ stepData, frameUrl, photos, setEditorRef, setEditorRatio }) => {

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

    const [selectedId, selectShape] = useState(null);
    const [transformerPosition, setTransformerPosition] = useState(null);
    const [parentWidth, setParentWidth] = useState(0);
    const [frameWidth, setFrameWidth] = useState();
    const [frameHeight, setFrameHeight] = useState();
    const [ratio, setRatio] = useState(0);
    const [initialLayers, setInitialLayers] = useState();
    const [layers, setLayers] = useState([]);
    const classes = useStyles();
    const imgRef = React.useRef([]);
    const trRef = React.useRef();
    const stageRef = React.useRef(null);
    const parentRef = React.useRef(null);
    const [data, { loading, error }] = useImageSize(frameUrl);

    useEffect(()=>{
      setParentWidth(parentRef.current.offsetWidth);
    },[parentRef]);

    useEffect(()=>{
      if(data && !loading && !error){
        const ratio = data.width/parentWidth;
        const initialLayers = stepData.map(d=>{return{
          x:d.productConfig.positionX/ratio,
          y:d.productConfig.positionY/ratio,
          width:d.productConfig.width/ratio,
          height:d.productConfig.height/ratio,
          clipX: 0,
          clipY: 0,
          clipWidth: d.productConfig.width/ratio,
          clipHeight: d.productConfig.height/ratio
        }});

        setFrameWidth(data.width/ratio);
        setFrameHeight(data.height/ratio);
        setRatio(ratio);
        setEditorRatio(ratio);
        setInitialLayers(initialLayers);
        setLayers(crateLayers(initialLayers, photos));
      }
    },[data, loading, error, photos, parentWidth]);

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

    const checkDeselect = (e) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        selectShape(null);
      }
    };

    let composerView = (<CircularProgress />);
    if(data && !loading && !error && initialLayers){
      composerView = (
        <>
          <Stage
            width={frameWidth}
            height={frameHeight}
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
              {frameUrl && <Frame frameUrl={frameUrl} width={frameWidth} height={frameHeight}/>}
          </Stage>
          <ScaleAndRotationTransformer position={transformerPosition} imgRef={imgRef.current[selectedId]}/>
        </>
      );
    }

  return (
    <div className={classes.centerContent} ref={parentRef}>
      {composerView}
    </div>
  );
};

export default PhotoFrame;

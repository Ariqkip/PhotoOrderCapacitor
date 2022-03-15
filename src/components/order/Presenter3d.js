//Core
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Image, Layer, Stage } from 'react-konva';

//Components
import View3d from '../3d/View3d';
import Rectangle from '../3d/Rectangle';

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import useImage from 'use-image';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//Assets
import defaultObj from '../../assets/cup.obj';
import sampleImg from '../../assets/sample01.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const OtherButton = withStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '12px',
    maxWidth: '400px',
    color: '#28a745',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #28a745',
    '&:hover': {
      color: 'white',
      backgroundColor: '#28a745',
    },
  },
}))(Button);

const Presenter3d = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const stageLayerRef = useRef(null);

  const [order, orderDispatch] = useOrder();
  const [textureUrl, setTextureUrl] = useState(null);
  const [showEditor, setShowEditr] = useState(false);
  const [selectedMode, setSelectedMode] = useState(true);
  const [rectangles, setRectangles] = useState([]);

  const [image] = useImage(product.imageUrl, 'anonymous');
  console.log('%cLQS logger: ', 'color: #c931eb', { product, order });

  const scale = 0.4215686275;
  var container = document.querySelector('#js-stage-root');
  let widthValue = container?.offsetWidth ?? 1122;
  if (widthValue > 561) widthValue = 561;
  const heightValue = widthValue * scale;

  const getModelUrl = () => {
    if (!product.objUrl) return defaultObj;

    //hack: for sake of development
    if (product.objUrl?.length < 10) return defaultObj;

    return product.objUrl;
  };

  useLayoutEffect(() => {
    const testLayer = [
      {
        x: 16,
        y: 20,
        width: 390,
        height: 260,
        url: sampleImg,
      },
    ];
    setRectangles(testLayer);
    const uri = stageLayerRef.current.toDataURL();
    setTextureUrl(uri);
  }, []);

  useEffect(() => {
    const uri = stageLayerRef.current.toDataURL();
    setTextureUrl(uri);
  }, []);

  return (
    <>
      <View3d
        textureUrl={textureUrl}
        modelUrl={getModelUrl()}
        initialTemplate={rectangles}
      />
      {!showEditor && (
        <OtherButton onClick={() => setShowEditr(true)} color='primary'>
          {t('Adjustment')}
        </OtherButton>
      )}
      {showEditor && (
        <OtherButton onClick={() => setShowEditr(false)} color='primary'>
          {t('Hide editor')}
        </OtherButton>
      )}

      <div id='js-stage-root'>
        <Stage
          width={widthValue}
          height={heightValue}
          onMouseDown={() => setSelectedMode(true)}
          onTouchStart={() => setSelectedMode(true)}
          style={{
            border: '5px solid #ccc',
            margin: '10px auto',
            width: '100%',
            maxWidth: widthValue,
            display: showEditor ? 'block' : 'none',
          }}
        >
          <Layer ref={stageLayerRef}>
            {rectangles.map((rect, i) => {
              return (
                <Rectangle
                  key={i}
                  layer={rect}
                  isSelected={selectedMode}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                    const uri = stageLayerRef.current.toDataURL();
                    setTextureUrl(uri);
                  }}
                />
              );
            })}
            <Image image={image} width={widthValue} height={heightValue} />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default Presenter3d;

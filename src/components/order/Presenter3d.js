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
import { createGuid } from '../../core/helpers/guidHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

//Assets
import defaultObj from '../../assets/cup.obj';
import sampleImg from '../../assets/sample01.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '80px',
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
    w100: {
      width: '100%',
    },
    canvasWrapper: {
      width: '100% !important',
      height: '200px !important',
      minHeight: '160px',
    },
  },
}))(Button);

const Presenter3d = ({ product, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const stageLayerRef = useRef(null);

  const [order, orderDispatch] = useOrder();
  const [textureUrl, setTextureUrl] = useState(null);
  const [showEditor, setShowEditr] = useState(true);
  const [selectedMode, setSelectedMode] = useState(true);
  const [rectangles, setRectangles] = useState([]);

  const [image] = useImage(product.layerImageUrl, 'anonymous');
  console.log('%cLQS logger: ', 'color: #c931eb', { product, order });
  console.log('%cLQS logger: ', 'color: blue', { rectangles });

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

  const saveTexture = (model) => {
    const trackingGuid = createGuid();
    const orderItem = {
      maxSize: product.size,
      guid: trackingGuid,
      fileAsBase64: model.fileAsBase64,
      fileUrl: '',
      fileName: trackingGuid,
      productId: product.id,
      set: pack,
      qty: 1,
      status: 'idle',
    };
    console.log('%cLQS logger: ', 'color: #c931eb', { orderItem });

    orderDispatch({ type: 'ADD_ORDER_ITEM_TEXTURE_3D', payload: orderItem });
  };

  useLayoutEffect(() => {
    const { sizes } = product;
    const images = order.orderItems.filter(
      (i) => i.productId === product.id && i.status === 'SKIP'
    );
    const layers = images.map((img, index) => {
      let tempLayer;
      if (!img.renderConfig) {
        const newConfig = {
          x: sizes[index].positionX,
          y: sizes[index].positionY,
          width: sizes[index].width,
          height: sizes[index].height,
        };
        tempLayer = { ...newConfig };
        orderDispatch({
          type: 'UPDATE_ORDER_ITEM_TEXTURE_CONFIG',
          payload: newConfig,
        });
      } else {
        tempLayer = { ...img.renderConfig };
      }
      tempLayer.url = img.fileUrl;
      return tempLayer;
    });

    // const layers = images.map((img, index) => {
    //   return {
    //     x: sizes[index].positionX,
    //     y: sizes[index].positionY,
    //     width: sizes[index].width,
    //     height: sizes[index].height,
    //     url: img.fileUrl,
    //   };
    // });
    setRectangles([...layers]);
    const uri = stageLayerRef.current.toDataURL();
    setTextureUrl(uri);
  }, [order.orderItems, orderDispatch, product]);

  useEffect(() => {
    const uri = stageLayerRef.current.toDataURL();
    setTextureUrl(uri);
  }, []);

  return (
    <>
      <View3d
        textureUrl={textureUrl}
        modelUrl={getModelUrl()}
        saveFn={saveTexture}
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
      <Box
        style={{
          width: '100%',
        }}
      >
        <div id='js-stage-root' className={classes.w100}>
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
              height: '100%',
              maxHeight: heightValue,
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
            <Layer name='top-layer' />
          </Stage>
        </div>
      </Box>
    </>
  );
};

export default Presenter3d;

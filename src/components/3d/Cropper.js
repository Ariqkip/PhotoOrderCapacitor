//Core
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useDebounceEffect } from './helpers/useDebaunceEffect';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import { canvasPreview } from './helpers/canvasPreview';
import { getPixelCrop } from '../3d/helpers/cropConfigHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  visible: {
    display: 'block',
  },
  hidden: {
    display: 'none',
  },
}));

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const Cropper = ({ uniqKey, display, orderItem, cropConfig }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // console.log('%cLQS logger: ', 'color: #c931eb', {
  //   cropConfig,
  //   orderItem,
  //   uniqKey,
  // });

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [, orderDispatch] = useOrder();

  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [aspect, setAscpect] = useState(4 / 3);
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  useLayoutEffect(() => {
    function reloadImgSrc() {
      if (orderItem) {
        setImgSrc(orderItem.fileUrl);
      }
    }
    reloadImgSrc();
  }, [orderItem]);

  useLayoutEffect(() => {
    function calculateAspect() {
      if (!cropConfig) return 4 / 3;

      return cropConfig.width / cropConfig.height;
    }

    const newAspect = calculateAspect();

    setAscpect(newAspect);
  }, [cropConfig]);

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    200,
    [completedCrop, scale, rotate]
  );

  useEffect(() => {
    function effectWrapper() {
      if (aspect) {
        const width = 100; //set image width
        const height = 100; //set image H
        setCrop(centerAspectCrop(width, height, aspect));
      }
    }

    effectWrapper();
  }, [aspect, orderItem]);

  useLayoutEffect(() => {
    function calculatePxCrop() {
      if (!crop) return null;
      if (!imgRef) return null;
      if (!imgRef.current) return null;

      if (crop.unit == 'px') return crop;

      const editorW = imgRef?.current?.width ?? 0;
      const editorH = imgRef?.current?.height ?? 0;
      const pixelCrop = getPixelCrop(crop, editorW, editorH);

      return pixelCrop;
    }

    const newEndedCrop = calculatePxCrop();

    // handleSetCompletedCrop(newEndedCrop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop]);

  useEffect(() => {
    // console.log('%cLQS logger 001: ', 'color: #c931eb', { completedCrop });
    function executeCropUpdate() {
      if (!completedCrop) return;
      const cropSum =
        completedCrop.x +
        completedCrop.y +
        completedCrop.width +
        completedCrop.height;

      if (cropSum == 0) return;

      const changedX = completedCrop.x != orderItem?.completedCropObj?.x;
      const changedY = completedCrop.y != orderItem?.completedCropObj?.y;
      const changedW =
        completedCrop.width != orderItem?.completedCropObj?.width;
      const changedH =
        completedCrop.height != orderItem?.completedCropObj?.height;
      const updated = changedX + changedY + changedW + changedH;

      if (updated == 0) return;

      const editorW = imgRef?.current?.width ?? 0;
      const editorH = imgRef?.current?.height ?? 0;

      const model = {
        guid: orderItem.guid,
        crop: { ...completedCrop, editorWidth: editorW, editorHeight: editorH },
      };
      orderDispatch({
        type: 'UPDATE_ORDER_ITEM_CROP_COMPLETE',
        payload: model,
      });
    }

    executeCropUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCrop]);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      if (orderItem.cropObj) {
        setCrop(orderItem.cropObj);
      } else {
        const centerCrop = centerAspectCrop(width, height, aspect);
        setCrop(centerCrop);
        const model = { guid: orderItem.guid, crop: centerCrop };
        orderDispatch({ type: 'UPDATE_ORDER_ITEM_CROP', payload: model });
      }
    }
  }

  // const setCompletedCropCallback = (e) => {
  //   const model = { crop: e, guid: uniqKey };
  //   orderDispatch({ type: 'UPDATE_ORDER_ITEM_CROP_COMPLETE', payload: model });
  // };
  // const handleSetCompletedCrop = useCallback(setCompletedCropCallback, [
  //   orderDispatch,
  //   uniqKey,
  // ]);

  if (!imgSrc) return <></>;

  function handleSetCrop(percentCrop) {
    setCrop(percentCrop);
  }

  function handleSetCompletedCrop(e) {
    const model = { crop: e, guid: uniqKey };
    // console.log('%cLQS logger: ', 'color: red', { model });

    //orderDispatch({ type: 'UPDATE_ORDER_ITEM_CROP_COMPLETE', payload: model });
    setCompletedCrop(e);
  }

  return (
    <div className={display ? classes.visible : classes.hidden}>
      <ReactCrop
        key={`cropper_${uniqKey}`}
        crop={crop}
        onChange={(_, percentCrop) => handleSetCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
        keepSelection={true}
      >
        <img
          ref={imgRef}
          alt='Crop me'
          src={imgSrc}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
          onLoad={onImageLoad}
        />
      </ReactCrop>
    </div>
  );
};

export default Cropper;

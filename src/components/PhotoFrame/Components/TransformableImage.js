import React, { useRef, useEffect } from 'react';
import { Image, Group, Rect } from 'react-konva';
import useImage from 'use-image';

const TransformableImage = ({ shapeProps, imgRef, isSelected, onSelect, onChange }) => {
  const [image] = useImage(shapeProps.img.props.src, 'Anonymous');
  const isEditable = image ? image.src.indexOf("https") >= 0 : false;
  const imageRef = useRef();

  useEffect(() => {
    if (imgRef.current && shapeProps.id) {
      imgRef.current[shapeProps.id] = imageRef.current;
    }
  }, [imgRef, shapeProps.id]);

  const calculateImageDimensions = () => {
    if (!image) return { width: 0, height: 0, offsetX: 0, offsetY: 0 };

    const containerWidth = shapeProps.width;
    const containerHeight = shapeProps.height;
    const imageWidth = image.width;
    const imageHeight = image.height;

    const containerRatio = containerWidth / containerHeight;
    const imageRatio = imageWidth / imageHeight;

    let width, height, offsetX, offsetY;

    if (imageRatio > containerRatio) {
      // Image is wider than the container
      height = containerHeight;
      width = imageWidth * (containerHeight / imageHeight);
      offsetX = (width - containerWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller than the container
      width = containerWidth;
      height = imageHeight * (containerWidth / imageWidth);
      offsetX = 0;
      offsetY = (height - containerHeight) / 2;
    }

    return { width, height, offsetX, offsetY };
  };

  const { width, height, offsetX, offsetY } = calculateImageDimensions();

  return (
    <Group
      x={shapeProps.x / 5}
      y={shapeProps.y / 5}
      draggable={isEditable}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = imageRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          width: Math.max(0, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
      onClick={isEditable && onSelect}
      onTap={isEditable && onSelect}
    >
      <Rect
        width={shapeProps.width}
        height={shapeProps.height}
        fill="transparent"
        stroke={"#f00"}
        strokeWidth={isSelected ? 5 : 0}
      />
      <Image
        image={image}
        ref={imageRef}
        width={width}
        height={height}
        offsetX={offsetX}
        offsetY={offsetY}
        opacity={isEditable ? 1 : 0.3}
      />
    </Group>
  );
};

export default TransformableImage;

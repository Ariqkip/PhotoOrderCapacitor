export function getScaleDownFactor(original_px, px) {
  if (px == 0 || original_px == 0) return 0;

  var factor = px / original_px;
  return factor;
}

export function getScaleUpFactor(original_px, px) {
  if (px == 0 || original_px == 0) return 0;

  var factor = original_px / px;
  return factor;
}

export function getPointTransformation(x, y, factor) {
  var newPoint = {
    x: Math.round(x * factor),
    y: Math.round(y * factor),
  };
  return newPoint;
}

export function getRectTransformation(x, y, w, h, factor) {
  var newTopLeft = getPointTransformation(x, y, factor);
  var newBottomRight = getPointTransformation(x + w, y + h, factor);

  var newRect = {
    x: newTopLeft.x,
    y: newTopLeft.y,
    w: newBottomRight.x - newTopLeft.x,
    h: newBottomRight.y - newTopLeft.y,
  };
  return newRect;
}

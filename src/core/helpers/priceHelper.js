import { getSelectedAttributes } from './attributesHelper';

export function formatPrice(num) {
  if (typeof num !== 'number') return null;

  return `${num.toFixed(2)}`;
}

function priceCalculator(productId, quantity, photographer, order) {
  const product = photographer.products.find((p) => p.id === productId);
  if (!product) throw new Error('Missing product info, cant calculate price');

  let priceUnitBase = 0;
  let priceUnitModificator = 0;
  let priceUnitPercentModificator = 100;

  let estimatedPrice = 0;
  let estimatedQuantity = quantity;

  const { price, productPrices } = product;
  if (price) priceUnitBase = price;

  //calculate if its a package item
  const { quantityRangeMin, quantityRangeMax } = product;
  if (
    quantityRangeMin &&
    quantityRangeMin > 0 &&
    quantityRangeMax &&
    quantityRangeMax >= quantityRangeMin
  ) {
    let step = 1;
    const limit = 30;

    for (step; step < limit; step++) {
      const stepMin = quantityRangeMin * step;
      const stepMax = quantityRangeMax * step;

      if (estimatedQuantity >= stepMin && estimatedQuantity <= stepMax)
        estimatedQuantity = stepMax;
    }
  }

  //calculate base price for given range
  if (productPrices && productPrices.length > 0) {
    priceUnitBase = productPrices[0].price;

    const matchingPriceRange = productPrices.find(
      (r) =>
        r.priceLevelFrom <= estimatedQuantity &&
        r.priceLevelTo >= estimatedQuantity
    );

    if (matchingPriceRange) {
      priceUnitBase = matchingPriceRange.price;
    }
  }

  //calculate by attributes
  const config = getSelectedAttributes(productId, order, photographer);

  if (config && config.length > 0) {
    config.map((c) => {
      if (c.priceCorrectionCurrent !== 0) {
        priceUnitModificator += c.priceCorrectionCurrent;
      }

      if (c.priceCorrectionPercent !== 0) {
        priceUnitPercentModificator += c.priceCorrectionPercent;
      }
    });
  }

  estimatedPrice =
    (priceUnitBase + priceUnitModificator) *
    (priceUnitPercentModificator / 100);

  return {
    priceUnitBase,
    priceUnitModificator,
    priceUnitPercentModificator,
    estimatedPrice,
    estimatedQuantity,
    finalPrice: estimatedPrice * estimatedQuantity,
  };
}

export function getLabelPrice(productId, quantity, photographer, order) {
  const calculation = priceCalculator(productId, quantity, photographer, order);
  if (calculation) return calculation.estimatedPrice;

  return 0;
}

export function getPrice(productId, quantity, photographer, order) {
  const calculation = priceCalculator(productId, quantity, photographer, order);
  if (calculation) return calculation.finalPrice;

  return 0;
}

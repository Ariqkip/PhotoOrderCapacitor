import { getSelectedAttributes } from './attributesHelper';

export function formatPrice(num) {
  if (typeof num !== 'number') return null;
  const result = Math.round((num + Number.EPSILON) * 100) / 100;
  return `${result.toFixed(2)}`;
}

function priceCalculator(productId, quantity, photographer, order) {
  const product = photographer.products.find((p) => p.id === productId);
  if (!product) throw new Error('Missing product info, cant calculate price');

  let priceUnitBase = 0;
  let priceUnitModificator = 0;
  let priceUnitPercentModificator = 0;

  let estimatedPrice = 0;
  let estimatedQuantity = quantity;

  let productBasePrices = null;

  const { price, productPrices } = product;
  if (price) priceUnitBase = price;
  
  const { quantityRangeMin, quantityRangeMax } = product;
  if (
    quantityRangeMin &&
    quantityRangeMin > 0 &&
    quantityRangeMax &&
    quantityRangeMax >= quantityRangeMin
  ) {
    let step = 1;
    while(quantity > quantityRangeMax * step){
      step++;
    }
    estimatedQuantity = step;

    // for (step; step < limit; step++) {
    //   const stepMin = quantityRangeMin * step;
    //   const stepMax = quantityRangeMax * step;
    //
    //   if (estimatedQuantity >= stepMin && estimatedQuantity <= stepMax)
    //     estimatedQuantity = stepMax;
    // }
  }

  //calculate base price for given range
  if (productPrices && productPrices.length > 0) {
    priceUnitBase = productPrices[0].price;

    productPrices.forEach((p) => {
      if (p.priceLevelFrom > estimatedQuantity) return;

      if (p.priceLevelTo >= estimatedQuantity || p.priceLevelTo == 0) {
        priceUnitBase = p.price;
      }
    });
    estimatedPrice = priceUnitBase;
  }


  // if (_attributes.Count > 0)
  //             {
  //                 var percentValues = Attributes
  //                     .OrderByDescending(x => x.PriceCorrectionPercent.Value)
  //                     .Select(x => x.PriceCorrectionPercent)
  //                     .ToList();
  //                 foreach (var percent in percentValues)
  //                 {
  //                     if (percent != 0)
  //                     {
  //                         _estimatedPrice *= (percent / 100);
  //                     }
  //                 }
  //
  //                 foreach (var attribute in Attributes)
  //                 {
  //                     if (attribute.PriceCorrectionCurrent != 0)
  //                     {
  //                         _estimatedPrice += attribute.PriceCorrectionCurrent;
  //                     }
  //                 }
  //             }


  //calculate by attributes
  const attributes = getSelectedAttributes(productId, order, photographer)
      .sort((a,b)=>b.priceCorrectionPercent - a.priceCorrectionPercent);

  if (attributes && attributes.length > 0) {
    const percentValues = attributes.map(a=>a.priceCorrectionPercent);

    percentValues.forEach(pV =>{
      if(pV != 0){
        estimatedPrice *= pV / 100;
      }
    });

    attributes.forEach(a=>{
      if(a.priceCorrectionCurrent != 0){
        estimatedPrice += a.priceCorrectionCurrent;
      }
    })
  }

  // const config = getSelectedAttributes(productId, order, photographer);
  //
  // if (config && config.length > 0) {
  //   console.log(config, attributes, percentValues)
  //
  //   config.map((c) => {
  //     if (c.priceCorrectionCurrent !== 0) {
  //       priceUnitModificator += c.priceCorrectionCurrent;
  //     }
  //
  //     if (c.priceCorrectionPercent !== 0) {
  //       priceUnitPercentModificator += c.priceCorrectionPercent;
  //     }
  //   });
  // }

  //prepare product base range prices
  if (productPrices && productPrices.length > 0) {
    productBasePrices = productPrices.map((p) => {
      let result = { ...p };
      var priceStepOne = p.price + priceUnitModificator;
      var priceStepTwo = priceUnitPercentModificator / 100;
      let calculatedPrice = priceStepOne;
      if (priceStepTwo !== 0) {
        calculatedPrice = priceStepOne * priceStepTwo;
      }
      result.price = calculatedPrice;

      return result;
    });
  }

  var estimatedPriceStepOne = priceUnitBase + priceUnitModificator;
  var estimatedPriceStepTwo = priceUnitPercentModificator / 100;
  let finalEstimatedPrice = estimatedPriceStepOne;
  if (estimatedPriceStepTwo !== 0) {
    finalEstimatedPrice = estimatedPriceStepOne * estimatedPriceStepTwo;
  }
  estimatedPrice = finalEstimatedPrice;

  const result = {
    priceUnitBase,
    productBasePrices,
    priceUnitModificator,
    priceUnitPercentModificator,
    estimatedPrice,
    estimatedQuantity,
    finalPrice: estimatedPrice * estimatedQuantity,
  };

  return result;
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

export function getRangePrice(productId, priceId, photographer, order) {
  const calculation = priceCalculator(productId, 1, photographer, order);
  if (calculation && calculation.productBasePrices) {
    const priceRange = calculation.productBasePrices.find(
      (p) => p.id === priceId
    );
    if (priceRange) return priceRange.price;
  }

  return 0;
}

export function getShare3dPrice(product) {
  if (!product) return 0;
  var { productPrices } = product;
  if (!productPrices || productPrices.length == 0) return 0;

  const lowestPrice = productPrices.reduce((acc, loc) =>
    acc.price < loc.price ? acc : loc
  );
  return lowestPrice.price;
}

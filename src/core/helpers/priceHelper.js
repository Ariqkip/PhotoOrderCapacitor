export function formatPrice(num) {
  if (typeof num !== 'number') return null;

  return `${num.toFixed(2)}`;
}

export function getPrice(orderItem, photographer) {
  const product = photographer.products.find(
    (p) => p.id === orderItem.productId
  );
  if (!product) throw new Error('Missing product info, cant calculate price');

  let estimatedPrice = 0;

  const { price, productPrices } = product;
  if (price) estimatedPrice = price;

  if (productPrices && productPrices.length > 0) {
    //TODO: calculate price for given range
  }

  //TODO: calculate if its a package item

  //TODO: calculate by attributes

  return orderItem.qty * estimatedPrice;
}
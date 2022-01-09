export function formatPrice(num) {
  if (typeof num !== 'number') return null;

  return `${num.toFixed(2)}`;
}

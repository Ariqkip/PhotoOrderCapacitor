import legacy from '../core/legacyAPI';
import api from '../core/newAPI';

const OrderService = () => {
  function GetPhotographer(id) {
    const endpoint = `photographer/${id}`;
    return legacy.get(endpoint);
  }

  function GetProducts(id) {
    const endpoint = `products/photographer/${id}`;
    return api.get(endpoint);
  }

  return { GetPhotographer, GetProducts };
};

export default OrderService;

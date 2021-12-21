import axios from '../core/legacyAPI';

const OrderService = () => {
  function GetPhotographer(id) {
    const endpoint = `photographer/${id}`;
    return axios.get(endpoint);
  }

  return { GetPhotographer };
};

export default OrderService;

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

  function CreateOrder(id) {
    const endpoint = `photographer/${id}/order`;
    const body = {
      email: 'missing',
      firstName: 'missing',
      lastName: 'missing',
      phone: 'missing',
      orderItems: [],
    };
    return legacy.post(endpoint, body);
  }

  function UploadImage(model) {
    const endpoint = `photographer/order/${model.orderId}/photo`;
    const body = {
      OrderGuid: model.orderGuid,
      ProductId: model.productId,
      FileAsBase64: model.fileAsBase64,
      FileName: model.fileName,
      TrackingGuid: model.fileGuid,
      Attributes: model.attributes,
    };
    return legacy.post(endpoint, body);
  }

  return { GetPhotographer, GetProducts, CreateOrder, UploadImage };
};

export default OrderService;

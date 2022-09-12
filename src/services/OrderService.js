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

  function GetBanners(photographerId) {
    const endpoint = `Advertisement/Photographer/${photographerId}`;
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

  function FinalizeOrder(order, photographer) {
    const endpoint = `photographer/order/${order.orderId}`;

    const { productAttributes } = photographer;
    const { orderItemsConfig } = order;

    //get greoups and default values
    let defaultAttributes = productAttributes.map((group) => {
      let att;
      if (group.Attributes.length > 0) {
        att = group.Attributes[0];
      }
      return {
        groupId: group.Id,
        selected: att?.Id,
      };
    });

    const orderedItems = order.orderItems.map((item) => {
      let itemAttributes = [];

      const productInfo = photographer.products.find(
        (pa) => pa.id === item.productId
      );
      if (productInfo && productInfo.attributes?.length > 0) {
        const groupIds = [
          ...new Set(productInfo.attributes.map((p) => p.attributesGroupId)),
        ];
        //get item config from context:
        const config = orderItemsConfig.find(
          (c) => c.productId === item.productId
        );
        //read all selected items
        groupIds.map((id) => {
          const selectedValue = config?.configs?.find((c) => c.groupId === id);
          if (selectedValue) itemAttributes.push(selectedValue.selected);
          else {
            const defaultSelection = defaultAttributes.find(
              (a) => a.groupId === id
            );
            if (defaultSelection)
              itemAttributes.push(defaultSelection.selected);
          }
        });
      }

      let result = {
        FileName: item.fileName,
        FileGuid: item.imageGuid,
        FileUrl: item.fileUrl,
        ProductId: item.productId,
        Quantity: item.qty,
        Attributes: itemAttributes,
      };
      let layerIndex = -1;
      if (item.isLayerItem === true) {
        layerIndex++;
        const config = {
          X: item.completedCropObj.x,
          Y: item.completedCropObj.y,
          Width: item.completedCropObj.width,
          Height: item.completedCropObj.height,
          ScaleFactoryUp: 1,
          Guid: item.imageGuid,
          Index: layerIndex,
        };

        result.sizes = config;
      }
      
      return result;
    });

    const body = {
      FirstName: order.firstName,
      LastName: order.lastName,
      Phone: order.phone,
      Email: order.email,
      StreetAddress: order.shippingAddress,
      IsShippingChoosen: order.shippingSelected,
      OrderGuid: order.orderGuid,
      OrderItems: orderedItems,
    };

    return legacy.put(endpoint, body);
  }

  function MarkOrderAsDone(order) {
    const endpoint = `orders/${order.orderId}/done`;
    return legacy.post(endpoint, '');
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

  return {
    GetPhotographer,
    GetBanners,
    GetProducts,
    CreateOrder,
    FinalizeOrder,
    MarkOrderAsDone,
    UploadImage,
  };
};

export default OrderService;

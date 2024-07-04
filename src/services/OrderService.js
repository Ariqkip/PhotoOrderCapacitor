import { Filesystem, Directory } from '@capacitor/filesystem';
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

  const FinalizeOrder = async (order, photographer, authUser, setAuthUser) => {
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
        FilePath: item.filePath,
        // SavedFiles: item.savedFiles
      };
      let layerIndex = -1;
      if (item.isLayerItem === true) {
        layerIndex++;
        const config = {
          X: 0,
          Y: 0,
          Width: 0,
          Height: 0,
          ScaleFactoryUp: 1,
          Guid: item.imageGuid,
          Index: layerIndex,
        };

        result.sizes = config;
      }

      return result;
    });

    const orderData = JSON.parse(
      getCurrentOrderFromStorage(photographer.photographId)
    );

    const body = {
      FirstName: orderData?.firstName,
      LastName: orderData?.lastName,
      Phone: orderData?.phone,
      Email: orderData?.email,
      StreetAddress: orderData?.shippingStreet || '',
      City: orderData?.shippingCity || '',
      Country: orderData?.shippingCountry || '',
      ZipCode: orderData?.shippingZip || '',
      IsShippingChoosen: orderData.shippingSelected,
      OrderGuid: order.orderGuid,
      OrderItems: orderedItems,
      PaymentMethod: order.paymentMethod,
    };

    setAuthUser({
      ...authUser,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      phone: orderData.phone,
      email: orderData.email,
      street: orderData.shippingStreet,
      zipCode: orderData.shippingZip,
      city: orderData.shippingCity,
      country: orderData.shippingCountry,
      lastOrderId: orderData.orderId,
    });

    const totalCost = order.orderItems.reduce((accumulator, currentItem) => {
      return accumulator + parseFloat(currentItem.price);
    }, 0);

    await setLocalStorageOrder(photographer.photographId, {
      ...body,
      Price: totalCost || 0,
      OrderId: orderData.orderId,
      Status: 'Sent',
    });

    removeOrderFromLocalStorage(photographer.photographId);

    if (order.paymentMethod == 2) {
      var vivawalletUrl = photographer.vivawallet;

      window.open(vivawalletUrl);
    }
    const response = legacy.put(endpoint, body);
    return response;
  };

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
    console.log(
      'image data from device',
      JSON.stringify(body, (k, v) => {
        if (k === 'FileAsBase64') {
          return v.length;
        }
        return v;
      })
    );
    return legacy.post(endpoint, body);
  }

  const setLocalStorageOrder = async (userId, orderData) => {
    try {
      const currentTime = new Date().getTime().toString();
      const serializedValue = JSON.stringify({ ...orderData, currentTime });

      localStorage.setItem(`${userId}_${currentTime}`, serializedValue);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  };

  const getAllLocalStorageOrders = async (userId) => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith(`${userId}_`)) {
        const value = localStorage.getItem(key);
        items.push({ key, value });
      }
    }
    return items;
  };

  var previousCount = 0;
  const setCurrentOrderToStorage = (orderData, userId) => {
    try {
      const currentData = localStorage.getItem(userId);
      let mergedData = {};

      if (currentData) {
        mergedData = JSON.parse(currentData);
      }

      mergedData = { ...mergedData, ...orderData };

      if (mergedData.orderItems && mergedData.orderItems.length > 0) {
        mergedData.orderItems.forEach((orderItem) => {
          orderItem.fileAsBase64 = '';
        });
      }

      if (mergedData.shippingSelected === false) {
        const {
          shippingCountry,
          shippingStreet,
          shippingZip,
          shippingCity,
          ...rest
        } = mergedData;
        mergedData = rest;
      }

      if (previousCount != mergedData.orderItems?.length) {
        previousCount = mergedData.orderItems?.length;
        console.log(
          'setCurrentOrderToStorage order count',
          mergedData.orderItems?.length
        );
      }

      const serializedValue = JSON.stringify(mergedData);
      localStorage.setItem(userId, serializedValue);
      if (!serializedValue.endsWith('}')) {
        debugger;
      }
    } catch (err) {
      console.error('Error setting localStorage item:', err);
    }
  };

  const getCurrentOrderFromStorage = (userId) => {
    try {
      return localStorage.getItem(userId);
    } catch (err) {
      console.error('Error getting localStorage item:', err);
    }
  };

  const removeOrderFromLocalStorage = (id) => {
    try {
      localStorage.removeItem(id);
    } catch (err) {
      console.error('Error setting localStorage item:', err);
    }
  };

  const shortPathForFile = (path) => {
    return 'file-with-path' + path?.split('/').slice(-2).join('-');
  };
  const setBase64DataWithFilePath = async (path, base64data) => {
    if (!path || !base64data) {
      return;
    }
    console.log(
      'setBase64DataWithFilePath:',
      path,
      'data length ',
      base64data?.length,
      'short',
      shortPathForFile(path)
    );
    try {
      await Filesystem.writeFile({
        path: shortPathForFile(path),
        data: base64data,
        directory: Directory.Documents,
        encoding: 'utf8',
      });
    } catch (error) {
      console.error('Error setting file data:', error);
    }
  };

  const getBase64DataWithFilePath = async (path) => {
    console.log(
      'getBase64DataWithFilePath:',
      path,
      'short',
      shortPathForFile(path)
    );
    try {
      const file = await Filesystem.readFile({
        path: shortPathForFile(path),
        directory: Directory.Documents,
        encoding: 'utf8',
      });
      return file.data;
    } catch (err) {
      console.error('Error getting file data:', err);
    }
  };

  const removeBase64DataWithFilePath = async (path) => {
    try {
      await Filesystem.deleteFile({
        path: shortPathForFile(path),
      });
    } catch (err) {
      console.error(
        'Error setting localStorage item:',
        err,
        'short',
        shortPathForFile(path)
      );
    }
  };

  return {
    GetPhotographer,
    GetBanners,
    GetProducts,
    CreateOrder,
    FinalizeOrder,
    MarkOrderAsDone,
    UploadImage,
    getAllLocalStorageOrders,
    setCurrentOrderToStorage,
    getCurrentOrderFromStorage,
    setLocalStorageOrder,
    removeOrderFromLocalStorage,
    getBase64DataWithFilePath,
    removeBase64DataWithFilePath,
    setBase64DataWithFilePath,
  };
};

export default OrderService;

export const INIT_STATE = {
  photographerId: 0,
  orderId: '',
  orderGuid: '',
  status: 'NEW',
  email: 'missing',
  phone: 'missing',
  firstName: 'missing',
  lastName: 'missing',
  shippingSelected: false,
  shippingName: '',
  shippingAddress: '',
  shippingEmail: '',
  //orderInitialized: false,
  //orderRequestSend: false,
  //orderSending: false,
  //orderFinalized: false,
  orderItems: [
    // {
    //   id: 'adacasdada',
    //   fileUrl:
    //     'https://cdn.natemat.pl/cf55267c7b80326b81fd2e8f8e1cc42b,981,0,0,0.jpg',
    //   fileName: 'wakacje01.jpg',
    //   productId: 4398,
    //   quantity: 2,
    //     attributes: [],
    // },
    // {
    //   id: 'vsasdgdsfgs',
    //   fileUrl:
    //     'https://g.gazetaprawna.pl/p/_wspolne/pliki/4548000/4548447-wakacje-podroz.jpg',
    //   fileName: 'wakacje01.jpg',
    //   productId: 4398,
    //   quantity: 2,
    // },
    // {
    //   id: '1asdsgsafsg',
    //   fileUrl:
    //     'https://s3.egospodarka.pl/grafika2/turystyka-zagraniczna/Wakacje-2018-na-razie-taniej-niz-rok-temu-201769-640x640.jpg',
    //   fileName: 'wakacje01.jpg',
    //   productId: 4400,
    //   quantity: 1,
    // },
  ],
};

export function OrderReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case 'CREATE':
      const { PhotographerId, OrderId, OrderGuid } = action.payload;
      const { Email, FirstName, LastName, Phone } = action.payload;
      const { IsShippingChoosen } = action.payload;

      return {
        ...state,
        photographerId: PhotographerId,
        orderId: OrderId,
        orderGuid: OrderGuid,
        phone: Phone,
        email: Email,
        firstName: FirstName,
        lastName: LastName,
        shippingSelected: IsShippingChoosen,
        status: 'INITIALIZED',
      };

    case 'ADD_ORDER_ITEM':
      return { ...state, orderItems: [action.payload, ...state.orderItems] };

    case 'INCREASE_ORDER_ITEM_QTY':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.qty++;
            }
            return item;
          }),
        ],
      };

    case 'DECRESE_ORDER_ITEM_QTY':
      return {
        ...state,
        orderItems: [
          ...state.orderItems
            .map((item) => {
              if (item.guid === action.payload.guid) {
                item.qty--;
              }
              return item;
            })
            .filter((item) => item.qty > 0),
        ],
      };

    case 'REMOVE_ORDER_ITEMS_FOR_PRODUCT':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.filter(
            (item) => item.productId !== action.payload.productId
          ),
        ],
      };

    case 'ORDER_ITEM_SET_STATE_PROCESSING':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.status = 'processing';
            }
            return item;
          }),
        ],
      };

    case 'ORDER_ITEM_SET_STATE_SUCCESS':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.status = 'success';
              item.fileAsBase64 = null; //release memory
            }
            return item;
          }),
        ],
      };

    case 'ORDER_ITEM_SET_STATE_FAILED':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.status = 'failed';
            }
            return item;
          }),
        ],
      };

    case 'ORDER_SET_FIRST_NAME':
      return {
        ...state,
        firstName: action.payload.firstName,
      };

    case 'ORDER_SET_LAST_NAME':
      return {
        ...state,
        lastName: action.payload.lastName,
      };

    case 'ORDER_SET_EMAIL':
      return {
        ...state,
        email: action.payload.email,
      };

    case 'ORDER_SET_PHONE':
      return {
        ...state,
        phone: action.payload.phone,
      };

    case 'ORDER_SET_SHIPPING':
      return {
        ...state,
        shippingSelected: action.payload.shipping,
      };

    case 'ORDER_SET_SHIPPING_NAME':
      return {
        ...state,
        shippingName: action.payload.shippingName,
      };

    case 'ORDER_SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload.shippingAddress,
      };

    case 'ORDER_SET_SHIPPING_EMAIL':
      return {
        ...state,
        shippingEmail: action.payload.shippingEmail,
      };

    case 'FINALIZE':
      return {
        ...state,
        status: 'FINALIZING',
      };

    case 'FINALIZE_REQUESTED':
      return {
        ...state,
        status: 'PROCESSING',
      };

    case 'SUCCESS':
      return {
        ...state,
        status: 'SUCCESS',
      };

    case 'FAILED':
      return { ...state, status: 'ERROR' };

    default:
      return state;
  }
}

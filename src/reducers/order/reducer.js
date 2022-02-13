export const INIT_STATE = {
  orderId: '',
  orderGuid: '',
  state: 'NEW',
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
      return INIT_STATE;

    default:
      return state;
  }
}

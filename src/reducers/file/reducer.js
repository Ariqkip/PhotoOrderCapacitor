const INIT_STATE = {
  filesQueue: [],
};

export function FileReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case 'ADD_FILE':
      var file = action.data;
      if (file === undefined) {
        return { ...state };
      }
      var newState = { ...state, filesQueue: [...state.filesQueue, file] };
      return newState;

    default:
      return { ...state };
  }
}

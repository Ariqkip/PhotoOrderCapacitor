import React from 'react';
import { FileReducer } from '../reducers/file/reducer';

const FileContext = React.createContext();

function FileProvider(props) {
  const state = {
    filesQueue: [],
  };
  const [files, dispatch] = React.useReducer(FileReducer, state);
  const value = [files, dispatch];

  return <FileContext.Provider value={value} {...props} />;
}

function useFiles() {
  const context = React.useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within the FileProvider component');
  }
  return context;
}

export { FileContext, FileProvider, useFiles };

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'index.css';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import { persistStore } from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/es/storage/session';
import user from "store/modules/user";
import thunk from 'redux-thunk';
import App from 'App';
import TokenValidation from 'store/TokenValidation';

// config 작성
const persistConfig = {
  key: "root", // sessionStorage key 
  storage, // sessionStorage
  whitelist: ["userReducer"], // target (reducer name)
}

const rootReducer = combineReducers({
  userReducer: user
});

const store = configureStore({
  reducer: persistReducer(persistConfig ,rootReducer),
  middleware: [thunk],
  devTools: true,
});

const persistor = persistStore(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <TokenValidation/>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
);
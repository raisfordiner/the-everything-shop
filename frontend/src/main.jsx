import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {createStore} from "redux";
import allReducers from './redux/reducers/reducers.js';
import {Provider} from "react-redux";

import store from './redux/store'

// const store = createStore(allReducers);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
  </Provider>
)

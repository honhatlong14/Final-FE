import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import rootSaga from './store/saga';
import { saga, persistor, store } from './store/index';
import { ThemeProvider } from "@material-tailwind/react";
import {DataProvider} from "./components/DataProvider";

saga.run(rootSaga);

const root = createRoot(document.getElementById('root'));

root.render(

        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ThemeProvider>
                    <DataProvider>
                    <App />
                    </DataProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
);

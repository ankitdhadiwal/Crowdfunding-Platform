import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom';
import {ChainId, ThirdwebProvider} from '@thirdweb-dev/react';
import App from "./App";
import './index.css';
import { StateContextProvider } from './context';
import {Sepolia} from "@thirdweb-dev/chains";

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <ThirdwebProvider 
        activeChain={Sepolia}
        clientId="4255542225192d85a6862a8499d0e6d2"
    >
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)
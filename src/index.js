import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { FirebaseAppProvider } from 'reactfire';

const firebaseConfig = {
    apiKey: "AIzaSyAxarHgOWrb6kp2uYZxCRxdDRDbu6NTpGk",
    authDomain: "compracompartilhada-fba68.firebaseapp.com",
    databaseURL: "https://compracompartilhada-fba68.firebaseio.com",
    projectId: "compracompartilhada-fba68",
    storageBucket: "compracompartilhada-fba68.appspot.com",
    messagingSenderId: "512732959881",
    appId: "1:512732959881:web:046e7aa7c76c78af72e258",
    measurementId: "G-9R865M3DDJ"
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

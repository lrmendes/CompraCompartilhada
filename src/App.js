import React, {Suspense} from 'react';
import { useFirestoreDocData, useFirestore, SuspenseWithPerf, AuthCheck } from 'reactfire';
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import { createRoot } from 'react-dom';
import AppBarModel from "./components//AppBar";
import AuthPage from "./pages/Auth";
import CssBaseline from '@material-ui/core/CssBaseline';

function Burrito() {
  // lazy load the Firestore SDK
  // and create a ref
  const burritoRef = useFirestore()
    .collection('tryreactfire')
    .doc('burrito');

  // subscribe to the doc. just one line!
  // throws a Promise for Suspense to catch,
  // and then streams live updates
  const burrito = useFirestoreDocData(burritoRef);

  return <p>The burrito is {burrito.yummy ? 'good' : 'bad'}!</p>;
}

function App() {
  return (
    <BrowserRouter>
      <Switch>
    <Suspense fallback={<h2>Carregando Firebase...</h2>}>
      <AuthCheck fallback={<AuthPage />}>
        <AppBarModel />
      </AuthCheck>
    </Suspense>
    </Switch>
    </BrowserRouter>
  );
}

//createRoot(document.getElementById('root')).render(<App />);

export default App;
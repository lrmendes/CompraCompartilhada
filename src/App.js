import React from 'react';
import { useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';
import AppBarModel from "./components//AppBar";
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
  <React.Fragment>
    <AppBarModel />
  </React.Fragment>
  );
}

export default App;

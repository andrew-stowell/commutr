import firebase from 'firebase';
const config = {
  apiKey: "AIzaSyBYt89cty07pbj1gLOiMQmsSpiFWHUMFG4",
  authDomain: "commutr-1d505.firebaseapp.com",
  databaseURL: "https://commutr-1d505.firebaseio.com",
  projectId: "commutr-1d505",
  storageBucket: "commutr-1d505.appspot.com",
  messagingSenderId: "180572649674"
};

firebase.initializeApp(config);
export default firebase;
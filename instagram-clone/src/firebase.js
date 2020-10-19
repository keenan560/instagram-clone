import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmDCyZptGIxaNCVaa90x0C5EK0vYZWG3Q",
  authDomain: "instagram-clone-e601f.firebaseapp.com",
  databaseURL: "https://instagram-clone-e601f.firebaseio.com",
  projectId: "instagram-clone-e601f",
  storageBucket: "instagram-clone-e601f.appspot.com",
  messagingSenderId: "931043934476",
  appId: "1:931043934476:web:4ce756e85fc92cddcb4929",
  measurementId: "G-XSDK1TXCJ8",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { database, auth, storage };

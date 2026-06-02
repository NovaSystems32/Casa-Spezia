// ===== CONFIGURACIÓN FIREBASE – CASA SPEZIA =====
const firebaseConfig = {
  apiKey: "AIzaSyA9JD1_laeaH8Nv23v7Sy3IK7_6iEdm1vE",
  authDomain: "casa-spezia.firebaseapp.com",
  projectId: "casa-spezia",
  storageBucket: "casa-spezia.firebasestorage.app",
  messagingSenderId: "865671739287",
  appId: "1:865671739287:web:7de0030ccabe174c7176d2",
  measurementId: "G-NJFGLW8DLJ"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

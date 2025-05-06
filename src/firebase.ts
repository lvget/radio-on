// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB4ttwcs82cTrCuRq3zfwpXOvaG5bi_E7Q',
  authDomain: 'onlineradio-d76b5.firebaseapp.com',
  projectId: 'onlineradio-d76b5',
  storageBucket: 'onlineradio-d76b5.appspot.com',
  messagingSenderId: '816839944804',
  appId: '1:816839944804:web:d9030f174f3e064f41cd71',
  measurementId: 'G-TXVVTMCTX0'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
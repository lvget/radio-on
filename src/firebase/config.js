import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  // GoogleAuthProvider,
  // FacebookAuthProvider,
  // TwitterAuthProvider,
  // GithubAuthProvider,
  // OAuthProvider, // Для Microsoft
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB4ttwcs82cTrCuRq3zfwpXOvaG5bi_E7Q',
  authDomain: 'onlineradio-d76b5.firebaseapp.com',
  projectId: 'onlineradio-d76b5',
  storageBucket: 'onlineradio-d76b5.firebasestorage.app',
  messagingSenderId: '816839944804',
  appId: '1:816839944804:web:d9030f174f3e064f41cd71',
  measurementId: 'G-TXVVTMCTX0',
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

// Инициализация провайдеров
// const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();
// const twitterProvider = new TwitterAuthProvider();
// const githubProvider = new GithubAuthProvider();
// const microsoftProvider = new OAuthProvider('microsoft.com');

export { app, auth };

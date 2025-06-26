import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './config';
import { ref } from 'vue';

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

const userFb = ref(null);

auth.onAuthStateChanged((user) => {
  userFb.value = user;
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('User is signed out', user);
  }
});

export { app, auth, userFb };

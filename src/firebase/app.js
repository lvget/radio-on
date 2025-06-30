import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './config';
import { ref } from 'vue';

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);

const user = ref(null);

auth.onAuthStateChanged((userImpl) => {
  if (userImpl) {
    console.log('User is signed in:', userImpl);
    user.value = {
      uid: userImpl.uid,
      email: userImpl.email,
      displayName: userImpl.displayName,
      photoURL: userImpl.photoURL,
      providerId: userImpl.providerData[0].providerId,
    };
  } else {
    console.log('User is signed out');
    user.value = null;
  }
});

export { app, auth, user };

<template>
  <div class="auth-card q-pa-md bg1">
    <div>Welcome to Radio-On</div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { auth } from 'src/firebase/app'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult: any, redirectUrl: any) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      //document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      clientId: '816839944804-dc7umuqs3k3epbdj1n2p6apdhriuq3tm.apps.googleusercontent.com'
    },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    {
      provider: firebase.auth.GithubAuthProvider.PROVIDER_ID
    }
  ],
  //credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
  // Terms of service url.
  //tosUrl: '<your-tos-url>',
  // Privacy policy url.
  //privacyPolicyUrl: '<your-privacy-policy-url>'
};



onMounted(() => {
  ui.start('#firebaseui-auth-container', uiConfig);
})
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

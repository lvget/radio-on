<template>
  <div class="auth-card q-pa-md bg1">
    <!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
    <div>Welcome to Radio On</div>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
  githubProvider,
  microsoftProvider
} from 'src/firebase/config'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'


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
    // Leave the lines as is for the providers you want to offer your users.
    //googleProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID

  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
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

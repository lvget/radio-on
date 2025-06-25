<template>
  <div class="social-auth-card text-center q-pa-md">
    <div class="text-h q-mb-md">Войти через соцсети.</div>
    <div class="row q-gutter-md justify-center">
      <template v-for="p in providers" :key="p.name">
        <q-btn round :color="p.color" :icon="p.icon" @click="signInWithProvider(p)" :loading="p.loading">
          <q-tooltip>Войти с {{ p.name }}</q-tooltip>
        </q-btn>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  signInWithPopup,
  GoogleAuthProvider,
  //FacebookAuthProvider,
  //TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider, // Для Microsoft
} from 'firebase/auth';
import { auth } from 'src/firebase/config'
import { NotifyOk, NotifyError } from 'src/quasar-helpers/notify'

const providers = ref([{
  name: 'google',
  icon: 'fa-brands fa-google',
  color: 'red',
  tooltip: 'Войти с Google',
  provider: GoogleAuthProvider,
  loading: false
},//{
//   name: 'facebook',
//   icon: 'fa-brands fa-facebook-f',
//   color: 'blue',
//   tooltip: 'Войти с Facebook',
//   provider: FacebookAuthProvider,
//  loading: false
// }, {
//   name: 'twitter',
//   icon: 'fa-brands fa-twitter',
//   color: 'light-blue',
//   tooltip: 'Войти с Twitter',
//   provider: TwitterAuthProvider,
//  loading: false
// },
{
  name: 'github',
  icon: 'fa-brands fa-github',
  color: 'dark',
  tooltip: 'Войти с GitHub',
  provider: GithubAuthProvider,
  loading: false
}, {
  name: 'microsoft',
  icon: 'fa-brands fa-microsoft',
  color: 'grey-8',
  tooltip: 'Войти с Microsoft',
  provider: OAuthProvider, // Для Microsoft new OAuthProvider('microsoft.com');
  loading: false
}])

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('User is signed out');
  }
});
async function signInWithProvider(providerInfo) {
  providerInfo.loading = true
  debugger
  try {
    const provider = new providerInfo.provider()
    const result = await signInWithPopup(auth, provider)
    //const result = await auth().signInWithPopup(provider);
    console.log('User:', result.user);
    NotifyOk('Успешный вход через ' + providerInfo.name.charAt(0).toUpperCase() + providerInfo.name.slice(1) + '!')
  }
  catch (error) {

    let errorMessage = 'Ошибка авторизации'

    // Обработка специфичных ошибок
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'Аккаунт уже существует с другими учетными данными'
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Окно авторизации было закрыто'
    } else {
      errorMessage = error.message
    }
    NotifyError(errorMessage)
  } finally {
    providerInfo.loading = false
  }
}
</script>

<style scoped>
.social-auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

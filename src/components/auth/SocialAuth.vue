<template>
  <div class="row q-gutter-md items-center q-pa-md">
    <div class="">Войти через </div>
    <div class="row items-center justify-center col">
      <template v-for="p in providers" :key="p.name">
        <q-btn class="q-mx-sm" round :color="p.color" :icon="p.icon" @click="signIn(p)" :loading="p.loading">
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
  GithubAuthProvider,
  //FacebookAuthProvider,
  //TwitterAuthProvider,
  // OAuthProvider, // Для Microsoft
} from 'firebase/auth';
import { signInWithPopupYandex } from './YandexAuthProvider'
import { auth } from 'src/firebase/app'
import { NotifyOk, NotifyError } from 'src/quasar-helpers/notify'

const providers = ref([{
  name: 'google',
  icon: 'fa-brands fa-google',
  color: 'red',
  tooltip: 'Войти с Google',
  provider: GoogleAuthProvider,
  loading: false
}, {
  name: 'github',
  icon: 'fa-brands fa-github',
  color: 'dark',
  tooltip: 'Войти с GitHub',
  provider: GithubAuthProvider,
  loading: false
}, {
  name: 'yandex',
  icon: 'fa-brands fa-yandex',
  color: 'dark',
  tooltip: 'Войти с Yandex',
  provider: signInWithPopupYandex,
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
  // {
  // name: 'microsoft',
  // icon: 'fa-brands fa-microsoft',
  // color: 'grey-8',
  // tooltip: 'Войти с Microsoft',
  // provider: OAuthProvider, // Для Microsoft new OAuthProvider('microsoft.com');
  // loading: false
  // }
])

async function signIn(providerInfo) {
  providerInfo.loading = true

  try {
    let result;
    if (providerInfo.name === 'yandex') {
      result = await signInWithPopupYandex(auth)
    } else {
      result = await signInWithPopup(auth, providerInfo.provider())
    }


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
  }
  finally {
    providerInfo.loading = false
  }
}

async function signInWithProvider(providerInfo) {
  providerInfo.loading = true
  try {
    const provider = new providerInfo.provider()
    const result = await signInWithPopup(auth, provider)

    //const credential = providerInfo.provider.credentialFromResult(result);
    //const token = credential.accessToken;
    // The signed-in user info.
    //const user = result.user;
    //console.log('User:', user);
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

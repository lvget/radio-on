<template>
  <q-card class="social-auth-card q-pa-md">
    <q-card-section class="text-center">
      <div class="text-h6 q-mb-md">Войти через соцсети</div>

      <div class="row q-gutter-md justify-center">
        <!-- Google -->
        <q-btn round color="red" icon="fa-brands fa-google" @click="signInWithProvider('google')"
          :loading="loading.google">
          <q-tooltip>Войти с Google</q-tooltip>
        </q-btn>

        <!-- Facebook -->
        <q-btn round color="blue" icon="fa-brands fa-facebook-f" @click="signInWithProvider('facebook')"
          :loading="loading.facebook">
          <q-tooltip>Войти с Facebook</q-tooltip>
        </q-btn>

        <!-- Twitter -->
        <q-btn round color="light-blue" icon="fa-brands fa-twitter" @click="signInWithProvider('twitter')"
          :loading="loading.twitter">
          <q-tooltip>Войти с Twitter</q-tooltip>
        </q-btn>

        <!-- GitHub -->
        <q-btn round color="dark" icon="fa-brands fa-github" @click="signInWithProvider('github')"
          :loading="loading.github">
          <q-tooltip>Войти с GitHub</q-tooltip>
        </q-btn>

        <!-- Microsoft -->
        <q-btn round color="grey-8" icon="fa-brands fa-microsoft" @click="signInWithProvider('microsoft')"
          :loading="loading.microsoft">
          <q-tooltip>Войти с Microsoft</q-tooltip>
        </q-btn>
      </div>

      <div class="text-caption q-mt-md">Или используйте email и пароль</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { signInWithPopup } from 'firebase/auth'
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
  githubProvider,
  microsoftProvider
} from '../../firebase/config'

const $q = useQuasar()

const loading = ref({
  google: false,
  facebook: false,
  twitter: false,
  github: false,
  microsoft: false
})

const getProvider = (providerName) => {
  switch (providerName) {
    case 'google': return googleProvider
    case 'facebook': return facebookProvider
    case 'twitter': return twitterProvider
    case 'github': return githubProvider
    case 'microsoft': return microsoftProvider
    default: throw new Error('Unknown provider')
  }
}

const signInWithProvider = async (providerName) => {
  loading.value[providerName] = true

  try {
    const provider = getProvider(providerName)
    await signInWithPopup(auth, provider)

    $q.notify({
      color: 'positive',
      message: `Успешный вход через ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}!`,
      icon: 'check_circle'
    })
  } catch (error) {
    let errorMessage = 'Ошибка авторизации'

    // Обработка специфичных ошибок
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'Аккаунт уже существует с другими учетными данными'
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Окно авторизации было закрыто'
    } else {
      errorMessage = error.message
    }

    $q.notify({
      color: 'negative',
      message: errorMessage,
      icon: 'error'
    })
  } finally {
    loading.value[providerName] = false
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

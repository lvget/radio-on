<template>
  <div class="auth-card q-pa-md bg1">
    <!-- <q-card-section>
      <div class="text-h6 text-center">Авторизация</div>
    </q-card-section> -->


    <q-form @submit.prevent="handleLogin">
      <q-input dense v-model="email" label="Email" type="email" outlined lazy-rules input-class="bg2 text2"
        :rules="[val => !!val || 'Email обязателен', isValidEmail]" class="q-mb-xs" />

      <q-input dense v-model="password" label="Пароль" :type="showPassword ? 'text' : 'password'" outlined lazy-rules
        :rules="[val => !!val || 'Пароль обязателен', val => val.length >= 6 || 'Пароль должен быть не менее 6 символов']"
        class="q-mb-xs" input-class="bg2 text2">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <div class="row q-gutter-md">
        <q-btn label="Войти" type="submit" color="primary" class="full-width" :loading="loading" />
      </div>
    </q-form>

    <div class="text-center q-mt-md">
      <q-btn label="Забыли пароль?" flat color="primary" @click="resetPassword" :disable="loading" no-caps />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, googleProvider } from '../../firebase/config'

const $q = useQuasar()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
//const rememberMe = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const isLoginMode = ref(true)

const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Некорректный email'
}

const toggleAuthMode = () => {
  isLoginMode.value = !isLoginMode.value
}

const handleLogin = async () => {
  loading.value = true
  try {
    if (isLoginMode.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      $q.notify({
        color: 'positive',
        message: 'Успешный вход!'
      })
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      $q.notify({
        color: 'positive',
        message: 'Регистрация успешна!'
      })
    }
  } catch (error) {
    let errorMessage = 'Произошла ошибка'
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Пользователь не найден'
        break
      case 'auth/wrong-password':
        errorMessage = 'Неверный пароль'
        break
      case 'auth/email-already-in-use':
        errorMessage = 'Email уже используется'
        break
      case 'auth/weak-password':
        errorMessage = 'Пароль слишком слабый'
        break
      default:
        errorMessage = error.message
    }
    $q.notify({
      color: 'negative',
      message: errorMessage
    })
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  googleLoading.value = true
  try {
    await signInWithPopup(auth, googleProvider)
    $q.notify({
      color: 'positive',
      message: 'Успешный вход через Google!'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message
    })
  } finally {
    googleLoading.value = false
  }
}

const resetPassword = async () => {
  if (!email.value) {
    $q.notify({
      color: 'negative',
      message: 'Введите email для восстановления пароля'
    })
    return
  }

  loading.value = true
  try {
    await sendPasswordResetEmail(auth, email.value)
    $q.notify({
      color: 'positive',
      message: 'Письмо для восстановления пароля отправлено на ваш email'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

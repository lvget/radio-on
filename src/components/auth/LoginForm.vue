<template>
  <div>
    <q-tabs dense class="q-ma-sm" v-model="mode">
      <q-tab name="login" label="Вход" />
      <q-tab name="register" label="Регистрация" />
    </q-tabs>
    <q-form @submit.prevent="handleLogin">
      <q-input dense v-model="email" label="Email" type="email" outlined lazy-rules
        :rules="[val => !!val || 'Email обязателен', isValidEmail]" class="q-mb-xs" />

      <q-input dense v-model="password" label="Пароль" :type="showPassword ? 'text' : 'password'" outlined lazy-rules
        :rules="[val => !!val || 'Пароль обязателен', val => val.length >= 6 || 'Пароль должен быть не менее 6 символов']"
        class="q-mb-xs">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <q-input v-if="mode === 'register'" dense v-model="passwordConfirm" label="Подтверждение"
        :type="showPassword ? 'text' : 'password'" outlined lazy-rules
        :rules="[val => !!val || 'Пароль обязателен', val => val.length >= 6 || 'Пароль должен быть не менее 6 символов']"
        class="q-mb-xs">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <div class="text-center">
        <template v-if="mode === 'login'">
          <q-btn label="Войти" type="submit" color="primary" :loading="loading" />
          <br>
          <q-btn class="q-mt-md" label="Забыли пароль?" flat color="primary" @click="resetPassword" :disable="loading"
            no-caps />
        </template>
        <q-btn v-else label="Регистрация" type="submit" color="primary" :loading="loading" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NotifyOk, NotifyError } from 'src/quasar-helpers/notify'
import {
  AuthErrorCodes,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from 'src/firebase/app'


const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const mode = ref('login')

watch(mode, () => {
  email.value = ''
  password.value = ''
  passwordConfirm.value = ''
})

const isValidEmail = (val: string) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Некорректный email'
}

const handleLogin = async () => {
  try {
    if (mode.value === 'login') {
      loading.value = true
      await signInWithEmailAndPassword(auth, email.value, password.value)
      NotifyOk('Успешный вход!')
    } else {
      if (password.value !== passwordConfirm.value) {
        NotifyError('Пароли не совпадают')
        return;
      }
      loading.value = true
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      NotifyOk('Регистрация успешна!')
      email.value = ''
      password.value = ''
      passwordConfirm.value = ''
    }
  } catch (error: any) {
    let errorMessage = 'Произошла ошибка'
    switch (error.code) {
      case AuthErrorCodes.USER_DELETED:
        errorMessage = 'Пользователь не найден'
        break
      case AuthErrorCodes.INVALID_PASSWORD:
        errorMessage = 'Неверный пароль'
        break
      case AuthErrorCodes.EMAIL_EXISTS:
        errorMessage = 'Email уже используется'
        break
      case AuthErrorCodes.WEAK_PASSWORD:
        errorMessage = 'Пароль слишком слабый'
        break
      default:
        errorMessage = error.message
    }
    NotifyError(errorMessage)
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!email.value) {
    NotifyError('Введите email для восстановления пароля')
    return
  }

  loading.value = true
  try {
    await sendPasswordResetEmail(auth, email.value)
    NotifyOk('Письмо для восстановления пароля отправлено на ваш email')
  } catch (error) {
    NotifyError('error.message')
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

input {
  background-color: inherit !important;
}
</style>

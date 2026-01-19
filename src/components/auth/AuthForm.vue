<template>
  <div class="auth-card q-pa-md bg-white text-black">
    <div class="text-h5 q-mb-md text-center">Welcome</div>
    <q-separator class="q-mt-md" />
    <div v-if="user">
      <!-- <div class="text-h6 q-mb-md">Вы вошли как:</div> -->
      <div class="row items-center justify-center" style="min-height: 150px;">
        <div>
          <q-avatar size="100px" class="q-mx-md">
            <img :src="user.photoURL" v-if="user.photoURL" class="q-mx-md" />

          </q-avatar>
        </div>
        <div>
          <div>{{ user.displayName }}</div>
          <div>{{ user.email }}</div>
          <q-separator class="q-mt-md" />
          <div class="text-caption text-weight-light">provider: {{ user.providerId }}</div>
        </div>
      </div>
      <q-separator class="q-mt-md" />
      <div class="text-center q-mt-md">
        <q-btn label="Выйти" @click="doSignOut()" color="primary" />
      </div>
    </div>
    <div v-else>
      <LoginForm />
      <q-separator class="q-mt-md" />
      <SocialAuth />
    </div>
  </div>
</template>

<script setup lang="ts">
import { signOut } from 'firebase/auth'
import SocialAuth from './SocialAuth.vue'
import LoginForm from './LoginForm.vue'
import { auth, user } from 'src/firebase/app'
import { NotifyOk, NotifyError } from 'src/quasar-helpers/notify'

function doSignOut() {
  signOut(auth).then(() => {
    NotifyOk('Вы успешно вышли из аккаунта.');
  }).catch((error) => {
    NotifyError('Произошла ошибка при выходе из аккаунта.');
  });
}
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

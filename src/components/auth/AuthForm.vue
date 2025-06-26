<template>
  <div class="auth-card q-pa-md bg-white text-black">
    <div class="text-h5 q-mb-md text-center">Welcome</div>

    <div v-if="userFb">
      {{ userFb }}
    </div>
    <div v-else>
      <LoginForm />
      <q-separator class="q-mt-md" />
      <SocialAuth />
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialAuth from './SocialAuth.vue'
import LoginForm from './LoginForm.vue'
import { userFb } from 'src/firebase/app'

</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

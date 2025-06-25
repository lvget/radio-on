<template>
  <div class="auth-card q-pa-md bg-white text-black">
    <div class="text-h5 q-mb-md text-center">Welcome</div>
    <LoginForm />
    <q-separator class="q-mt-md" />
    <SocialAuth />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SocialAuth from './SocialAuth.vue'
import LoginForm from './LoginForm.vue'

const tab = ref('login')
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

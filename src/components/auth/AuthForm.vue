<template>
  <div class="auth-card q-pa-md bg1">
    <div class="text-h5 q-mb-md text-center">Welcome</div>
    <q-tabs dense class="q-ma-sm" v-model="tab">
      <q-tab name="login" label="Вход" />
      <q-tab name="register" label="Register" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated class="q-pa-md bg1" style="min-height: 250px;">
      <q-tabpanel name="login">
        <LoginForm />
      </q-tabpanel>
      <q-tabpanel name="register">
        <RegisterForm />
      </q-tabpanel>
    </q-tab-panels>

    <q-separator class="q-mt-md" />
    <SocialAuth />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SocialAuth from './SocialAuth.vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const tab = ref('login')
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>

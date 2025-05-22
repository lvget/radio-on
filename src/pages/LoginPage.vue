<template>
  <div class="row justify-center items-center " style="height: 100vh;">
    <q-card class="auth-container q-pa-lg bg1">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="login" label="Вход" />
        <q-tab name="register" label="Регистрация" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <LoginForm />
          <SocialAuth class="q-mt-md" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <RegisterForm />
          <SocialAuth class="q-mt-md" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from 'components/auth/LoginForm.vue'
import RegisterForm from 'components/auth/RegisterForm.vue'
import SocialAuth from 'components/auth/SocialAuth.vue'

const tab = ref('login')
</script>

<style>
.auth-container {
  width: 100%;
  max-width: 450px;
}
</style>

<template>
  <q-page class="row justify-center items-center">
    <!-- <div class=" auth-container q-pa-lg">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="social" label="Вход" no-caps />
        <q-tab name="login" label="E-mail" no-caps />
        <q-tab name="register" label="Регистрация" no-caps />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg1">
        <q-tab-panel name="login">
          <LoginForm />
        </q-tab-panel>

        <q-tab-panel name="register">
          <RegisterForm />
        </q-tab-panel>

        <q-tab-panel name="social">
          <SocialAuth class="q-mt-md bg1" />
        </q-tab-panel>
      </q-tab-panels>
    </div> -->
    <LoginUi />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from 'components/auth/LoginForm.vue'
import RegisterForm from 'components/auth/RegisterForm.vue'
import SocialAuth from 'components/auth/SocialAuth.vue'
import LoginUi from 'components/auth/LoginUi.vue'

const tab = ref('social')
</script>

<style>
.auth-container {
  width: 100%;
  max-width: 450px;
}
</style>

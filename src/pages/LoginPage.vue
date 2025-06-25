<template>
  <q-page class="row justify-center items-center">
    <AuthForm />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
//import LoginForm from 'components/auth/LoginForm.vue'
//import RegisterForm from 'components/auth/RegisterForm.vue'
import AuthForm from 'components/auth/AuthForm.vue'
//import LoginUi from 'components/auth/LoginUi.vue'

</script>

<style>
.auth-container {
  width: 100%;
  max-width: 450px;
}
</style>

<template>
<div class="login mx-auto p-5">
  <div class="card is-medium">
    <footer class="card-footer mb-5">
      <a href="#" class="card-footer-item" @click ="handleOptionChange('login')">Login</a>
      <a href="#" class="card-footer-item" @click ="handleOptionChange('register')">Register</a>
    </footer>
  </div>
  <LoginForm v-if="loginOrRegister == 'login'" />
  <RegisterForm v-else  />
</div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import {ref} from 'vue';
const loginOrRegister = ref('login');

const handleOptionChange = (value) =>{
  console.log(value)
  if(value === 'login') loginOrRegister.value = 'login';
  else loginOrRegister.value = 'register';
}
</script>

<style>
.login{
  max-width: 600px;
}
</style>
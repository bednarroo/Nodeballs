<template>

<div class="card">
  <footer class="card-footer">
    <a href="#" class="card-footer-item" @click ="handleOptionChange('login')">Login</a>
    <a href="#" class="card-footer-item" @click ="handleOptionChange('register')">Register</a>
  </footer>
</div>
  <LoginForm v-if="loginOrRegister == 'login'" />
  <RegisterForm v-else  />
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

</style>
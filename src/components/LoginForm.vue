<template>
  

<form @submit.prevent="login()">

  <div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input " type="email" placeholder="Email input" v-model="loginValue.email">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>
  <p class="help"></p>
</div>
<div class="field">
  <label class="label">Password</label>
  <div class="control">
    <input class="input" type="password" placeholder="Text input" v-model="loginValue.password">
  </div>
</div>
<div class="field is-grouped">
  <div class="control mx-auto">
    <button class="button is-link ">Login</button>
  </div>
</div>


</form>

</template>

<script setup>
import {reactive} from "vue";
import { useAuthStore } from "../stores/auth";


const storeAuth = useAuthStore();

const loginValue = reactive({
  email: "",
  password: "",
})

const login = () => {
if (loginValue.email && loginValue.password){
  storeAuth.loginUser(loginValue);
} else{
  console.log("XD")
}
}
</script>

<style>

</style>
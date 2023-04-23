<template>
  

<form action="" @submit.prevent="register()">
  <div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input " type="email" placeholder="Email input" v-model="registerValue.email">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Password</label>
  <div class="control">
    <input class="input" type="password" v-model="registerValue.password" placeholder="Text input">
  </div>
</div>


<div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" v-model="registerValue.checkbox">
      I agree to the <a href="#">terms and conditions</a>
    </label>
  </div>
</div>



<div class="field is-grouped">
  <div class="control mx-auto">
    <button class="button is-link">Register</button>
  </div>
</div>


</form>

</template>

<script setup>
import {reactive} from "vue";
import { useAuthStore } from "../stores/auth";


const storeAuth = useAuthStore();

const registerValue = reactive({
  email: "",
  password: "",
  checkbox: false
})

const register = () => {
if (registerValue.email && registerValue.email && registerValue.checkbox ){
  storeAuth.registerUser(registerValue);
} else{
  console.log("XD")
  console.log(registerValue)
}
}
</script>

<style>

</style>
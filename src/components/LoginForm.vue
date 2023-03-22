<template>
  



<div class="field">
  <label class="label">Email</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input is-danger" type="email" placeholder="Email input" value="">
    <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
    <span class="icon is-small is-right">
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>
  <p class="help is-danger">This email is invalid</p>
</div>
<div class="field">
  <label class="label">Password</label>
  <div class="control">
    <input class="input" type="password" placeholder="Text input">
  </div>
</div>
<div class="field is-grouped">
  <div class="control">
    <button class="button is-link">Login</button>
  </div>
</div>
</template>

<script setup>
</script>

<style>

</style>
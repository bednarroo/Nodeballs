<template >
    <form class="is-flex is-flex-direction-column m-5 p-3">
    <div class="field">
  <label class="label">Title</label>
  <div class="control">
    <input class="input" type="text" placeholder="Put your title here!">
  </div>
</div>

<div class="field">
  <label class="label">Priority</label>
  <div class="control">
    <div class="select">
      <select>
        <option>Select dropdown</option>
        <option>High Priority</option>
        <option>Medium Priority</option>
        <option>Low Priority</option>
      </select>
    </div>
  </div>
</div>

<div class="field">
  <label class="label">Message</label>
  <div class="control">
    <textarea class="textarea" placeholder="Textarea"></textarea>
  </div>
</div>

<div class="field is-grouped is-justify-content-center	">
  <div class="control">
    <button class="button is-link">Add new note!</button>
  </div>
  <div class="control">
    <button class="button is-link is-light">Clean everything</button>
  </div>
</div>
</form>
    </template>
    
    <script setup>
    </script>
    
    <style>
    
    </style>
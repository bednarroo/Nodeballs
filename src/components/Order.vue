<template>
  <div class="field">
  <label class="label">Order by:</label>
  <div class="control">
    <div class="select">
      <select v-model="order">
        <option value="title">Title</option>
        <option value="priority">Priority</option>
        <option value="date">Date</option>
      </select>
    </div>
  </div>
</div>
</template>

<script setup>

import {ref} from "vue";
import { watch } from 'vue';
import {useNotesStore} from '@/stores/notes.js';


const order = ref("title");
const notes = useNotesStore();

// watcher to sort Card based on order value

watch (
  () => order.value,
  () => {
    notes.sortNote(order.value)
  }
)

</script>

<style>

</style>
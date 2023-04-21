<template >
    <form class="is-flex is-flex-direction-column m-5 p-3" @submit.prevent="addNewNotes(form)">
    <div class="field">
  <label class="label">Title</label>
  <div class="control">
    <input class="input" required type="text" placeholder="Put your title here!" v-model="form.title">
  </div>
</div>

<div class="field">
  <label class="label">Priority</label>
  <div class="control">
    <div class="select">
      <select required v-model="form.priority">
        <option value="">Select dropdown</option>
        <option value="3">High Priority</option>
        <option value="2">Medium Priority</option>
        <option value="1">Low Priority</option>
      </select>
    </div>
  </div>
</div>

<div class="field">
  <label class="label">Description</label>
  <div class="control">
    <textarea class="textarea" placeholder="Textarea" required v-model="form.description"></textarea>
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
    import {useNotesStore } from '@/stores/notes.js';
    import {reactive} from 'vue';

    const notes = useNotesStore();
    const form = reactive({
        title: "",
        priority: "",
        description: ""
    });
    const cleanElement = () =>{
        form.title = "",
        form.description= "",
        form.priority = ""
        }

    const addNewNotes = (form) =>{
        notes.addNote({...form});
        cleanElement();
    }

 
    </script>
    
    <style>
    
    </style>
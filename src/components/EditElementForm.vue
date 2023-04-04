<template >
    <form class="is-flex is-flex-direction-column m-5 p-3" @submit.prevent="EditNote()">
    <div class="field">
  <label class="label">Title</label>
  <div class="control">
    <input class="input" required type="text" placeholder="Put your title here!" v-model=editedValues.title>
  </div>
</div>

<div class="field">
  <label class="label">Priority</label>
  <div class="control">
    <div class="select">
      <select required v-model="editedValues.priority" >
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
    <textarea class="textarea" placeholder="Textarea" required v-model="editedValues.description "></textarea>
  </div>
</div>

<div class="field is-grouped is-justify-content-center	">
  <div class="control">
    <button  class="button is-link">Edit this note!</button>
  </div>
</div>
</form>
    </template>
    
    <script setup>
    // Imports
    import { useRouter } from 'vue-router'
    import {useNotesStore } from '@/stores/notes.js';
    import {reactive} from 'vue';
    const props = defineProps({
      id: {type: Number, required: true}
    });
    // Use Vue Router
    const router = useRouter()
    // Use Pinia Store
    const notes = useNotesStore();
    const editedValues = reactive({...notes.getItemById(parseInt(props.id,10))})

    // EditNote function 

    const EditNote = () => {
      notes.editNote(editedValues,props.id);
      router.push({path: "/"});
    }


    </script>
    
    <style>
    
    </style>
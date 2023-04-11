<template >
    <div class="is-flex is-flex-direction-column m-5 p-3" >
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


<footer class="is-flex is-justify-content-space-evenly"  >
      <button type="submit" @click="editNote(id)" class="button is-info is-selected w-40">Edit this note</button>
  <button type="submit" class="button is-danger is-selected w-40" @click="deleteElement(id)" >Delete this note</button>
  </footer>



<div class="field is-grouped is-justify-content-center	">
  <div class="control">
    <router-link :to = "`/`">
    <button type="button"  class="button is-link">Show all notes</button>
  </router-link>
  </div>
</div>
</div>
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
    const editNote = (id) => {
      notes.editNote(editedValues, Number(id));
      router.push({path: "/"});
    }

    // Delete note
    const deleteElement = (id) => {
      notes.deleteNote(Number(id));
      router.push({path: "/"});
    }

    </script>
    
    <style>
    
    </style>
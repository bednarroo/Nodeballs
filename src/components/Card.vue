<template  >
  <div class="card card column is-one-third m-5">
  <div class="card-content">
    <p class="title">
{{props.title}}    </p>
    <p class="subtitle">
      {{ props.date }}
      {{ props.description }}
    </p>
  </div>
  <div class="card-footer">
    <a href="">
        <div class="card-footer-item">
        <a href="/edit/{{props.id}}">
            <span>Edit {{props.id}}</span>
        </a>
    </div>
    </a>
    <p class="card-footer-item">
      <button @click="deleteElement(id)">  Delete
      </button>
    </p>
    {{props.priority}}
    
</div>
</div>
</template>

<script setup>
  import {useNotesStore} from '@/stores/notes.js';

const notes = useNotesStore();

const props = defineProps({
    title:{type: String},
    description: {type: String},
    date:{type: Date},
    id:{type: Number},
    priority:{type: Number},
})

const deleteElement = (id) => {
notes.deleteNote(id)
}

</script>

<style>

</style>
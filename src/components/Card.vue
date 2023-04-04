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
    <router-link to="">
        <div class="card-footer-item">
        <router-link :to = "`/edit/${props.id}`">
            <span>Edit {{props.id}}</span>
        </router-link>
    </div>
    </router-link>
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
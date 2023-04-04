<template  >
  <div class="card card column is-one-third m-5">
  <div class="card-content">
    <p class="title">
{{props.title}}    </p>
    <p class="subtitle">
      {{ props.description }}
    </p>
    <p class="subtitle">
      {{ noteData  }}
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
    
</div>
</div>
</template>

<script setup>
  import {useNotesStore} from '@/stores/notes.js';
  import moment from 'moment';
  import {computed, ref} from 'vue'

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
// Computed data. Use correct format with extternal library
const noteData = computed(()=>moment(props.date).format('MMMM d,YYYY'));


</script>

<style>

</style>
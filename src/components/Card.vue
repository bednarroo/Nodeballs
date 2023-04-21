<template  >
  <div class="card column m-5 priority pt-0" :class="priorityClass">
  <div class="card-content py-5 px-3	">
    <p class="is-size-4 has-text-centered has-text-weight-semibold		">
{{props.title}}    </p>
    <p class="is-size-5">
      {{ props.description }}
    </p>
    <p class="is-size-6 has-text-right	">
      {{ noteData  }}
    </p>
  </div>

  <footer class="is-flex is-justify-content-center footer"  >
    <router-link :to = "`/edit/${props.id}`">
      <button class="button is-info is-selected w-35">Edit this note</button>
    </router-link>
  <button class="button is-danger is-selected w-35"
  @click="handlePopUp()"
   >
    Delete this note
  </button>
  </footer>

</div>
</template>

<script setup>
  // import moment from 'moment';
  import {computed, defineEmits} from 'vue';

const emit = defineEmits(['showPopUp']);

const handlePopUp = () => {
  emit('showPopUp', [{"id": props.id,"title": props.title}]);
}


const props = defineProps({
    title:{type: String},
    description: {type: String},
    date:{type: Object},
    id:{type: String},
    priority:{type: String},
    isPopUpOpened:{type:Boolean}
})


// Computed data. Use correct format with extternal library
// const noteData = computed(()=>moment(props.date).format('MMMM d,YYYY'));
const priorityClass = computed(() => {
  if (props.priority == 1) {
    return "low-priority";
  } else if (props.priority == 2) {
    return "medium-priority";
  } else {
    return "high-priority";
  }
});


</script>

<style>
.card{
  min-width: 400px
}

.priority{
  border-radius: 20px;
}

.high-priority{
  border: 2px solid red;
}
.medium-priority{
  border: 2px solid blue;
}
.low-priority{
  border: 2px solid green;
  
}

.footer{
  padding: 0
}
.footer > * {
    margin: 0 10px;
}


</style>
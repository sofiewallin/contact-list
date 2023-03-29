<script setup>
import { computed } from 'vue';

const props = defineProps({
  itemCount: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 20
  },
  currentPage: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['changePage']);

const pageCount = computed(() => {
  return Math.ceil(props.itemCount / props.itemsPerPage);
});
</script>

<template>
  <nav class="pagination">
    <button 
      @click="$emit('changePage', 1)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === 1"
    >
      <span class="visually-hidden">First page</span>
      <span aria-hidden="true">«</span>
    </button>
    <button 
      @click="$emit('changePage', currentPage - 1)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === 1"
    >
      <span class="visually-hidden">Previous page</span>
      <span aria-hidden="true">‹</span>
    </button>
    <span class="pagination__paging-text">
      <span class="visually-hidden">Current page </span>{{ currentPage }} of {{ pageCount }}
    </span>
    <button 
      @click="$emit('changePage', currentPage + 1)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === pageCount"
    >
      <span class="visually-hidden">Next page</span>
      <span aria-hidden="true">»</span>
    </button>
    <button 
      @click="$emit('changePage', pageCount)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === pageCount"
    >
      <span class="visually-hidden">Last page</span>
      <span aria-hidden="true">»</span>
    </button>
  </nav>
</template>

<style scoped>
</style>

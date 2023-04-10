<script setup>
import { ref, computed } from 'vue';

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
  if (props.itemCount > 0) {  
    return Math.ceil(props.itemCount / props.itemsPerPage);
  } else {
    return 1;
  }
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
      <span class="hidden-visually">First page</span>
      <span aria-hidden="true">&laquo;</span>
    </button>
    <button 
      @click="$emit('changePage', currentPage - 1)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === 1"
    >
      <span class="hidden-visually">Previous page</span>
      <span aria-hidden="true">&lsaquo;</span>
    </button>
    <span class="pagination__paging-text">
      <span class="hidden-visually">Current page </span>{{ currentPage }} of {{ pageCount }}
    </span>
    <button 
      @click="$emit('changePage', currentPage + 1)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === pageCount"
    >
      <span class="hidden-visually">Next page</span>
      <span aria-hidden="true">&rsaquo;</span>
    </button>
    <button 
      @click="$emit('changePage', pageCount)"
      type="button"
      class="pagination__button"
      :disabled="currentPage === pageCount"
    >
      <span class="hidden-visually">Last page</span>
      <span aria-hidden="true">&raquo;</span>
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: inline-block;
}

.pagination__button {
  background-color: var(--white);
  border: 1px solid var(--blue);
  border-radius: 4px;
  color: var(--blue);
  font-size: 18px;
  font-weight: 600;
  height: 40px;
  margin-right: 8px;
  transition: all 0.3s ease-in-out;
  width: 40px;
}

.pagination__button:hover {
  background-color: var(--light-blue);

}

.pagination__button:disabled {
  background-color: var(--light-gray);
  border-color: var(--gray);
  color: var(--gray);
}

.pagination__button:last-child {
  margin-right: 0;
}

.pagination__paging-text {
  margin: 0 16px 0 12px;
}
</style>

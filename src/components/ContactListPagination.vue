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
  return Math.ceil(props.itemCount / props.itemsPerPage);
});

const pages = computed(() => {
  return Array.from({ length: pageCount.value }, (_, i) => i + 1);
});

</script>

<template>
  <nav class="pagination">
    <button
      type="button" 
      :class="[
        'button',
        { isActive: page === currentPage }
      ]"
      v-for="page in pages"
      :key="page"
      @click="$emit('changePage', page)"
    >
      {{ page }}
    </button>
  </nav>
</template>

<style scoped>
</style>

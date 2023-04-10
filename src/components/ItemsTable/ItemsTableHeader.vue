<script setup>
const props = defineProps({
  header: {
    type: Object,
    required: true
  },
  sortedColumn: {
    type: String,
    required: true
  },
  sortingOrder: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['sortColumn']);

</script>

<template>
  <th
    v-if="props.header.isSortable && props.header.label === sortedColumn" :aria-sort="sortingOrder"
    :colspan="props.header.colspan"
    class="items__header items__header--sortable"
  >
    <button 
      type="button"
      @click="$emit('sortColumn', props.header.label)"
      class="items__sort-button"
    >
      {{ props.header.text }}
      <span class="items__sort-order-indicator" aria-hidden="true"></span>
    </button>
  </th>
  <th
    v-else-if="props.header.isSortable && props.header.label !== sortedColumn"
    :colspan="props.header.colspan"
    class="items__header items__header--sortable"
  >
    <button 
      type="button"
      @click="$emit('sortColumn', props.header.label)"
      class="items__sort-button"
    >
      {{ props.header.text }}
      <span class="items__sort-order-indicator" aria-hidden="true"></span>
    </button>
  </th>
  <th
    v-else
    :colspan="props.header.colspan"
    class="items__header"
  >
    {{ props.header.text }}
  </th>
</template>

<style scoped>
.items__header {
  font-size: 0.875rem;
  line-height: 1.429;
  padding: 16px 8px;
  vertical-align: middle;
}

.items__header:first-child {
  padding-left: 16px;
}

.items__header:last-child {
  padding-right: 16px;
}

.items__header {
  font-weight: 700;
  height: 3.429em;
  padding: 0 8px;
}

.items__header--sortable,
.items__header--sortable:first-child,
.items__header--sortable:last-child {
  padding: 0;
}

.items__header--sortable:first-child {
  padding-left: 1px;
}

.items__header--sortable:last-child {
  padding-right: 1px;
}

.items__sort-button {
  color: var(--blue);
  display: block;
  height: 3.429em;
  line-height: 3.429;
  padding: 0 8px;
  position: relative;
  text-align: left;
  width: 100%;
}
.items__sort-order-indicator {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  display: inline-block;
  height: 0; 
  margin-left: 4px;
  width: 0;
}

.items__header--sortable[aria-sort="ascending"] .items__sort-order-indicator {
  border-bottom: 8px solid var(--text-color);
}

.items__header--sortable[aria-sort="ascending"] .items__sort-button:hover .items__sort-order-indicator {
  border-bottom: none;
  border-top: 8px solid var(--text-color);
}

.items__header--sortable[aria-sort="descending"] .items__sort-order-indicator {
  border-top: 8px solid var(--text-color);
}

.items__sort-button:hover .items__sort-order-indicator,
.items__header--sortable[aria-sort="descending"] .items__sort-button:hover .items__sort-order-indicator {
  border-top: none;
  border-bottom: 8px solid var(--text-color);
}

.items__header--sortable:first-child .items__sort-button {
  padding-left: 16px;
}

.items__header--sortable:last-child .items__sort-button {
  padding-right: 16px;
}

@media only screen and (min-width:960px) {
  .items__header {
    font-size: 1rem;
    height: 3.5em;
    line-height: 1.5;
  }
}
</style>

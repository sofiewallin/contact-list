<script setup>
import { ref, reactive, computed, watch } from 'vue';
import objectService from '../../services/objectService.js';
import arrayService from '../../services/arrayService.js';

import ItemsTableHeader from './ItemsTableHeader.vue';
import BasePagination from '../BasePagination.vue';

const props = defineProps({
  api: {
    type: Object, 
    required: true
  },
  item: {
    type: Object,
    required: true
  },
  pagination: {
    type: Object,
    default: undefined
  }
});

const api = reactive(props.api);

const itemTitle = ref(props.item.title);
const itemIdentifier = reactive(props.item.identifier);
const itemProperties = ref(props.item.properties);

let sortedColumn = ref('');
let sortingOrder = ref('ascending');

const pagination = reactive(props.pagination);
const currentPage = ref(1);

let itemsInput = ref([]);
let isItemsInputLoaded = ref(false);

let error = ref(null);

/*------ Get input for items from API ------*/

const getItemsInput = async () => {
  try {
    const response = await fetch(`${api.endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
        
    const input = await response.json();
        
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const rootObject = objectService.resolvePath(api.rootObject, input);

    if (rootObject) {
      itemsInput.value = rootObject;
    } else {
      itemsInput.value = input;
    }
 
    error.value = null;
  } catch (err) {
    error.value = `Something went wrong getting the ${itemTitle.value.toLowerCase()}s. Try reloading the page and try again.`;
    console.log(err);
  } finally {
    isItemsInputLoaded.value = true;
  }
}
getItemsInput();

/*------ Check if there is a valid item identifier ------*/

const hasValidItemIdentifier = () => {
  let isValidPath = false;
  let values = [];

  if (!itemIdentifier) {
    return false;
  }

  values = itemsInput.value.map(item => {
    let value = objectService.resolvePath(itemIdentifier.path, item);

    if (value) {
      isValidPath = true;

      return value;
    }
  });

  let hasDuplicateValues = arrayService.hasDuplicateValues(values);

  if (!isValidPath || hasDuplicateValues) {
    return false;
  }

  return true;
}

/*------ Set items ------*/

const getValueFromPaths = (propertyValues, itemInput) => {
  let value = '';

  propertyValues.forEach(propertyValue => {
    let valueFromPath = objectService.resolvePath(propertyValue.path, itemInput);
    let connector = propertyValue.connector;

    value += valueFromPath + connector;
  })

  return value;
}

const items = computed(() => {
  try {
    if(!hasValidItemIdentifier()) {
      throw new Error('There is no valid item identifier.');
    }
  } catch (err) {
    error.value = `Something went wrong. The list of ${itemTitle.value.toLowerCase()}s couldn't be rendered.`;
    console.log(err);
  }

  let list = [];

  itemsInput.value.forEach(itemInput => {
    let item = {}

    let identifierProperty = {
      value: objectService.resolvePath(itemIdentifier.path, itemInput),
      isIdentifier: true,
      image: undefined,
      width: undefined
    }

    item[itemIdentifier.label] = identifierProperty;

    itemProperties.value.forEach((itemProperty, index, array) => {
      let property = {
        value: '',
        isIdentifier: false,
        image: undefined,
        width: itemProperty.width
      }

      property.value = getValueFromPaths(itemProperty.values, itemInput);

      if (itemProperty.image) {
        let altText = '';

        if (itemProperty.image.altFromProperty) {
          let matchingProperty = array.find(element => {
            return element.label === itemProperty.image.altFromProperty;
          });

          altText = getValueFromPaths(matchingProperty.values, itemInput);
        }

        if (itemProperty.image.altFromPath) {
          altText = objectService.resolvePath(itemProperty.image.altFromPath, itemInput);
        }

        property.image = {
          altText: altText
        }
      }

      item[itemProperty.label] = property;
    });

    list.push(item);
  });

  if (sortedColumn.value !== '') {
    if (sortingOrder.value === 'ascending') {
      list = arrayService.sortAscending(list, sortedColumn.value, 'value');
    } 
    
    if (sortingOrder.value === 'descending') {
      list = arrayService.sortDescending(list, sortedColumn.value, 'value');
    }
  }

  if (pagination) {
    const start = (currentPage.value - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;

    list = list.slice(start, end);
  }

  console.log(list);

  return list;
});

/*------ Set item property headers ------*/

const propertyHeaders = computed(() => {
  let headers = [];
  let storedColspan = 0;

  itemProperties.value.forEach(itemProperty => {
    let header = {
      label: itemProperty.label,
      text: itemProperty.header.text,
      colspan: 1,
      isSortable: false
    }

    if (itemProperty.sorting) {
      header.isSortable = true;
    }

    if (itemProperty.header.spanNext) {
      storedColspan++;
    } else {
      header.colspan = header.colspan + storedColspan;
      storedColspan = 0;

      headers.push(header);
    }
  });

  return headers;
});

/*------ Sort items ------*/

const setInitialSorting = () => {
  itemProperties.value.forEach(itemProperty => {
    if (
      itemProperty.sorting &&
      itemProperty.sorting.isInitiallySorted
    ) {
      sortedColumn.value = itemProperty.label;
      sortingOrder.value = itemProperty.sorting.initialOrder;
    }
  });
}
setInitialSorting();

const sortColumn = column => {
  if (sortedColumn.value === column) {
    if (sortingOrder.value === 'ascending') {
      sortingOrder.value = 'descending';
    } else {
      sortingOrder.value = 'ascending';
    }
  } else {
    let currentSortingProperty = itemProperties.value.find(itemProperty => itemProperty.label === column);

    sortingOrder.value = currentSortingProperty.sorting.initialOrder;
  }

  sortedColumn.value = column;
}

/*------ Paginate items ------*/

const changePage = pageNumber => {
  currentPage.value = pageNumber;
}

watch([sortedColumn, sortingOrder], () => {
  currentPage.value = 1;
});

watch(currentPage, () => {
  window.scrollTo({
      top: 0,
  });
});

</script>

<template>
  <div v-if="!isItemsInputLoaded">
    <p>Loading ...</p>
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>
  </div>
  <div v-else class="items">
    <div class="horizontal-scroll">
      <table class="items__table">
        <thead>
          <tr class="items__head">
              <ItemsTableHeader 
                v-for="propertyHeader in propertyHeaders"
                :header="propertyHeader"
                :sortedColumn="sortedColumn"
                :sortingOrder="sortingOrder"
                @sortColumn="sortColumn"
              />
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0" class="items__no-items">
            <td :colspan="itemProperties.length" class="items__item-property">
              {{ `There are no ${itemTitle.toLowerCase()}s to show.` }}
            </td>
          </tr>
          <tr
            v-else
            v-for="item in items"
            :key="objectService.getFirstProperty(item).value"
            class="items__item"
          >
            <template v-for="property in item">
              <template v-if="!property.isIdentifier">
                <td 
                  v-if="property.image"
                  class="items__item-property items__item-property--image"
                  :class="`items__item-property--${property.width}`"
                >
                  <figure class="items__image">
                    <img :src="property.value" :alt="property.image.altText">
                  </figure>
                </td>
                <td
                  v-else
                  class="items__item-property"
                  :class="`items__item-property--${property.width}`"
                >
                  {{ property.value }}
                </td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="items__controls">
      <span class="items__total-count">
        {{ `${itemsInput.length} ${itemTitle.toLowerCase()}s` }}
      </span>
      <BasePagination v-if="pagination"
        :itemCount="itemsInput.length"
        :itemsPerPage="pagination.itemsPerPage"
        :currentPage="currentPage"
        @changePage="changePage"
      />
    </div>
  </div>
</template>

<style scoped>
.items__table {
  border: 1px solid var(--gray);
  margin-top: 8px;
}

.items__head {
  background-color: var(--white);
  border-bottom: 1px solid var(--gray);
}

.items__item {
  background-color: var(--white);
}

.items__item:nth-child(odd),
.items__no-items {
  background-color: var(--light-gray);
}

.items__item-property {
  font-size: 0.875rem;
  line-height: 1.429;
  padding: 16px 8px;
  vertical-align: middle;
}

.items__item-property:first-child {
  padding-left: 16px;
}

.items__item-property:last-child {
  padding-right: 16px;
}

.items__item-property--small {
  min-width: 72px;
}

.items__item-property--medium {
  min-width: 128px;
}

.items__item-property--large {
  min-width: 256px;
}

.items__item-property--x-large {
  min-width: 320px;
}

.items__item-property--image {
  padding: 16px 0;
}

.items__item-property--image:first-child,
.items__item-property--image:last-child {
  padding: 16px 8px 16px 0;
}

.items__image {
  border-radius: 20px;
  height: 0;
  overflow: hidden;
  width: 0;
}

.items__controls {
  padding: 16px 0 24px;
  text-align: left;
}

.items__total-count {
  display: inline-block;
  height: 2.5em;
  line-height: 2.5em;
  margin: 0 24px 8px 0;
}

@media only screen and (min-width:768px) {
  .items__item-property--image {
    padding: 16px 8px;
  }

  .items__item-property--image:first-child {
    padding: 16px 8px 16px 16px;
  }
  .items__item-property--image:last-child {
    padding: 16px 16px 16px 8px;
  }

  .items__image {
    height: 40px;
    width: 40px;
  }

  .items__controls {
    padding: 24px 0 48px;
    text-align: right;
  }
}

@media only screen and (min-width:960px) {
  .items__table {
    margin-top: 16px;
  }

  .items__item-property {
    font-size: 1rem;
    line-height: 1.5;
  }
}
</style>

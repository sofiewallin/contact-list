<script setup>
import { ref, computed, watch } from 'vue';
import BasePagination from './BasePagination.vue';

const props = defineProps({
  apiUrl: {
    type: String, 
    required: true
  },
  isPaginated: {
    type: Boolean,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: false
  }
});

/* Getting contact list from API */
let contactList = ref([]);
let isLoaded = ref(false);
let error = ref(null);

const getContactList = async () => {
  try {
    const response = await fetch(`${props.apiUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
        
    const result = await response.json();
        
    if (!response.ok) {
      throw new Error(response.statusText);
    }
 
    contactList.value = result.results;
    error.value = null;
    
  } catch {
    error.value = 'Something went wrong when getting the list of contacts. Try reloading the page and try again.';
    isLoaded.value = true;
  } finally {
    isLoaded.value = true;
  }
}
getContactList();

/* Sort contact list by title */
let sortingOrder = ref('ascending');
let isSortedBy = ref('name');

let sortedContactList = computed(() => {
  let sortedContactList = [];

  sortedContactList = contactList.value.map(contact => {
    let newContact = {
      id: contact.login.uuid,
      name: `${contact.name.first} ${contact.name.last}`,
      age: contact.dob.age,
      email: contact.email,
      phone: contact.phone,
      image: contact.picture.large
    }
    return newContact;
  });
  
  if (isSortedBy.value === 'name') {
    sortedContactList = sortedContactList.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }

  if (isSortedBy.value === 'age') {
    sortedContactList = sortedContactList.sort((a, b) => {
        return a.age - b.age;
    })
  }

  if (sortingOrder.value === 'descending') {
    sortedContactList = sortedContactList.reverse();
  }

  return sortedContactList;
});

const sortContactList = column => {
  if (isSortedBy.value !== column) {
    sortingOrder.value = 'ascending';
  } else {
    if (sortingOrder.value === 'ascending') {
      sortingOrder.value = 'descending'
    } else {
      sortingOrder.value = 'ascending'
    }
  }

  isSortedBy.value = column;

}

/* Paginate contact list */
const currentPage = ref(1);

const paginatedContactList = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;

  if (props.isPaginated) {
    return sortedContactList.value.slice(start, end);
  } else {
    return sortedContactList.value;
  }
});

const changePage = pageNumber => {
  currentPage.value = pageNumber;
}

watch([sortingOrder, isSortedBy], () => {
  currentPage.value = 1;
});

watch(currentPage, () => {
  window.scrollTo({
      top: 0,
  });
});

</script>

<template>
  <div v-if="!isLoaded">
    <p>Loading ...</p>
  </div>
  <div v-else class="contact-list">
    <div class="horizontal-scroll">
      <table class="contact-list__table">
        <thead>
          <tr class="contact-list__header">
            <th
              colspan="2"
              :aria-sort="[isSortedBy === 'name' ? sortingOrder : null]"
              class="contact-list__th contact-list__th--sortable"
            >
              <button
                type="button"
                @click="sortContactList('name')"
                class="contact-list__sort-button"
              >
                Name
                <span class="contact-list__sort-order-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th
              :aria-sort="[isSortedBy === 'age' ? sortingOrder : null]"
              class="contact-list__th contact-list__th--sortable">
              <button
                type="button"
                @click="sortContactList('age')"
                class="contact-list__sort-button"
              >
                Age
                <span class="contact-list__sort-order-indicator" aria-hidden="true"></span>
              </button>
            </th>
            <th class="contact-list__th">Email</th>
            <th class="contact-list__th">Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="error" class="contact-list__error">
            <td colspan="5" class="contact-list__td">{{ error }}</td>
          </tr>
          <tr v-else-if="contactList.length === 0" class="contact-list__empty-list">
            <td colspan="5" class="contact-list__td">No contacts have been added.</td>
          </tr>
          <tr v-else v-for="contact in paginatedContactList" :key="contact.id" class="contact-list__item">
            <td class="contact-list__td contact-list__td--image">
              <figure class="contact-list__image">
                <img :src="contact.image" :alt="`Portrait of ${contact.name}`">
              </figure>
            </td>
            <td class="contact-list__td contact-list__td--name">{{ contact.name }}</td>
            <td class="contact-list__td">{{ contact.age }}</td>
            <td class="contact-list__td">{{ contact.email }}</td>
            <td class="contact-list__td">{{ contact.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="contact-list__controls">
      <span class="contact-list__display-count">{{ contactList.length }} contacts</span>
      <BasePagination v-if="props.isPaginated"
        :itemCount="contactList.length"
        :itemsPerPage="props.itemsPerPage"
        :currentPage="currentPage"
        @changePage="changePage"
      />
    </div>
  </div>
</template>

<style scoped>
.contact-list__table {
  border: 1px solid var(--gray);
  margin-top: 8px;
  width: 170%;
}

.contact-list__header {
  background-color: var(--white);
  border-bottom: 1px solid var(--gray);
}

.contact-list__th,
.contact-list__td {
  font-size: 0.875rem;
  line-height: 1.429;
  padding: 16px 8px;
  vertical-align: middle;
}

.contact-list__th:first-child,
.contact-list__td:first-child {
  padding-left: 16px;
}

.contact-list__th:last-child,
.contact-list__td:last-child {
  padding-right: 16px;
}

.contact-list__th {
  font-weight: 700;
  line-height: 3.429;
  padding: 0 8px;
}

.contact-list__th--sortable,
.contact-list__th--sortable:first-child,
.contact-list__th--sortable:last-child {
  padding: 0;
}

.contact-list__th--sortable:first-child {
  padding-left: 1px;
}

.contact-list__th--sortable:last-child {
  padding-right: 1px;
}

.contact-list__sort-button {
  color: var(--blue);
  display: block;
  height: 3.429em;
  line-height: 3.429;
  padding: 0 8px;
  position: relative;
  text-align: left;
  width: 100%;
}
.contact-list__sort-order-indicator {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  display: inline-block;
  height: 0; 
  margin-left: 4px;
  width: 0;
}

.contact-list__th--sortable[aria-sort="ascending"] .contact-list__sort-order-indicator {
  border-bottom: 8px solid var(--text-color);
}

.contact-list__th--sortable[aria-sort="ascending"] .contact-list__sort-button:hover .contact-list__sort-order-indicator {
  border-bottom: none;
  border-top: 8px solid var(--text-color);
}

.contact-list__th--sortable[aria-sort="descending"] .contact-list__sort-order-indicator {
  border-top: 8px solid var(--text-color);
}

.contact-list__sort-button:hover .contact-list__sort-order-indicator,
.contact-list__th--sortable[aria-sort="descending"] .contact-list__sort-button:hover .contact-list__sort-order-indicator {
  border-top: none;
  border-bottom: 8px solid var(--text-color);
}

.contact-list__th--sortable:first-child .contact-list__sort-button {
  padding-left: 16px;
}

.contact-list__th--sortable:last-child .contact-list__sort-button {
  padding-right: 16px;
}

.contact-list__item {
  background-color: var(--white);
}

.contact-list__item:nth-child(odd),
.contact-list__empty-list,
.contact-list__error {
  background-color: var(--light-gray);
}

.contact-list__td--image {
  padding: 0;
  width: 0;
}

.contact-list__image {
  border-radius: 20px;
  height: 0;
  overflow: hidden;
  width: 0;
}

.contact-list__td--name {
  font-weight: 500;
  padding-left: 0;
}

.contact-list__controls {
  padding: 16px 0 24px;
  text-align: left;
}

.contact-list__display-count {
  display: inline-block;
  height: 2.5em;
  line-height: 2.5em;
  margin: 0 24px 8px 0;
}

@media only screen and (min-width:480px) {
  .contact-list__table {
    width: 130%;
  }
}

@media only screen and (min-width:667px) {
  .contact-list__table {
    width: 100%;
  }
}

@media only screen and (min-width:768px) {
  .contact-list__table {
    border-spacing: 0 16px;
  }
  .contact-list__td--image {
    padding: 16px 8px 16px 16px;
    width: 56px;
  }

  .contact-list__image {
    height: 40px;
    width: 40px;
  }

  .contact-list__td--name {
    padding-left: 8px;
  }

  .contact-list__controls {
    padding: 24px 0 48px;
    text-align: right;
  }
}

@media only screen and (min-width:960px) {
  .contact-list__table {
    margin-top: 16px;
  }

  .contact-list__th,
  .contact-list__td {
    font-size: 1rem;
    line-height: 1.5;
  }
}
</style>

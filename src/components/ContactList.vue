<script setup>
import { ref, computed, watch } from 'vue';
import BasePagination from './BasePagination.vue';

const props = defineProps({
  apiUrl: {
    type: String, 
    required: true
  }
});

/* Getting contact list from API */
let contactList = ref([]);
let isLoaded = ref(false);
let error = ref(null);

const getContactList = async () => {
  try {
    const response = await fetch(`${props.apiUrl}?results=107&nat=gb`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
        
    const people = await response.json();
        
    if (!response.ok) {
      throw new Error(response.statusText);
    }
 
    contactList.value = people.results;
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
const itemsPerPage = ref(10);

const paginatedContactList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  return sortedContactList.value.slice(start, end);
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
  <table v-else>
    <caption>A list of contacts fetched from the <a href="https://randomuser.me/">Random user generator</a>.</caption>
    <thead>
      <tr>
        <th
          colspan="2"
          :aria-sort="[isSortedBy === 'name' ? sortingOrder : null]"
          class="contact-list__heading contact-list__heading--sortable"
        >
          <button
            type="button"
            @click="sortContactList('name')"
            class="sort-button"
          >
            Name
            <div class="sort-button__order-indicator"></div>
          </button>
        </th>
        <th
          :aria-sort="[isSortedBy === 'age' ? sortingOrder : null]"
          class="contact-list__heading contact-list__heading--sortable">
          <button
            type="button"
            @click="sortContactList('age')"
            class="sort-button"
          >
            Age
            <div class="sort-button__order-indicator"></div>
          </button>
        </th>
        <th class="contact-list__heading">Email</th>
        <th class="contact-list__heading">Phone</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="error">
        <td colspan="5">{{ error }}</td>
      </tr>
      <tr v-else-if="contactList.length === 0">
        <td colspan="5">No contacts have been added.</td>
      </tr>
      <tr v-else v-for="contact in paginatedContactList" :key="contact.id">
        <td><img :src="contact.image" :alt="`Portrait of ${contact.name}`"></td>
        <td>{{ contact.name }}</td>
        <td>{{ contact.age }}</td>
        <td>{{ contact.email }}</td>
        <td>{{ contact.phone }}</td>
      </tr>
    </tbody>
  </table>
  <span class="display-count">{{ contactList.length }} contacts</span>
  <BasePagination 
    :itemCount="contactList.length"
    :itemsPerPage="itemsPerPage"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<style scoped>
</style>

<script setup>
import { ref, computed, watch } from 'vue';
import ContactListPagination from './ContactListPagination.vue';

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
let isSortedAsc = ref(true);
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

  if (!isSortedAsc.value) {
    sortedContactList = sortedContactList.reverse();
  }

  return sortedContactList;
});

const sortContactList = column => {
  if (isSortedBy.value !== column) {
    isSortedAsc.value = true;
  } else {
    isSortedAsc.value = !isSortedAsc.value;
  }

  isSortedBy.value = column;

}

/* Paginate contact list */
const currentPage = ref(1);
const itemsPerPage = ref(20);

const paginatedContactList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  return sortedContactList.value.slice(start, end);
});

const changePage = pageNumber => {
  currentPage.value = pageNumber;
}

watch([isSortedAsc, isSortedBy], () => {
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
    <thead>
      <tr>
        <th colspan="2" @click="sortContactList('name')">Name</th>
        <th @click="sortContactList('age')">Age</th>
        <th>Email</th>
        <th>Phone</th>
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
  <ContactListPagination 
    :itemCount="contactList.length"
    :itemsPerPage="itemsPerPage"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<style scoped>
</style>

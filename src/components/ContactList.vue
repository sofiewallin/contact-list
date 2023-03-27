<script setup>
import { ref } from 'vue'

const props = defineProps({
  apiUrl: {type: String, required: true},
})

let contactList = ref([])
let isLoaded = ref(false)
let error = ref(null)

const getContactList = async () => {
  try {
    const response = await fetch(`${props.apiUrl}?results=105&nat=gb`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
        
    const users = await response.json()
        
    if (!response.ok) {
      throw new Error(response.statusText);
    }
 
    contactList.value = users.results
    error.value = null
    
  } catch {
    error.value = 'Something went wrong when getting the list of contacts. Try reloading the page and try again.'
    isLoaded.value = true
  } finally {
    isLoaded.value = true
  }
}
getContactList()

</script>

<template>
  <table v-if="isLoaded">
    <thead>
      <tr>
        <th colspan="2">Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="error">
        <td colspan="5">{{ error }}</td>
      </tr>
      <tr v-else-if="contactList.length === 0">
        <td colspan="5">No contacts have been added.</td>
      </tr>
      <tr v-else v-for="contact in contactList" :key="contact.login.uuid">
        <td><img :src="contact.picture.large" :alt="`Portrait of ${contact.name.first} ${contact.name.last}`"></td>
        <td>{{ `${contact.name.first} ${contact.name.last}` }}</td>
        <td>{{ contact.email }}</td>
        <td>{{ contact.phone }}</td>
        <td>{{ `${contact.location.street.name} ${contact.location.street.number}, ${contact.location.postcode} ${contact.location.city}` }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="!isLoaded">
    <p>Loading ...</p>
  </div>
</template>

<style scoped>
</style>

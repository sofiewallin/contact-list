<script setup>
import { ref } from 'vue';
import ContactList from './components/ContactList.vue';

const apiUrl = ref('https://randomuser.me/api/?results=107&nat=gb');
const isPaginated = ref(true);
const itemsPerPage = ref(20);
</script>

<template>
  <div class="container">
    <header class="main-header">
      <h1 class="title title--main">Contacts</h1>
    </header>
    <ContactList 
      :apiUrl="apiUrl"
      :isPaginated="isPaginated"
      :itemsPerPage="itemsPerPage"
    />
  </div>
</template>

<style scoped>
.container {
  display: block;
  margin: 0 auto;
  max-width: 960px;
  padding: 0 16px;
}

.main-header {
  padding-top: 24px;
}

@media only screen and (min-width:768px) {
  .container {
    padding: 0 40px;
  }

  .main-header {
    padding-top: 48px;
  }
}
</style>

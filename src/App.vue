<script setup>
import ContactList from './components/ContactList.vue';

const apiUrl = 'https://randomuser.me/api/';
</script>

<template>
  <div class="container">
    <h1>Contacts</h1>
    <ContactList :apiUrl="apiUrl" />
  </div>
</template>

<style scoped>
</style>

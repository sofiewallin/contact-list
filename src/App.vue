<script setup>
import { reactive } from 'vue';
import ItemsTable from './components/ItemsTable/ItemsTable.vue';

const api = reactive({
  endpoint: 'https://randomuser.me/api/?results=107&nat=gb',
  rootObject: 'results'
});

const item = reactive({
  title: 'Contact',
  identifier: {
    label: 'uuid',
    path: 'login.uuid'
  },
  properties: [
    {
      label: 'portrait',
      header: {
        text: '',
        spanNext: true
      },
      values: [
        {
          path: 'picture.large',
          connector: ''
        }
      ],
      sorting: undefined,
      image: {
        altFromProperty: 'name',
        altFromPath: undefined
      },
      width: 'fixed'
    },
    {
      label: 'name',
      header: {
        text: 'Name',
        spanNext: false
      },
      values: [
        {
          path: 'name.first',
          connector: ' '
        },
        {
          path: 'name.last',
          connector: ''
        }
      ],
      sorting: {
        isInitiallySorted: false,
        initialOrder: 'ascending'
      },
      image: undefined,
      width: 'medium'
    },
    {
      label: 'age',
      header: {
        text: 'Age',
        spanNext: false
      },
      values: [
        {
          path: 'dob.age',
          connector: ''
        }
      ],
      sorting: {
        isInitiallySorted: false,
        initialOrder: 'ascending'
      },
      image: undefined,
      width: 'small'
    },
    {
      label: 'email',
      header: {
        text: 'Email',
        spanNext: false
      },
      values: [
        {
          path: 'email',
          connector: ''
        }
      ],
      sorting: undefined,
      image: undefined,
      width: 'large'
    },
    {
      label: 'phone',
      header: {
        text: 'Phone',
        spanNext: false
      },
      values: [
        {
          path: 'phone',
          connector: ''
        }
      ],
      sorting: undefined,
      image: undefined,
      width: 'medium'
    },
    {
      label: 'address',
      header: {
        text: 'Address',
        spanNext: false
      },
      values: [
        {
          path: 'location.street.number',
          connector: ' '
        },
        {
          path: 'location.street.name',
          connector: ', '
        },
        {
          path: 'location.city',
          connector: ', '
        },
        {
          path: 'location.state',
          connector: ' '
        },
        {
          path: 'location.postcode',
          connector: ''
        }
      ],
      sorting: undefined,
      image: undefined,
      width: 'large'
    }
  ]
});

const pagination = reactive({
  itemsPerPage: 10
});
</script>

<template>
  <div class="container">
    <header class="main-header">
      <h1 class="title title--main">{{ `${item.title}s` }}</h1>
    </header>
    <ItemsTable :api="api" :item="item" :pagination="pagination" />
  </div>
</template>

<style scoped>
.container {
  display: block;
  margin: 0 auto;
  max-width: 1232px;
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

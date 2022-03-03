<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat label="Game Stats" to="/" />
        <q-space />
        <q-btn flat label="API Documentation" type="a" :href="docHref" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    return {
      docHref: process.env.DEV ? 'http://127.0.0.1:3000/swagger/' : '/swagger/'
    }
  },
})
</script>

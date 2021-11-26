<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat label="Game Stats" />
        <q-space />
        <q-btn color="secondary" label="New Game" @click="openNewGameDialog" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

import NewGameDialog from '../components/NewGameDialog.vue'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar()

    function openNewGameDialog() {
      $q.dialog({
        component: NewGameDialog,
      });
    }
    return { openNewGameDialog };
  }
})
</script>

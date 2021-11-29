<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="games" class="column q-pa-md q-gutter-md">
      <template v-for="{id, name, description, players} in games" :key="id">
        <q-card class="text-white bg-secondary"
          :style="$q.screen.xs ? 'width: 320px;' : 'width: 640px;'"
        >
         <div v-ripple class="cursor-pointer q-hoverable">
         <span class="q-focus-helper" />
          <router-link class="router-link" :to="`/${id}/`">
            <q-card-section>
              <div class="text-h6">{{ name }}</div>
              <div class="text-subtitle2">{{ description }}</div>
            </q-card-section>
            <template v-if="players" class="row q-gutter-xs q-pd-xs">
              <q-card-section class="row q-gutter-xs">
                <template v-for="{id, name} in players" :key="id">
                  <template v-if="id">
                    <q-badge color="dark" :label="name" />
                  </template>
                </template>
              </q-card-section>
            </template>
          </router-link>
         </div>
         <div class="bg-secondary">
          <q-separator dark />
          <q-card-actions align="right">
            <q-btn flat icon="delete" @click="deleteDialog(id, name)">Delete</q-btn>
          </q-card-actions>
         </div>
        </q-card>
      </template>
    </div>
    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn fab icon="add" color="accent" @click="openNewGameDialog" />
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { Game } from 'components/models';
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { AxiosError } from 'axios';
import NewGameDialog from '../components/NewGameDialog.vue'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const $q = useQuasar()
    const games = ref<Game[]>()

    function removeGameId(id: number) {
      if(games.value) {
        games.value = games.value.filter((x) => x.id !== id)
      }
    }

    function apiFetchGames() {
      api.get<Game[]>('/games/')
        .then((response) => {
          games.value = response.data
        })
        .catch((error: AxiosError) => {
          let err: string = error.message
          if(error.response?.data) {
            err = <string>error.response?.data
          }
          $q.notify({
            color: 'negative',
            position: 'top',
            message: err,
            icon: 'report_problem'
        })
      })
    }

    function apiDeleteGame(gameId: number) {
      void api.delete(`/games/${gameId}/`)
        .catch((error: AxiosError) => {
          let err: string = error.message
          if(error.response?.data) {
            err = <string>error.response?.data
          }
          $q.notify({
            color: 'negative',
            position: 'top',
            message: err,
            icon: 'report_problem'
          })
          apiFetchGames()
      })
    }

    function apiCreateGame(game: Game) {
      api.post('/games/', game)
        .then(() => {
          apiFetchGames()
        })
        .catch((error: Error | AxiosError) => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: `Error create game: ${error.message}`,
            icon: 'report_problem'
        })
      })
    }

    function openNewGameDialog() {
      $q.dialog({
        component: NewGameDialog,
      }).onOk((game: Game) => {
        apiCreateGame(game)
      });
    }

    function deleteDialog(gameId: number, gameName: string) {
      $q.dialog({
        title: 'Delete Game',
        message: `Are you sure to delete '${gameName}' game?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        removeGameId(gameId)
        apiDeleteGame(gameId)
      })
    }
    return {
      apiFetchGames,
      apiCreateGame,
      apiDeleteGame,
      openNewGameDialog,
      deleteDialog,
      games
    }
  },
  created() {
    this.apiFetchGames()
  }
});
</script>

<style lang="sass" scoped>
.router-link
  text-decoration: none
  color: inherit
</style>

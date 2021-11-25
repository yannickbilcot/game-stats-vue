<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="games" class="column q-pa-md q-gutter-md">
      <template v-for="{id, name, description, players} in games" :key="id">
        <q-card class="text-white bg-secondary"
          :style="$q.screen.xs ? 'width: 250px;' : 'width: 640px;'"
        >
         <div v-ripple class="cursor-pointer q-hoverable">
         <span class="q-focus-helper" />
          <q-card-section>
            <div class="text-h6">{{ name }}</div>
            <div class="text-subtitle2">{{ description }}</div>
          </q-card-section>
          <template v-if="players" class="row q-gutter-xs q-pd-xs">
            <q-card-section class="row q-gutter-xs">
              <template v-for="{id, name} in players" :key="id">
                <q-badge color="dark" :label="name" />
              </template>
            </q-card-section>
          </template>
         </div>
         <div class="bg-secondary">
          <q-separator dark />
          <q-card-actions align="right">
            <q-btn flat icon="delete" @click="deleteDialog(name, id)">Delete</q-btn>
          </q-card-actions>
         </div>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Game } from 'components/models';
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { AxiosError } from 'axios';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const $q = useQuasar()
    const games = ref<Game[]>()
    var removedGame = <Game|undefined>{}


    function removeGameId(id: number) {
      if(games.value) {
        removedGame = games.value.find((el) => el.id === id)
        if (removedGame) {
          games.value = games.value.filter((x) => x.id !== id)
        }
      }
    }

    function apiFetchGames() {
      api.get<Game[]>('/games/')
        .then((response) => {
          games.value = response.data
        })
        .catch((error: Error | AxiosError) => {
          console.log(error.message)
          $q.notify({
            color: 'negative',
            position: 'top',
            message: `Error loading Games: ${error.message}`,
            icon: 'report_problem'
        })
      })
    }

    function apiDeleteGame(gameId: number) {
      console.log('deleteGame():', gameId)
      void api.delete(`/games/${gameId}/`)
        .catch((error: Error | AxiosError) => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: `Error delete Game: ${error.message}`,
            icon: 'report_problem'
          })
          if(removedGame) {
            games.value?.push(removedGame)
          }
      })
    }

    function deleteDialog(gameName: string, gameId: number) {
      $q.dialog({
        title: gameName,
        message: 'Are you sure to delete this game?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        removeGameId(gameId)
        apiDeleteGame(gameId)
      })
    }


    return { apiFetchGames, apiDeleteGame, deleteDialog, games };
  },
  created() {
    this.apiFetchGames()
  }
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
  <div v-if="game" class="column q-pa-md q-gutter-md">
    <template v-for="{id, name} in game.players" :key="id">
      <q-card class="text-white bg-secondary"
        :style="$q.screen.xs ? 'width: 250px;' : 'width: 640px;'"
      >
        <q-card-section>
          <q-item>
            <q-item-section>{{ name }}</q-item-section>
            <q-item-section avatar>
              <q-btn flat round icon="delete" />
            </q-item-section>
          </q-item>
        </q-card-section>
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
  name: 'PageGame',
  setup() {
    const $q = useQuasar()
    const game = ref<Game>()

    function apiFetchGame(id: string) {
      api.get<Game>(`/games/${id}`)
        .then((response) => {
          game.value = response.data
        })
        .catch((error: Error | AxiosError) => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: `Error loading Game: ${error.message}`,
            icon: 'report_problem'
        })
      })
    }

    return {
      apiFetchGame,
      game
    }
  },
  created() {
    this.apiFetchGame(<string>this.$route.params.id)
  }
});
</script>

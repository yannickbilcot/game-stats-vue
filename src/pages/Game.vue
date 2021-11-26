<template>
  <q-page class="row items-center justify-evenly">
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

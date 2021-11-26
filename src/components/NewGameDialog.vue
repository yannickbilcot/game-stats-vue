<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label="Name"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type something']"
            v-model="game.name"
            autofocus
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label="Description"
            v-model="game.description"
            dense
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <form>
          <q-input v-model="player"
            label="Player Name"
            :rules="[val => (!foundPlayer(val)) || 'This player already exist']"
          >
            <template v-slot:append>
              <q-btn type="submit" round dense flat icon="add" @click="addPlayer(player)" />
            </template>
          </q-input>
          </form>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-xs">
          <template v-for="{name, id} in game.players" :key="id">
            <q-chip size="md" removable :label="name" @remove="delPlayer(name)" color="secondary" text-color="white" />
          </template>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn type="submit" flat label="Submit" @click="onOKClick"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios'
import { useDialogPluginComponent } from 'quasar'
import { Game, Player } from './models'
import { useQuasar } from 'quasar'
import { AxiosError } from 'axios';

export default defineComponent({
  name: 'NewGameDialog',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const $q = useQuasar()
    const title = 'Create a new game'
    const player = ref('')
    const game = ref(<Game>{name: '', players: <Player[]>[]})

    function foundPlayer(name: string): boolean {
      return game.value.players.some((x) => x.name === name)
    }
    function addPlayer(name: string) {
      if(!foundPlayer(name) && name !== '') {
        game.value.players.push(<Player>{name: name})
        player.value = ''
      }
    }
    function delPlayer(name: string) {
      game.value.players = game.value.players.filter((x) => x.name !== name)
    }

    function apiCreateGame() {
      api.post('/games/', game.value)
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

    return {
      title,
      game,
      player,
      dialogRef,
      onDialogHide,
      addPlayer,
      delPlayer,
      foundPlayer,

      onOKClick () {
        if(game.value.name.length > 0) {
          apiCreateGame()
          onDialogOK()
        }
      },
      onCancelClick: onDialogCancel
    }
  }
});
</script>

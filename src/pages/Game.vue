<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="game && nbGames > 0">
      <q-card
        flat
        class="q-px-none"
        :style="$q.screen.xs ? 'width: 320px; height: 320px' : 'width: 640px; height: 460px'"
      >
        <q-card-section class="q-pa-sm">
          <q-tabs
            align="left"
            v-model="chart"
            text-color="dark"
            indicator-color="secondary"
            dense
          >
            <q-tab name="pie" label="Pie Chart" />
            <q-tab name="line" label="Line Chart" />
          </q-tabs>
        </q-card-section>
        <q-card-section class="q-px-none justify-center">
          <template v-if="chart == 'pie'">
            <apexchart
              width="500"
              align="center"
              :options="gamePlayers"
              :series="gameSeries"
            />
          </template>
          <template v-else>
            <apexchart
              width="500"
              height="385"
              align="center"
              :options="lineChartOptions"
              :series="gamePlayersCumStats"
            />
          </template>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="game" class="column q-pa-md q-gutter-md">
      <q-card flat bordered class="game-card text-dark"
        :style="$q.screen.xs ? 'width: 320px;' : 'width: 640px;'"
      >
        <q-card-section class="q-py-none">
          <q-item class="q-py-none">
            <q-item-section>
              <div class="text-subtitle2">{{ game.name }}</div>
            </q-item-section>
            <q-item-section avatar>
                <div class="text-subtitle2 text-center q-px-md"
                 :style="$q.screen.xs ? 'width: 43px;' : 'width: 109px;'">{{ nbGames }}</div>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
      <template v-for="{id, name} in game.players" :key="id">
        <template v-if="id">
          <q-card class="text-white bg-secondary"
            :style="$q.screen.xs ? 'width: 320px;' : 'width: 640px;'"
          >
            <q-card-section class="q-py-none">
              <q-item class="q-py-none">
                <q-item-section>
                  <div class="text-subtitle2">{{ name }}</div>
                </q-item-section>
                <q-item-section>
                    <div class="text-subtitle2 text-center">{{ gamePlayersWins[name] }}</div>
                </q-item-section>
                <q-item-section />
                <q-item-section>
                  <q-btn class="full-height" flat square-icon icon="add" @click="openAddWinnerDialog(id, name)" />
                </q-item-section>
                <q-item-section>
                  <q-btn class="full-height" size="sm" flat square-icon icon="delete" @click="deleteDialog(id, name)" />
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </template>
      </template>
    </div>
    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn fab icon="add" color="accent" @click="addPlayerDialog" />
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import {
  Game,
  Player,
  GamesWin,
  ApexTimestampSerie
} from 'components/models';
import { defineComponent, ref, computed } from 'vue';
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { AxiosError } from 'axios';
import AddWinnerDialog from '../components/AddWinnerDialog.vue'
import _ from 'lodash'


export default defineComponent({
  name: 'PageGame',
  setup() {
    const $q = useQuasar()
    const game = ref<Game>()
    let removedPlayer = <Player|undefined>{}

    const gameDatesTs = computed(() => {
      let datesArray = <number[]>[]
      game.value?.players.forEach((player) => {
        const playerStats = player.stats.filter((x) => x !== null)
        datesArray = _.union(datesArray, playerStats.map((date) => new Date(date).getTime()))
      })
      datesArray = datesArray.sort((a,b)=> a - b)
      return datesArray
    })

    const gamePlayersCumStats = computed(() => {
      let playersStats = <ApexTimestampSerie[]>[]
      if(game.value?.id) {
        game.value.players.forEach((player) => {
          let playerStats = <string[]>Object.values({...player.stats})
          let playerSerie = <ApexTimestampSerie>{
            name: player.name,
            data: []
            }
          let i = 0
          gameDatesTs.value.forEach((dateTs) => {
            if(playerStats.length > 0) {
              const elem = playerStats[0]
              if(elem) {
                const statDateTs = new Date(elem).getTime()
                if(statDateTs === dateTs) {
                  i++
                  playerStats.shift()
                }
              }
            }
            playerSerie.data.push([dateTs, i])
          })
        playersStats.push(playerSerie)
        })
      }
      return playersStats
    })

    const gamePlayersWins = computed(() => {
      let obj = <GamesWin>{}
      if(game.value?.id) {
        game.value.players.forEach((player) => {
          let i = 0
          player.stats.forEach((stat) => {
            if(stat) {
              i++
            }
          })
          obj[player.name] = i
        })
      }
      return obj
    })

    // eslint-disable-next-line @typescript-eslint/ban-types
    const gamePlayers: object = computed(() => {
      let players: string[] = []
      if(game.value?.id) {
        game.value.players.forEach((x) => {
          players.push(x.name)
        })
      }
      return {
        ...pieChartOptions,
        ...{
          labels: players,
        },
      }
    })

    const nbGames = computed(() => {
      return gameSeries.value.reduce(function(a, b){
        return a + b;
      }, 0);
    })

    const gameSeries = computed(() => {
      return Object.values(gamePlayersWins.value)
    })

    const lineChartOptions = {
      chart: {
        type: 'line',
        animations: {
          enabled: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        align: 'center',
        margin: 25
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      legend: {
        position: 'bottom'
      },
      xaxis: {
        type: 'datetime',
      },
      responsive: [{
        breakpoint: 480,
        align: 'center',
        options: {
          chart: {
            width: 320,
            height: 235
          },
          legend: {
            position: 'bottom'
          }
        }
      }],

    }

    const pieChartOptions = {
      labels: gamePlayers,
      title: {
        align: 'center',
        margin: 25
      },
      chart: {
        type: 'pie',
        animations: {
          enabled: true
        }
      },
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        align: 'center',
        options: {
          chart: {
            width: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
    }

    function removeGamePlayerId(id: number) {
      if(game.value?.players) {
        removedPlayer = game.value.players.find((x) => x.id === id)
        if (removedPlayer) {
          game.value.players = game.value.players.filter((x) => x.id !== id)
        }
      }
    }

    function apiFetchGame(id: number) {
      api.get<Game>(`/games/${id}`)
        .then((response) => {
          game.value = response.data
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

    function apiGameAddWinner(playerId: number, date: Date) {
      if(game.value?.id) {
        void api.post(`/games/${game.value.id}/players/${playerId}/stats/`, {date: date.toJSON(date)})
          .then(() => {
            if(game.value?.id) {
              apiFetchGame(game.value.id)
            }
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
    }

    function apiCreateGamePlayer(playerName: string) {
      if(game.value?.id) {
        const player = <Player> {name: playerName}
        void api.post(`/games/${game.value.id}/players/`, player)
          .then(() => {
            if(game.value?.id) {
              apiFetchGame(game.value.id)
            }
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
    }

    function apiDeleteGamePlayer(playerId: number) {
      if(game.value?.id) {
        void api.delete(`/games/${game.value.id}/players/${playerId}`)
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
            if(removedPlayer) {
              game.value?.players.push(removedPlayer)
            }
        })
      }
    }

    function openAddWinnerDialog(id: number, name: string) {
      $q.dialog({
        component: AddWinnerDialog,
        componentProps: {
          player: name,
          id: id
        }
      }).onOk((date) => {
        apiGameAddWinner(id, date)
      });
    }

    function deleteDialog(playerId: number, playerName: string) {
      $q.dialog({
        title: 'Delete Player',
        message: `Are you sure to delete '${playerName}' player?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        removeGamePlayerId(playerId)
        apiDeleteGamePlayer(playerId)
      })
    }

    function addPlayerDialog() {
      $q.dialog({
        title: 'Add a new Player',
        message: 'Player Name',
        prompt: {
          model: '',
          isValid: val => val.length > 1,
          type: 'text'
        },
        cancel: true
      }).onOk(name => {
        apiCreateGamePlayer(name)
      })
    }

    return {
      apiFetchGame,
      openAddWinnerDialog,
      deleteDialog,
      addPlayerDialog,
      gamePlayers,
      gamePlayersWins,
      gameSeries,
      pieChartOptions,
      lineChartOptions,
      nbGames,
      gamePlayersCumStats,
      gameDatesTs,
      game,
      chart: ref('pie')
    }
  },
  created() {
    this.apiFetchGame(parseInt(<string>this.$route.params.id))
  }
});
</script>

<style lang="sass" scoped>
.game-card
  border: 1px solid $secondary
</style>

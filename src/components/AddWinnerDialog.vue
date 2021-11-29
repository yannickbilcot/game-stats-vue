<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            label="Select a date"
            v-model="datetime"
            mask="####-##-## ##:##"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="datetime" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="datetime" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
import { useDialogPluginComponent, date } from 'quasar'

export default defineComponent({
  name: 'AddWinnerDialog',
  props: {
    player: {
      type: String,
      required: true
    },
    id: Number
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
    const title = `Add a game win to ${props.player}`
    const timeStamp = Date.now()
    const datetime = ref(date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm'))

    return {
      title,
      dialogRef,
      onDialogHide,
      datetime,

      onOKClick () {
        const dateObj = date.extractDate(datetime.value, 'YYYY-MM-DD HH:mm')
        onDialogOK(dateObj)
      },
      onCancelClick: onDialogCancel
    }
  }
});
</script>

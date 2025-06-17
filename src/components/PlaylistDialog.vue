<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center">Плейлист</div>
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <q-input v-model="_new.name" label="Название" />
        <q-input v-model="_new.icon" label="icon">
          <template v-slot:append>
            <div>
              <q-icon :name="icon(_new)" />
            </div>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="positive" label="OK" @click="onOKClick" />
        <q-btn flat color="negative" label="Отмена" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { Playlist } from './AudioLibrary';
import { reactive } from 'vue';

const props = defineProps<{
  playlist: Playlist
}>();

const _new = reactive<Playlist>({
  name: 'Playlist',
  icon: 'las la-headphones',
  streams: [],
  //collections: [],
})

Object.assign(_new, props.playlist);

defineEmits([
  ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
function onOKClick() {
  onDialogOK(_new)
}
function icon(playlist: Playlist) {
  if (playlist.icon.startsWith('http'))
    return 'img' + playlist.icon;
  return playlist.icon;
}
</script>

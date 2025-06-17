<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center">Коллекция</div>
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <q-input v-model="_new.name" label="Название" />
        <q-input v-model="_new.icon" label="icon">
          <template v-slot:append>
            <q-icon :name="icon(_new)" />
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
  collection?: Playlist
}>();

const _new = reactive<Playlist>({
  name: 'Audio Collection',
  streams: [],
  icon: 'las la-music'
})

Object.assign(_new, props.collection);

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
function onOKClick() {
  onDialogOK(_new)
}

function icon(collection: Playlist) {
  if (collection.icon?.startsWith('http'))
    return 'img:' + collection.icon;
  return collection.icon;
}
</script>

<style scoped></style>

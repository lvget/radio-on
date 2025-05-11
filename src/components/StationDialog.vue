<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center">Станция</div>
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <q-input v-model="_new.name" label="Название" />
        <q-input v-model="_new.src" label="Url Потока" />
        <q-input v-model="_new.desc" label="Url Данных" />
        <q-input v-model="_new.img" label="Изображение" />
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
import { AudioStream } from './AudioLibrary';
import { reactive } from 'vue';

const props = defineProps<{
  stream: AudioStream
}>();

const _new = reactive<AudioStream>({
  name: 'Radio',
  src: 'http://',
  desc: '',
  img: ''
})

Object.assign(_new, props.stream);

defineEmits([
  ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
function onOKClick() {
  onDialogOK(_new)
}
</script>

<style scoped></style>

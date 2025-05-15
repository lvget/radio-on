<template>
  <q-page padding>
    <AudioEqualizer />
  </q-page>
</template>

<script setup lang="ts">
import AudioEqualizer from 'src/components/AudioEqualizer.vue';

defineOptions({
  name: 'SettingsPage',
});
</script>

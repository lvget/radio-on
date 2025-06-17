<template>
  <q-page padding>
    <PlaylistView />
  </q-page>
</template>

<script setup lang="ts">
import PlaylistView from 'src/components/PlaylistView.vue';

defineOptions({
  name: 'IndexPage',
});
</script>

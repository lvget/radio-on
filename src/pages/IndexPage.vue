<template>
  <q-page padding>
    <AudioCollectionView />
  </q-page>
</template>

<script setup lang="ts">
import AudioCollectionView from 'src/components/AudioCollectionView.vue';

defineOptions({
  name: 'IndexPage',
});
</script>

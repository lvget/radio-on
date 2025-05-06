<template>
  <router-view />
</template>

<script setup lang="ts">
import { usePlayerStore } from 'stores/player';
const playerStore = usePlayerStore();

defineOptions({
  name: 'App',
});
</script>

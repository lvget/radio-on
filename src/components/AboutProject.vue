<template>
  <q-page>
    <div style="width: 100%; max-width: 800px; margin: 0 auto;">
      <div class=text-h5>Сборник хороших интернет-радио станций </div>
      <div>version: {{ version.ver }}</div>
      <div>build: {{ version.time }}</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import version from '../../version.json';
</script>

<style scoped></style>

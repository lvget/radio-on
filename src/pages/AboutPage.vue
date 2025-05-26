<template>
  <q-page padding>
    <div style="width: 100%; max-width: 800px; margin: 0 auto;">
      <div class=text-h4>Radio v-once</div>
      <div class=caption>https://radio-on.web.app </div>
      <div class=caption>Сборник интернет-радио станций </div>
      <div>version: {{ version.ver }}</div>
      <div>build: {{ version.time }}</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import version from '../../version.json';

defineOptions({
  name: 'AboutPage',
});
</script>

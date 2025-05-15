<template>

  <div style="width: 100%; max-width: 800px; height: 500px; margin: 0 auto;">

    <div class="row items-center justify-evenly text-center">
      <div>Equalizer <q-toggle v-model="enabled" class="q-mx-md" color="accent" /></div>

      <q-select outlined :options="equalizer.presets" v-model="presets" map-options dense options-dense
        style="min-width: 200px" @input-value="setPreset" color="accent" bg-color="active" />
    </div>
    <div class="row items-stretch no-wrap justify-between fit">
      <div v-for="(f, i) in equalizer.frequencies" :key="'f-' + i"
        class="q-ma-md columns items-center  no-wrap text-center">
        <div class="accent col">{{ filter[i] }}</div>
        <q-slider v-model="filter[i]" :min="-12" :max="12" :step="1" class="col" vertical reverse color="accent"
          @change="updateFilter(i)" />
        <div class="col">{{ f >= 1000 ? f / 1000 + 'k' : f }}Hz</div>
      </div>



    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as equalizer from './Audio/Equalizer';

let filter = ref<number[]>(equalizer.filters.map((f) => f.gain.value));
let presets = ref(equalizer.presets[0]);
let enabled = ref(true);
function updateFilter(i: number) {
  equalizer.filters[i].gain.value = filter.value[i];
}
function setPreset(p: any) {
  debugger
  p.gain.forEach((g: number, i: number) => {
    filter.value[i] = g;
  })
}
</script>

<style scoped></style>

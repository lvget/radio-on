<template>

  <div style="width: 100%; max-width: 800px; ; margin: 0 auto;">

    <div class="row items-center justify-evenly text-center q-mb-sm">
      <div>Equalizer <q-toggle v-model="enabled" class="q-mr-md" color="accent" @update:model-value="toggleEnabled">
          {{ enabled ? 'On' : 'Off' }}
        </q-toggle>
      </div>
      <q-btn color="primary" :label="presetName" no-caps style="width: 200px;" outline align="left" split
        :disable="!enabled">
        <q-menu fit v-close-popup>
          <q-list dense>
            <q-item clickable v-close-popup v-for="(preset, i) in equalizer.presets" :key="i" @click="setPreset(preset)"
              class="bg1 text1">
              {{ preset.label }}
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>


    </div>
    <div class="position-relative q-pa-md" style="position: relative;">
      <div class="row items-stretch no-wrap justify-between fit">
        <div v-for="(f, i) in equalizer.frequencies" :key="'f-' + i" class="columns items-center no-wrap text-center">
          <div class="accent">{{ filter[i] }}</div>
          <q-slider v-model="filter[i]" :min="-12" :max="12" :step="1" class="col" vertical reverse color="accent"
            @change="updateFilter(i)" />
          <div class="">{{ f >= 1000 ? f / 1000 + 'k' : f }}</div>
        </div>
      </div>
      <div v-if="!enabled" class="bg1 absolute-full" style="opacity: 0.7; z-index: 10; ">
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import equalizer from './Audio/Equalizer';

let filter = ref<number[]>(equalizer.filters.map((f) => f.gain.value));
let presetName = ref(equalizer.preset);
let enabled = ref(equalizer.enabled);
let userPreset = equalizer.presets[equalizer.presets.length - 1];

function updateFilter(i: number) {
  equalizer.filters[i].gain.value = filter.value[i];

  if (presetName.value != userPreset.label) {
    presetName.value = userPreset.label
    equalizer.filters.forEach((f, j) => {
      userPreset.gain[j] = f.gain.value;
    });
  }
  userPreset.gain[i] = filter.value[i];
}
function setPreset(p: any) {
  presetName.value = p.label;
  equalizer.preset = p.label;
  filter.value = equalizer.filters.map((f) => f.gain.value);
}
function toggleEnabled() {
  equalizer.enabled = enabled.value;
}
</script>

<style scoped></style>

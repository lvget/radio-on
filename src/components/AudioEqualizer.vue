<template>

  <div style="width: 100%; max-width: 800px; ; margin: 0 auto;">

    <div class="row items-center justify-evenly text-center q-mb-sm">
      <div>Equalizer <q-toggle v-model="enabled" class="q-mr-md" color="accent" @update:model-value="toggleEnabled">
          {{ enabled ? 'On' : 'Off' }}
        </q-toggle>
      </div>
      <q-btn-dropdown color="primary" :label="presetName" no-caps style="width: 200px;" outline align="left" split
        :disable="!enabled">
        <q-list>
          <q-item clickable v-close-popup v-for="(preset, i) in equalizer.presets" :key="i" @click="setPreset(preset)"
            class="bg1 text1">
            {{ preset.label }}
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="row items-stretch no-wrap justify-between fit" v-show="enabled">
      <div v-for="(f, i) in equalizer.frequencies" :key="'f-' + i" class="columns items-center no-wrap text-center">
        <div class="accent">{{ filter[i] }}</div>
        <q-slider v-model="filter[i]" :min="-12" :max="12" :step="1" class="col" vertical reverse color="accent"
          @change="updateFilter(i)" />
        <div class="">{{ f >= 1000 ? f / 1000 + 'k' : f }}</div>
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

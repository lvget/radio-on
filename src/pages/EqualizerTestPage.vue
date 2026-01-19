<template>
  <q-page class="equalizer-test-page">
    <div class="text-h4 text-center q-mb-lg">
      🎛️ Тест эквалайзера
    </div>

    <div class="row q-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Аудио плеер</div>
            <audio ref="audioRef" controls crossorigin="anonymous" class="q-mt-md" style="width: 100%">
              <source src="https://radio-connect.dline-media.com/ber_FM.mp3" type="audio/wav">
            </audio>

            <div class="q-mt-md">
              <q-btn color="primary" label="Инициализировать эквалайзер" @click="initEqualizer" :disable="!!equalizer"
                class="q-mr-md" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Эквалайзер</div>
            <div v-if="!equalizer" class="text-center q-pa-lg">
              <q-icon name="music_note" size="48px" color="grey-5" />
              <div class="text-grey-6 q-mt-sm">Сначала инициализируйте эквалайзер</div>
            </div>

            <div v-else>
              <div class="q-mb-md">
                <q-toggle v-model="enabled" color="primary" @update:model-value="toggleEnabled">
                  {{ enabled ? 'Включен' : 'Выключен' }}
                </q-toggle>
              </div>

              <div class="q-mb-md">
                <q-select v-model="currentPreset" :options="presetOptions" label="Пресет" outlined dense
                  @update:model-value="setPreset" />
              </div>

              <div class="text-subtitle2 q-mb-sm">Частотные полосы:</div>
              <div class="row q-gutter-sm">
                <div v-for="(band, index) in customBands" :key="index" class="col-auto">
                  <q-chip :label="`${formatFreq(band.frequency)}: ${band.gain}dB`"
                    :color="band.gain > 0 ? 'positive' : band.gain < 0 ? 'negative' : 'grey'" size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import AdvancedEqualizer from '../components/Audio/AdvancedEqualizer';

const $q = useQuasar();

const audioRef = ref<HTMLAudioElement>();
const equalizer = ref<AdvancedEqualizer | null>(null);
const audioContext = ref<AudioContext | null>(null);
const enabled = ref(false);
const currentPreset = ref('Flat');
const customBands = ref<any[]>([]);

const presetOptions = [
  'Flat', 'Rock', 'Jazz', 'Classical', 'Pop', 'Bass Boost', 'Treble Boost'
];

onMounted(() => {
  if (audioRef.value) {
    // Инициализируем базовые значения
    customBands.value = [
      { frequency: 31.5, gain: 0 },
      { frequency: 63, gain: 0 },
      { frequency: 125, gain: 0 },
      { frequency: 250, gain: 0 },
      { frequency: 500, gain: 0 },
      { frequency: 1000, gain: 0 },
      { frequency: 2000, gain: 0 },
      { frequency: 4000, gain: 0 },
      { frequency: 8000, gain: 0 },
      { frequency: 16000, gain: 0 }
    ];
  }
});

async function initEqualizer() {
  try {
    if (!audioRef.value) return;

    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume();
    }

    equalizer.value = new AdvancedEqualizer(audioContext.value);
    equalizer.value.connectSource(audioRef.value);

    // Обновляем состояние
    enabled.value = equalizer.value.enabled;
    currentPreset.value = equalizer.value.currentPreset;
    customBands.value = equalizer.value.customBands;

    $q.notify({
      type: 'positive',
      message: 'Эквалайзер инициализирован!'
    });

  } catch (error) {
    console.error('Ошибка:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка инициализации'
    });
  }
}

function toggleEnabled() {
  if (equalizer.value) {
    equalizer.value.enabled = enabled.value;
  }
}

function setPreset(presetName: string) {
  if (equalizer.value) {
    equalizer.value.setPreset(presetName);
    customBands.value = equalizer.value.customBands;
  }
}

function formatFreq(freq: number): string {
  if (freq >= 1000) {
    return `${(freq / 1000).toFixed(1)}k`;
  }
  return freq.toString();
}
</script>

<style scoped>
.equalizer-test-page {
  padding: 20px;
}
</style>
<template>

  <div class="absolute-full scroll audio-equalizer-example">
    <div class="row q-gutter-lg">
      <!-- Аудио плеер -->
      <div class="col-12 col-md-6">
        <q-card class="audio-player-card">
          <q-card-section>
            <div class="text-h6">Аудио плеер</div>
          </q-card-section>

          <q-card-section>
            <audio ref="audioRef" controls crossorigin="anonymous" class="audio-element">
              <source src="https://radio-connect.dline-media.com/ber_FM.mp3" type="audio/wav">
              Ваш браузер не поддерживает аудио элемент.
            </audio>

            <div class="q-mt-md">
              <q-btn color="primary" label="Инициализировать эквалайзер" @click="initializeEqualizer"
                :disable="!!equalizer" class="q-mr-md" />

              <q-btn color="secondary" label="Тестовая музыка" @click="loadTestAudio" :disable="!equalizer" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Эквалайзер -->
      <div class="col-12 col-md-6">
        <q-card class="equalizer-card">
          <q-card-section>
            <div class="text-h6">Эквалайзер</div>
          </q-card-section>

          <q-card-section>
            <div v-if="!audioContext" class="text-center q-pa-lg">
              <q-icon name="music_note" size="48px" color="grey-5" />
              <div class="text-grey-6 q-mt-sm">
                Нажмите "Инициализировать эквалайзер" для начала работы
              </div>
            </div>

            <AdvancedEqualizerUI v-else :audio-context="audioContext" :audio-element="audioElement"
              @equalizer-ready="onEqualizerReady" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Информация о состоянии -->
    <div class="q-mt-lg" v-if="equalizer">
      <q-card>
        <q-card-section>
          <div class="text-h6">Информация о состоянии</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-gutter-md">
            <div class="col-12 col-md-4">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Статус</q-item-label>
                    <q-item-label>{{ equalizer.enabled ? 'Включен' : 'Выключен' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Текущий пресет</q-item-label>
                    <q-item-label>{{ equalizer.currentPreset }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Общая громкость</q-item-label>
                    <q-item-label>{{ equalizer.masterGain.toFixed(1) }}x</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Преамп</q-item-label>
                    <q-item-label>{{ equalizer.preamp }}dB</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-8">
              <div class="text-subtitle2 q-mb-sm">Частотные полосы:</div>
              <div class="row q-gutter-sm">
                <div v-for="(band, index) in equalizer.customBands" :key="index" class="col-auto">
                  <q-chip :label="`${formatFrequency(band.frequency)}: ${band.gain}dB`"
                    :color="band.gain > 0 ? 'positive' : band.gain < 0 ? 'negative' : 'grey'" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import AdvancedEqualizerUI from 'src/components/AdvancedEqualizerUI.vue';
import AdvancedEqualizer from 'src/components/Audio/AdvancedEqualizer';

const $q = useQuasar();

// Ссылки на DOM элементы
const audioRef = ref<HTMLAudioElement>();
const audioElement = ref<HTMLAudioElement>();

// Состояние эквалайзера
const equalizer = ref<AdvancedEqualizer | null>(null);
const audioContext = ref<AudioContext | null>(null);

// Инициализация
onMounted(() => {
  if (audioRef.value) {
    audioElement.value = audioRef.value;
  }
});

onUnmounted(() => {
  if (audioContext.value) {
    audioContext.value.close();
  }
});

// Функции
async function initializeEqualizer() {
  try {
    if (!audioElement.value) {
      throw new Error('Аудио элемент не найден');
    }

    // Создаем AudioContext
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Ждем разрешения пользователя
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume();
    }

    $q.notify({
      type: 'positive',
      message: 'Эквалайзер инициализирован! Теперь вы можете настроить звук.'
    });

  } catch (error) {
    console.error('Ошибка инициализации:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка инициализации эквалайзера'
    });
  }
}

function onEqualizerReady(equalizerInstance: AdvancedEqualizer) {
  equalizer.value = equalizerInstance;
  $q.notify({
    type: 'positive',
    message: 'Эквалайзер готов к работе!'
  });
}

function loadTestAudio() {
  if (audioElement.value) {
    // Загружаем тестовый аудио файл
    audioElement.value.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
    audioElement.value.load();

    $q.notify({
      type: 'info',
      message: 'Тестовый аудио файл загружен'
    });
  }
}

function formatFrequency(freq: number): string {
  if (freq >= 1000) {
    return `${(freq / 1000).toFixed(1)}k`;
  }
  return freq.toString();
}
</script>

<style scoped>
.audio-equalizer-example {
  padding: 20px;
}

.audio-player-card,
.equalizer-card {
  height: fit-content;
}

.audio-element {
  width: 100%;
}

.q-chip {
  margin: 2px;
}
</style>
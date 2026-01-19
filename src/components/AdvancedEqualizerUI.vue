<template>
  <div class="advanced-equalizer">
    <div class="equalizer-header q-mb-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Эквалайзер</div>
        <div class="row items-center q-gutter-md">
          <q-toggle v-model="enabled" color="primary" @update:model-value="toggleEnabled" :disable="!audioContext">
            {{ enabled ? 'Включен' : 'Выключен' }}
          </q-toggle>

          <q-btn color="secondary" :label="currentPreset" no-caps outline @click="showPresetMenu = true"
            :disable="!enabled" />
        </div>
      </div>
    </div>

    <!-- Основные настройки -->
    <div class="main-controls q-mb-lg">
      <div class="row q-gutter-md">
        <div class="col-6">
          <q-slider v-model="masterGain" :min="0" :max="2" :step="0.1" title="Общая громкость" color="primary"
            @change="updateMasterGain" :disable="!enabled" />
          <div class="text-caption text-center">{{ masterGain.toFixed(1) }}x</div>
        </div>

        <div class="col-6">
          <q-slider v-model="preamp" :min="-20" :max="20" :step="1" title="Преамп" color="secondary"
            @change="updatePreamp" :disable="!enabled" />
          <div class="text-caption text-center">{{ preamp }}dB</div>
        </div>
      </div>
    </div>

    <!-- Частотные полосы -->
    <div class="frequency-bands q-mb-lg">
      <div class="text-subtitle1 q-mb-sm">Частотные полосы</div>
      <div class="row items-end justify-between q-gutter-sm">
        <div v-for="(band, index) in customBands" :key="index" class="band-control text-center">
          <div class="frequency-label text-caption q-mb-xs">
            {{ formatFrequency(band.frequency) }}
          </div>

          <q-slider v-model="band.gain" :min="-20" :max="20" :step="1" vertical reverse color="accent"
            @change="updateBandGain(index, band.gain)" :disable="!enabled" class="band-slider" />

          <div class="gain-value text-caption q-mt-xs">
            {{ band.gain }}dB
          </div>

          <div class="q-mt-xs">
            <q-select v-model="band.type" :options="filterTypes" dense outlined
              @update:model-value="updateBandType(index, band.type)" :disable="!enabled" style="width: 80px" />
          </div>

          <q-slider v-model="band.Q" :min="0.1" :max="10" :step="0.1" title="Q" color="orange"
            @change="updateBandQ(index, band.Q)" :disable="!enabled" class="q-slider" />
        </div>
      </div>
    </div>

    <!-- Визуализация -->
    <div class="visualization q-mb-lg" v-if="enabled">
      <div class="text-subtitle1 q-mb-sm">Визуализация</div>
      <canvas ref="canvasRef" width="800" height="200" class="visualization-canvas"></canvas>
    </div>

    <!-- Пресеты -->
    <q-dialog v-model="showPresetMenu">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Выберите пресет</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item v-for="preset in availablePresets" :key="preset.name" clickable v-close-popup
              @click="selectPreset(preset.name)">
              <q-item-section>
                <q-item-label>{{ preset.name }}</q-item-label>
                <q-item-label caption>{{ preset.description }}</q-item-label>
              </q-item-section>

              <q-item-section side v-if="preset.name !== 'Flat'">
                <q-btn flat round dense icon="delete" color="negative" @click.stop="deletePreset(preset.name)"
                  v-if="!isBuiltinPreset(preset.name)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Сохранение пользовательского пресета -->
    <q-dialog v-model="showSavePresetDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Сохранить пользовательский пресет</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newPresetName" label="Название пресета" outlined dense class="q-mb-md" />
          <q-input v-model="newPresetDescription" label="Описание" outlined dense type="textarea" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn unelevated label="Сохранить" color="primary" @click="saveCustomPreset" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Кнопки управления -->
    <div class="control-buttons q-mt-lg">
      <div class="row q-gutter-md justify-center">
        <q-btn color="primary" label="Сбросить" @click="resetToFlat" :disable="!enabled" />
        <q-btn color="secondary" label="Сохранить пресет" @click="showSavePresetDialog = true" :disable="!enabled" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import AdvancedEqualizer, { EqualizerBand, EqualizerPreset } from './Audio/AdvancedEqualizer';

const props = defineProps<{
  audioContext?: AudioContext;
  audioElement?: HTMLAudioElement;
}>();

const emit = defineEmits<{
  equalizerReady: [equalizer: AdvancedEqualizer];
}>();

const $q = useQuasar();

// Состояние эквалайзера
const enabled = ref(false);
const currentPreset = ref('Flat');
const masterGain = ref(1);
const preamp = ref(0);
const customBands = ref<EqualizerBand[]>([]);
const availablePresets = ref<EqualizerPreset[]>([]);

// UI состояние
const showPresetMenu = ref(false);
const showSavePresetDialog = ref(false);
const newPresetName = ref('');
const newPresetDescription = ref('');

// Визуализация
const canvasRef = ref<HTMLCanvasElement>();
let animationFrame: number | null = null;

// Эквалайзер
let equalizer: AdvancedEqualizer | null = null;

// Типы фильтров
const filterTypes = [
  { label: 'Peaking', value: 'peaking' },
  { label: 'Low Shelf', value: 'lowshelf' },
  { label: 'High Shelf', value: 'highshelf' },
  { label: 'Low Pass', value: 'lowpass' },
  { label: 'High Pass', value: 'highpass' }
];

// Инициализация
onMounted(async () => {
  if (props.audioContext && props.audioElement) {
    await initializeEqualizer();
  }
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});

async function initializeEqualizer() {
  if (!props.audioContext || !props.audioElement) return;

  try {
    equalizer = new AdvancedEqualizer(props.audioContext);
    equalizer.connectSource(props.audioElement);

    // Устанавливаем начальные значения
    enabled.value = equalizer.enabled;
    currentPreset.value = equalizer.currentPreset;
    masterGain.value = equalizer.masterGain;
    preamp.value = equalizer.preamp;
    customBands.value = equalizer.customBands;
    availablePresets.value = equalizer.availablePresets;

    // Запускаем визуализацию
    startVisualization();

    // Уведомляем родительский компонент
    emit('equalizerReady', equalizer);

    $q.notify({
      type: 'positive',
      message: 'Эквалайзер инициализирован'
    });
  } catch (error) {
    console.error('Ошибка инициализации эквалайзера:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка инициализации эквалайзера'
    });
  }
}

// Функции управления
function toggleEnabled() {
  if (equalizer) {
    equalizer.enabled = enabled.value;
  }
}

function updateMasterGain() {
  if (equalizer) {
    equalizer.setMasterGain(masterGain.value);
  }
}

function updatePreamp() {
  if (equalizer) {
    equalizer.setPreamp(preamp.value);
  }
}

function updateBandGain(index: number, gain: number) {
  if (equalizer) {
    equalizer.setBandGain(index, gain);
  }
}

function updateBandQ(index: number, Q: number) {
  if (equalizer) {
    equalizer.setBandQ(index, Q);
  }
}

function updateBandType(index: number, type: BiquadFilterType) {
  if (equalizer) {
    equalizer.setBandType(index, type);
  }
}

function selectPreset(presetName: string) {
  if (equalizer) {
    equalizer.setPreset(presetName);
    currentPreset.value = presetName;
    customBands.value = equalizer.customBands;
    showPresetMenu.value = false;
  }
}

function resetToFlat() {
  if (equalizer) {
    equalizer.setPreset('Flat');
    currentPreset.value = 'Flat';
    customBands.value = equalizer.customBands;
    masterGain.value = equalizer.masterGain;
    preamp.value = equalizer.preamp;
  }
}

function saveCustomPreset() {
  if (equalizer && newPresetName.value.trim()) {
    equalizer.saveCustomPreset(
      newPresetName.value.trim(),
      newPresetDescription.value.trim()
    );

    // Обновляем список пресетов
    availablePresets.value = equalizer.availablePresets;

    // Сбрасываем форму
    newPresetName.value = '';
    newPresetDescription.value = '';
    showSavePresetDialog.value = false;

    $q.notify({
      type: 'positive',
      message: 'Пресет сохранен'
    });
  }
}

function deletePreset(presetName: string) {
  if (equalizer) {
    equalizer.deleteCustomPreset(presetName);
    availablePresets.value = equalizer.availablePresets;

    $q.notify({
      type: 'positive',
      message: 'Пресет удален'
    });
  }
}

function isBuiltinPreset(presetName: string): boolean {
  return ['Flat', 'Rock', 'Jazz', 'Classical', 'Pop', 'Bass Boost', 'Treble Boost'].includes(presetName);
}

function formatFrequency(freq: number): string {
  if (freq >= 1000) {
    return `${(freq / 1000).toFixed(1)}k`;
  }
  return freq.toString();
}

// Визуализация
function startVisualization() {
  if (!canvasRef.value || !equalizer) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function draw() {
    if (!ctx || !equalizer || !enabled.value) {
      animationFrame = requestAnimationFrame(draw);
      return;
    }

    const frequencyData = equalizer.getFrequencyData();
    const width = canvas.width;
    const height = canvas.height;

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Рисуем фон
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    // Рисуем сетку
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Горизонтальные линии
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Вертикальные линии
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Рисуем спектр
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const barWidth = width / frequencyData.length;

    for (let i = 0; i < frequencyData.length; i++) {
      const barHeight = (frequencyData[i] / 255) * height;
      const x = i * barWidth;
      const y = height - barHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

// Следим за изменениями состояния
watch(enabled, (newValue) => {
  if (newValue && !animationFrame) {
    nextTick(() => {
      startVisualization();
    });
  }
});
</script>

<style scoped>
.advanced-equalizer {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.equalizer-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.main-controls {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.frequency-bands {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.band-control {
  flex: 1;
  min-width: 60px;
}

.band-slider {
  height: 150px;
}

.q-slider {
  height: 60px;
}

.visualization {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.visualization-canvas {
  width: 100%;
  height: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.control-buttons {
  border-top: 2px solid #e0e0e0;
  padding-top: 16px;
}

.frequency-label {
  font-weight: 500;
  color: #666;
}

.gain-value {
  font-weight: 500;
  color: #2196F3;
}
</style>

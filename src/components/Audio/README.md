# Модуль эквалайзера для HTML Audio

Этот модуль предоставляет продвинутый эквалайзер для HTML audio элементов с использованием Web Audio API.

## Возможности

- **10 частотных полос** (31.5Hz - 16kHz)
- **Встроенные пресеты**: Flat, Rock, Jazz, Classical, Pop, Bass Boost, Treble Boost
- **Пользовательские пресеты** - возможность сохранения собственных настроек
- **Регулируемые параметры**: Gain, Q-factor, тип фильтра
- **Преамп и общая громкость**
- **Визуализация** в реальном времени
- **TypeScript поддержка**

## Структура файлов

```
src/components/Audio/
├── AdvancedEqualizer.ts      # Основной класс эквалайзера
├── AdvancedEqualizerUI.vue   # Vue компонент интерфейса
├── AudioEqualizerExample.vue # Пример использования
├── Equalizer.ts              # Базовый эквалайзер (существующий)
└── README.md                 # Эта документация
```

## Быстрый старт

### 1. Создание эквалайзера

```typescript
import AdvancedEqualizer from './Audio/AdvancedEqualizer';

// Создаем AudioContext
const audioContext = new AudioContext();

// Создаем эквалайзер
const equalizer = new AdvancedEqualizer(audioContext);

// Подключаем к HTML audio элементу
const audioElement = document.querySelector('audio');
equalizer.connectSource(audioElement);
```

### 2. Использование в Vue компоненте

```vue
<template>
  <AdvancedEqualizerUI
    :audio-context="audioContext"
    :audio-element="audioElement"
    @equalizer-ready="onEqualizerReady"
  />
</template>

<script setup lang="ts">
import AdvancedEqualizerUI from './Audio/AdvancedEqualizerUI.vue';
import AdvancedEqualizer from './Audio/AdvancedEqualizer';

const audioContext = ref<AudioContext>();
const audioElement = ref<HTMLAudioElement>();
const equalizer = ref<AdvancedEqualizer>();

function onEqualizerReady(equalizerInstance: AdvancedEqualizer) {
  equalizer.value = equalizerInstance;
}
</script>
```

## API

### Класс AdvancedEqualizer

#### Конструктор

```typescript
constructor(audioContext: AudioContext)
```

#### Методы

##### Подключение источника

```typescript
connectSource(audioElement: HTMLAudioElement): void
```

##### Управление пресетами

```typescript
setPreset(presetName: string): void
saveCustomPreset(name: string, description: string): void
deleteCustomPreset(name: string): void
```

##### Настройка полос

```typescript
setBandGain(bandIndex: number, gain: number): void
setBandQ(bandIndex: number, Q: number): void
setBandType(bandIndex: number, type: BiquadFilterType): void
```

##### Общие настройки

```typescript
setMasterGain(gain: number): void
setPreamp(gain: number): void
```

##### Визуализация

```typescript
getFrequencyData(): Uint8Array
getTimeDomainData(): Uint8Array
```

##### Состояние

```typescript
getState(): EqualizerState
setState(state: EqualizerState): void
```

#### Свойства

- `enabled: boolean` - включен/выключен
- `currentPreset: string` - текущий пресет
- `customBands: EqualizerBand[]` - настройки полос
- `masterGain: number` - общая громкость
- `preamp: number` - преамп
- `availablePresets: EqualizerPreset[]` - доступные пресеты
- `frequencies: number[]` - частотные полосы

### Интерфейсы

#### EqualizerBand

```typescript
interface EqualizerBand {
  frequency: number; // Частота в Hz
  gain: number; // Усиление в dB (-20 до +20)
  Q: number; // Добротность (0.1 до 10)
  type: BiquadFilterType; // Тип фильтра
}
```

#### EqualizerPreset

```typescript
interface EqualizerPreset {
  name: string; // Название пресета
  description: string; // Описание
  bands: EqualizerBand[]; // Настройки полос
}
```

#### EqualizerState

```typescript
interface EqualizerState {
  enabled: boolean;
  currentPreset: string;
  customBands: EqualizerBand[];
  masterGain: number;
  preamp: number;
}
```

## Встроенные пресеты

### Flat

Нейтральный звук без изменений частотного спектра.

### Rock

Усиленные низкие и высокие частоты для энергичного звучания.

### Jazz

Теплый звук с усиленными средними частотами.

### Classical

Чистый звук с небольшим усилением высоких частот.

### Pop

Яркий звук с усиленными высокими частотами.

### Bass Boost

Усиление низких частот для глубокого баса.

### Treble Boost

Усиление высоких частот для яркости.

## Типы фильтров

- **peaking** - Полосовой фильтр (по умолчанию)
- **lowshelf** - Низкочастотный полочный фильтр
- **highshelf** - Высокочастотный полочный фильтр
- **lowpass** - ФНЧ
- **highpass** - ФВЧ

## Примеры использования

### Создание пользовательского пресета

```typescript
// Настраиваем полосы
equalizer.setBandGain(0, 6); // 31.5Hz: +6dB
equalizer.setBandGain(1, 4); // 63Hz: +4dB
equalizer.setBandGain(9, 8); // 16kHz: +8dB

// Сохраняем как пользовательский пресет
equalizer.saveCustomPreset('My Bass', 'Усиленный бас и высокие частоты');
```

### Сохранение и восстановление состояния

```typescript
// Сохраняем состояние
const state = equalizer.getState();
localStorage.setItem('equalizerState', JSON.stringify(state));

// Восстанавливаем состояние
const savedState = JSON.parse(localStorage.getItem('equalizerState'));
equalizer.setState(savedState);
```

### Визуализация в реальном времени

```typescript
function animate() {
  const frequencyData = equalizer.getFrequencyData();

  // Рисуем спектр
  drawSpectrum(frequencyData);

  requestAnimationFrame(animate);
}

animate();
```

## Совместимость

- **Браузеры**: Chrome 66+, Firefox 60+, Safari 14+, Edge 79+
- **Web Audio API**: Требуется поддержка
- **Vue**: 3.x
- **Quasar**: 2.x

## Ограничения

1. **CORS**: Аудио файлы должны быть доступны с CORS
2. **AudioContext**: Требуется пользовательское взаимодействие для создания
3. **Производительность**: Визуализация может влиять на производительность на слабых устройствах

## Устранение неполадок

### AudioContext в suspended состоянии

```typescript
if (audioContext.state === 'suspended') {
  await audioContext.resume();
}
```

### Ошибка CORS

Убедитесь, что аудио файлы доступны с CORS заголовками или используйте локальные файлы.

### Нет звука

Проверьте:

1. Подключен ли эквалайзер к источнику
2. Включен ли эквалайзер
3. Не установлена ли громкость в 0

## Лицензия

MIT License

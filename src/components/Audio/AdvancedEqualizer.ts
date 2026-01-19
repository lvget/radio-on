export interface EqualizerBand {
  frequency: number;
  gain: number;
  Q: number;
  type: BiquadFilterType;
}

export interface EqualizerPreset {
  name: string;
  description: string;
  bands: EqualizerBand[];
}

export interface EqualizerState {
  enabled: boolean;
  currentPreset: string;
  customBands: EqualizerBand[];
  masterGain: number;
  preamp: number;
}

export class AdvancedEqualizer {
  private audioContext: AudioContext;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private filters: BiquadFilterNode[] = [];
  private masterGainNode: GainNode;
  private preampNode: GainNode;
  private analyserNode: AnalyserNode;
  //private outputNode: AudioNode;

  private _enabled = false;
  private _currentPreset = 'Flat';
  private _customBands: EqualizerBand[] = [];
  private _masterGain = 1;
  private _preamp = 0;

  // Стандартные частотные полосы (ISO 266)
  private readonly defaultFrequencies = [
    31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000,
  ];

  // Предустановленные пресеты
  private readonly presets: EqualizerPreset[] = [
    {
      name: 'Flat',
      description: 'Нейтральный звук без изменений',
      bands: this.defaultFrequencies.map((freq) => ({
        frequency: freq,
        gain: 0,
        Q: 1,
        type: 'peaking',
      })),
    },
    {
      name: 'Rock',
      description: 'Усиленные низкие и высокие частоты',
      bands: [
        { frequency: 31.5, gain: 4, Q: 1, type: 'peaking' },
        { frequency: 63, gain: 6, Q: 1, type: 'peaking' },
        { frequency: 125, gain: 3, Q: 1, type: 'peaking' },
        { frequency: 250, gain: -2, Q: 1, type: 'peaking' },
        { frequency: 500, gain: -4, Q: 1, type: 'peaking' },
        { frequency: 1000, gain: -1, Q: 1, type: 'peaking' },
        { frequency: 2000, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 4000, gain: 4, Q: 1, type: 'peaking' },
        { frequency: 8000, gain: 6, Q: 1, type: 'peaking' },
        { frequency: 16000, gain: 6, Q: 1, type: 'peaking' },
      ],
    },
    {
      name: 'Jazz',
      description: 'Теплый звук с усиленными средними частотами',
      bands: [
        { frequency: 31.5, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 63, gain: 1, Q: 1, type: 'peaking' },
        { frequency: 125, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 250, gain: -2, Q: 1, type: 'peaking' },
        { frequency: 500, gain: -4, Q: 1, type: 'peaking' },
        { frequency: 1000, gain: -1, Q: 1, type: 'peaking' },
        { frequency: 2000, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 4000, gain: 4, Q: 1, type: 'peaking' },
        { frequency: 8000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 16000, gain: 3, Q: 1, type: 'peaking' },
      ],
    },
    {
      name: 'Classical',
      description: 'Чистый звук с небольшим усилением высоких частот',
      bands: [
        { frequency: 31.5, gain: -2, Q: 1, type: 'peaking' },
        { frequency: 63, gain: -1, Q: 1, type: 'peaking' },
        { frequency: 125, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 250, gain: 1, Q: 1, type: 'peaking' },
        { frequency: 500, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 1000, gain: 1, Q: 1, type: 'peaking' },
        { frequency: 2000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 4000, gain: 1, Q: 1, type: 'peaking' },
        { frequency: 8000, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 16000, gain: 3, Q: 1, type: 'peaking' },
      ],
    },
    {
      name: 'Pop',
      description: 'Яркий звук с усиленными высокими частотами',
      bands: [
        { frequency: 31.5, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 63, gain: 3, Q: 1, type: 'peaking' },
        { frequency: 125, gain: 1, Q: 1, type: 'peaking' },
        { frequency: 250, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 500, gain: -1, Q: 1, type: 'peaking' },
        { frequency: 1000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 2000, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 4000, gain: 4, Q: 1, type: 'peaking' },
        { frequency: 8000, gain: 5, Q: 1, type: 'peaking' },
        { frequency: 16000, gain: 6, Q: 1, type: 'peaking' },
      ],
    },
    {
      name: 'Bass Boost',
      description: 'Усиление низких частот',
      bands: [
        { frequency: 31.5, gain: 8, Q: 1, type: 'peaking' },
        { frequency: 63, gain: 10, Q: 1, type: 'peaking' },
        { frequency: 125, gain: 6, Q: 1, type: 'peaking' },
        { frequency: 250, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 500, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 1000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 2000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 4000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 8000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 16000, gain: 0, Q: 1, type: 'peaking' },
      ],
    },
    {
      name: 'Treble Boost',
      description: 'Усиление высоких частот',
      bands: [
        { frequency: 31.5, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 63, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 125, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 250, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 500, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 1000, gain: 0, Q: 1, type: 'peaking' },
        { frequency: 2000, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 4000, gain: 4, Q: 1, type: 'peaking' },
        { frequency: 8000, gain: 8, Q: 1, type: 'peaking' },
        { frequency: 16000, gain: 10, Q: 1, type: 'peaking' },
      ],
    },
  ];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;

    // Создаем узлы обработки
    this.masterGainNode = this.audioContext.createGain();
    this.preampNode = this.audioContext.createGain();
    this.analyserNode = this.audioContext.createAnalyser();

    // Настройка анализатора
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;

    // Инициализация фильтров
    this.initializeFilters();

    // Подключение узлов
    this.connectNodes();

    // Установка начального пресета
    this.setPreset('Flat');
  }

  private initializeFilters(): void {
    // Очищаем существующие фильтры
    this.filters = [];

    // Создаем фильтры для каждой частотной полосы
    this.defaultFrequencies.forEach((frequency) => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.Q.value = 1;
      filter.gain.value = 0;

      this.filters.push(filter);
    });

    // Инициализируем пользовательские настройки
    this._customBands = this.defaultFrequencies.map((freq) => ({
      frequency: freq,
      gain: 0,
      Q: 1,
      type: 'peaking' as BiquadFilterType,
    }));
  }

  private connectNodes(): void {
    // Подключаем преамп
    this.preampNode.connect(this.masterGainNode);

    // Подключаем фильтры последовательно
    let currentNode: AudioNode = this.preampNode;

    this.filters.forEach((filter) => {
      currentNode.connect(filter);
      currentNode = filter;
    });

    // Подключаем анализатор и выход
    currentNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);

    // Устанавливаем начальные значения
    this.updateFilters();
    this.updateGainNodes();
  }

  public connectSource(audioElement: HTMLAudioElement): void {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }

    this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
    this.sourceNode.connect(this.preampNode);
  }

  public setPreset(presetName: string): void {
    const preset = this.presets.find((p) => p.name === presetName);
    if (!preset) return;

    this._currentPreset = presetName;
    this._customBands = [...preset.bands];
    this.updateFilters();
  }

  public setBandGain(bandIndex: number, gain: number): void {
    if (bandIndex >= 0 && bandIndex < this._customBands.length) {
      this._customBands[bandIndex].gain = Math.max(-20, Math.min(20, gain));
      this.updateFilters();
    }
  }

  public setBandQ(bandIndex: number, Q: number): void {
    if (bandIndex >= 0 && bandIndex < this._customBands.length) {
      this._customBands[bandIndex].Q = Math.max(0.1, Math.min(10, Q));
      this.updateFilters();
    }
  }

  public setBandType(bandIndex: number, type: BiquadFilterType): void {
    if (bandIndex >= 0 && bandIndex < this._customBands.length) {
      this._customBands[bandIndex].type = type;
      this.updateFilters();
    }
  }

  public setMasterGain(gain: number): void {
    this._masterGain = Math.max(0, Math.min(2, gain));
    this.updateGainNodes();
  }

  public setPreamp(gain: number): void {
    this._preamp = Math.max(-20, Math.min(20, gain));
    this.updateGainNodes();
  }

  private updateFilters(): void {
    this._customBands.forEach((band, index) => {
      if (index < this.filters.length) {
        const filter = this.filters[index];
        filter.frequency.value = band.frequency;
        filter.Q.value = band.Q;
        filter.gain.value = band.gain;
        filter.type = band.type;
      }
    });
  }

  private updateGainNodes(): void {
    this.masterGainNode.gain.value = this._masterGain;
    this.preampNode.gain.value = Math.pow(10, this._preamp / 20);
  }

  public getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public getTimeDomainData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  public saveCustomPreset(name: string, description: string): void {
    const customPreset: EqualizerPreset = {
      name,
      description,
      bands: [...this._customBands],
    };

    this.presets.push(customPreset);
  }

  public deleteCustomPreset(name: string): void {
    const index = this.presets.findIndex((p) => p.name === name);
    if (index > 0) {
      // Не удаляем встроенные пресеты (index > 0)
      this.presets.splice(index, 1);
    }
  }

  public getState(): EqualizerState {
    return {
      enabled: this._enabled,
      currentPreset: this._currentPreset,
      customBands: [...this._customBands],
      masterGain: this._masterGain,
      preamp: this._preamp,
    };
  }

  public setState(state: EqualizerState): void {
    if (state.customBands) {
      this._customBands = [...state.customBands];
    }
    if (state.currentPreset) {
      this._currentPreset = state.currentPreset;
    }
    if (state.masterGain !== undefined) {
      this._masterGain = state.masterGain;
    }
    if (state.preamp !== undefined) {
      this._preamp = state.preamp;
    }

    this.updateFilters();
    this.updateGainNodes();
  }

  // Геттеры
  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value) {
    this._enabled = value;
    if (value) {
      this.updateFilters();
      this.updateGainNodes();
    } else {
      // Отключаем все фильтры
      this.filters.forEach((filter) => {
        filter.gain.value = 0;
      });
      this.masterGainNode.gain.value = 0;
    }
  }

  get currentPreset(): string {
    return this._currentPreset;
  }

  get customBands(): EqualizerBand[] {
    return [...this._customBands];
  }

  get masterGain(): number {
    return this._masterGain;
  }

  get preamp(): number {
    return this._preamp;
  }

  get availablePresets(): EqualizerPreset[] {
    return [...this.presets];
  }

  get frequencies(): number[] {
    return [...this.defaultFrequencies];
  }
}

export default AdvancedEqualizer;

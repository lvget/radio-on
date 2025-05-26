let _enabled = false;
let _preset = 'Default';
let filters: any[] = [];
let frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
const presets = [
  {
    label: 'Default',
    gain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    label: 'Rock',
    gain: [6, 3, -2, -4, -1, 2, 4, 6, 6, 6],
  },
  {
    label: 'Jazz',
    gain: [0, 0, -2, -4, -1, 2, 4, 0, 0, 6],
  },
  {
    label: 'User Settings',
    gain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

function init(audioContext: AudioContext) {
  frequencies.forEach((freq) => {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1;
    filter.gain.value = 0;

    filters.push(filter);
  });

  // filters.forEach((f) => {
  //   f.gain.value = 0;
  // });
}

function input(audioSource: any) {
  //return audioSource;
  let lastNode = audioSource;
  filters.forEach((filter) => {
    lastNode.connect(filter);
    lastNode = filter;
    filter.gain.value = 0
  });

  // filters.forEach(f => f.gain.value = 0);

  return lastNode;
}

const equalizer = {
  init,
  input,
  filters,
  frequencies,
  presets,

  get enabled() {
    return _enabled;
  },
  set enabled(value: any) {
    _enabled = value;
    if (value) {
      presets
        .find((p) => p.label == value)
        ?.gain.forEach((gain, i) => {
          filters[i].gain.value = gain;
        });
    } else {
      filters.forEach((f) => {
        f.gain.value = 0;
      });
    }
  },

  get preset() {
    return _preset;
  },
  set preset(value: any) {
    _preset = value;
    let p = presets.find((p) => p.label == value);
    if (p) {
      _preset = value;
      p.gain.forEach((gain, i) => {
        filters[i].gain.value = gain;
      });
    }
  },

  get state() {
    return {
      userPreset: presets[presets.length - 1].gain,
      enabled: this.enabled,
      preset: this.preset,
    };
  },
  set state(value: any) {
    if (value) {
      presets[presets.length - 1].gain = value.userPreset || [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ];
      this.enabled = value.enabled;
      this.preset = value.preset;
    }
  },
};

export default equalizer;

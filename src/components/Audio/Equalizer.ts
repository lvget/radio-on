let filters: any[] = [];
let frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
const presets = [
  {
    label: 'Rock',
    gain: [6, 3, -2, -4, -1, 2, 4, 6, 6, 6],
  },
  {
    label: 'Jazz',
    gain: [0, 0, -2, -4, -1, 2, 4, 0, 0, 6],
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

  presets[0].gain.forEach((gain, i) => {
    filters[i].gain.value = gain;
  });
}

function input(audioSource: any) {
  let lastNode = audioSource;
  filters.forEach((filter) => {
    lastNode.connect(filter);
    lastNode = filter;
  });
  return lastNode;
}

export { init, input, filters, frequencies, presets };

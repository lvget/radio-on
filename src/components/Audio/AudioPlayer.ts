import { reactive } from 'vue';
import { IPlayer, PlayerStatus } from './IPlayer';
import { LocalStorage } from 'quasar';
import equalizer from './Equalizer';

function onDOMReady(callback: () => void) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

let audio = new Audio();
audio.crossOrigin = 'anonymous';

let audioContext = new window.AudioContext();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
equalizer.init(audioContext);

function initAudio() {
  let audioSource = audioContext.createMediaElementSource(audio);
  equalizer.input(audioSource).connect(audioContext.destination);
  //equalizer.input(audioSource).connect(analyser);
  //analyser.connect(audioContext.destination);
}

const player = reactive<IPlayer>({
  status: PlayerStatus.stoping,
  muted: audio.muted,
  play(src?: string) {
    if (src && src !== this.src) {
      this.src = src;
    }
    audio.play();
  },
  pause() {
    audio.pause();
  },
  toggle() {
    if (this.isStop()) {
      this.play();
    } else {
      this.stop();
    }
  },
  stop() {
    audio.pause();
    audio.currentTime = 0;
  },
  isPlay() {
    return this.status == PlayerStatus.playing;
  },
  isStop() {
    return this.status == PlayerStatus.stoping;
  },
  isWaiting() {
    return this.status == PlayerStatus.waiting;
  },
  set volume(value: number) {
    audio.volume = value / 100;
    //saveState();
  },
  get volume() {
    return Math.round(audio.volume * 100);
  },
  get src() {
    return audio.src;
  },
  set src(value: string) {
    audio.src = value;
  },
  toggleMuted() {
    audio.muted = !audio.muted;
    this.muted = audio.muted;
  },
  getAudio() {
    return audio;
  },
});

audio.addEventListener('canplay', (event) => {
  console.log('canplay');
});

audio.addEventListener('playing', (event) => {
  console.log('playing');
  player.status = PlayerStatus.playing;
});

audio.addEventListener('progress', (event) => {
  //console.log('progress');
});

audio.addEventListener('play', (event) => {
  console.log('play');
  //player.status = PlayerStatus.playing;
});

audio.addEventListener('pause', (event) => {
  console.log('pause');
  player.status = PlayerStatus.stoping;
});

audio.addEventListener('ended', (event) => {
  console.log('ended');
});

audio.addEventListener('loadstart', (event) => {
  console.log('loadstart');
});

audio.addEventListener('loadeddata', (event) => {
  console.log('loadeddata');
  audio.play();
  //player.status = PlayerStatus.waiting;
});

audio.addEventListener('loadedmetadata', (event) => {
  //console.log('loadedmetadata', event);
});

audio.addEventListener('waiting', (event) => {
  console.log('waiting');
  player.status = PlayerStatus.waiting;
});

function saveState() {
  LocalStorage.set('player', player);
  LocalStorage.set('equalizer', equalizer.state);
}

function loadState() {
  let state: Record<string, any> | null = LocalStorage.getItem('player');
  if (state) {
    player.volume = state.volume;
    //player.src = state.src;
    //for (let k in state) {
    //  (player as Record<string, any>)[k] = state[k];
    //}
  }

  equalizer.state = LocalStorage.getItem('equalizer');
}

window.addEventListener('beforeunload', () => {
  saveState();
});

loadState();

onDOMReady(initAudio);

export {
  player,
  PlayerStatus,
  //analyser,
  initAudio,
};

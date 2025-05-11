import { reactive, watch } from 'vue';
import { IPlayer, PlayerStatus } from './IPlayer';
import { LocalStorage } from 'quasar';

const audio = new Audio();
audio.crossOrigin = 'anonymous';

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
  //player.status = PlayerStatus.waiting;
});

audio.addEventListener('loadedmetadata', (event) => {
  console.log('loadedmetadata', event);
});

audio.addEventListener('waiting', (event) => {
  console.log('waiting');
  player.status = PlayerStatus.waiting;
});

function saveState() {
  LocalStorage.set('player', player);
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
}

//player.src,
watch(
  () => [player.volume],
  () => {
    saveState();
  }
);

loadState();

export default player;

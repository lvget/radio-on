export enum PlayerStatus {
  stoping,
  playing,
  waiting,
}

export interface IPlayer {
  play: (src?: string) => void;
  stop: () => void;
  pause: () => void;
  toggle: () => void;
  isPlay: () => boolean;
  isStop: () => boolean;
  isWaiting: () => boolean;
  toggleMuted: () => void;
  getAudio: () => HTMLAudioElement;
  status: PlayerStatus;
  volume: number;
  muted: boolean;
  src: string;
}

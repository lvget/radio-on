import { reactive, watch } from 'vue';
import AudioLibrary, { AudioStream } from './AudioLibrary';
import { startRead, stopRead, type TrackStat } from './StreamDataReaderJson';
import { player } from './Audio';

function defaultImg() {
  return AudioLibrary.currentStream.img || '/img/dynamic.png';
}

const streamData = reactive<TrackStat>({
  title: '',
  image: defaultImg(),
  album: null,
  file: null,
  stat: null,
});

watch(
  () => AudioLibrary.currentStream,
  () => {
    streamData.image = defaultImg();
    streamData.title = '';
  }
);

watch(
  () => player.status,
  (s) => {
    if (player.isPlay()) {
      read(AudioLibrary.currentStream);
    } else if (player.isStop()) {
      stopRead();
    }
  }
);

function read(stream: AudioStream) {
  streamData.title = '';
  //streamData.image = defaultImg();
  streamData.album = null;
  streamData.file = null;
  streamData.stat = null;
  startRead(stream.desc || stream.src, onStats);
}

const onStats = (stat: any) => {
  streamData.title = stat.title; // || '';
  streamData.image = stat.image || defaultImg();
  streamData.album = stat.album;
  streamData.file = stat.file;
  streamData.stat = stat.stat;

  console.log('onStat: ' + streamData.title, stat);
};

if (player.isPlay()) {
  read(AudioLibrary.currentStream);
}

export default streamData;

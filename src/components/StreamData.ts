import { reactive, watch } from 'vue';
import AudioLibrary, { AudioStream } from './AudioLibrary';
import { startRead, stopRead } from './StreamDataReaderJson';
import type { TrackStat } from './StreamDataReaderJson';
import { player } from './Audio';

const streamData = reactive<TrackStat>({
  title: '',
  image: AudioLibrary.currentStream.img || '',
  album: null,
  file: null,
  stat: null,
});

watch(() => AudioLibrary.currentStream, read);
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
  //streamData.image = AudioLibrary.currentStream.img || '';
  streamData.album = null;
  streamData.file = null;
  streamData.stat = null;
  startRead(stream.desc || stream.src, onStats);
}

const onStats = (stat: any) => {
  streamData.title = stat.title || '';
  streamData.image = stat.image || AudioLibrary.currentStream.img || '';
  streamData.album = stat.album;
  streamData.file = stat.file;
  streamData.stat = stat.stat;
};

if (player.isPlay()) {
  read(AudioLibrary.currentStream);
}

export default streamData;

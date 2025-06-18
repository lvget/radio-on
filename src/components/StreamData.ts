import { reactive, watch } from 'vue';
import AudioLibrary, { AudioStream } from './AudioLibrary';
import startRead, { TrackStat } from './StreamDataReaderJson';
import { player, PlayerStatus } from './Audio';

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
      //read(null);
    }
  }
);
function read(stream: AudioStream) {
  // streamData.title = '';
  // streamData.image = stream.img || '';
  // streamData.album = null;
  // streamData.file = null;
  // streamData.album = null;
  // streamData.stat = null;

  startRead(stream.desc || stream.src, onStats);
}

const onStats = (stat: any) => {
  // Object.apply( stat, streamData);

  streamData.title = stat.title || '';
  streamData.image = stat.image || AudioLibrary.currentStream.img || '';
  streamData.album = stat.album;
  streamData.file = stat.file;
  streamData.stat = stat.stat;

  //console.log('onStats', streamData);
  // if (stat.title) {
  //   streamData.title = stat.title;
  // }

  // if (stat.image) {
  //   streamData.image = stat.image;
  // }
};

read(AudioLibrary.currentStream);

export default streamData;

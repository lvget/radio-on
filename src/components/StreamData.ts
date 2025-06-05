import { reactive, watch } from 'vue';
import library, { AudioStream } from './AudioLibrary';
import startRead from './StreamDataReaderJson';

const streamData = reactive({
  image: '',
  title: '',
});

watch(() => library.currentStream, read);

function read(stream: AudioStream) {
  streamData.title = '';
  streamData.image = stream.img || '';
  startRead(stream.desc || stream.src, onStats);
}

const onStats = (stats: any) => {
  //  console.log('onStats', stats);

  if (stats.title) {
    streamData.title = stats.title;
  }

  if (stats.image) {
    streamData.image = stats.image;
  }
};

export default streamData;

import { reactive, watch } from 'vue';
import library, { AudioStream } from './AudioLibrary';
import IcecastMetadataStats from 'icecast-metadata-stats';

let statsListener: any = null;

const streamData = reactive({
  image: '',
  title: '',
});

watch(
  () => library.currentStream,
  (stream: AudioStream) => {
    streamData.title = '';
    streamData.image = '';
    statsListener?.stop();
    statsListener = new IcecastMetadataStats(stream.desc || stream.src, {
      sources: ['icy', 'ogg'], //, 'stats', '7.html', 'status-json.xsl'],
      onStats,
      //onStatsFetch: onStats
    });
    statsListener.start();
  }
);
const onStats = (stats: any) => {
  console.log('onStats', stats);
  if (stats) {
    let title = '';
    if (stats.icy) {
      title = stats.icy.StreamTitle;
    } else if (stats.ogg) {
      streamData.title = stats.ogg.ARTIST + ' - ' + stats.ogg.ALBUM;
    }

    if (title && title !== streamData.title) {
      streamData.title = title;
      loadAlbomImage(title);
    }
  }
};

function loadAlbomImage(title: string) {
  fetch(`https://live2.mystreamplayer.com/album.php?key=${title}`).then(
    (res) => {
      res.json().then((json) => {
        if (json.Image) {
          streamData.image = json.Image;
        }
      });
    }
  );
}

export default streamData;

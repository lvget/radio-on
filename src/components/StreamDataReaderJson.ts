import IcecastMetadataStats from 'icecast-metadata-stats';

export class StreamDataReaderJson {
  url: string;
  _timer = 0;
  onStat: (stat: any) => void;

  constructor(url: string, onStat: (stat: any) => void) {
    this.url = url;
    this.onStat = onStat;
    if (url) this.start(url);
  }

  start(url?: string) {
    if (url) this.url = url;

    if (this._timer) clearTimeout(this._timer);
    this._timer = window.setTimeout(() => {
      this.read();
    }, 30000);

    this.read();
  }

  stop() {
    clearTimeout(this._timer);
    this._timer = 0;
  }

  read() {
    fetch(this.url).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          //console.log(data);

          if (data.errorCode == 0) {
            let d = data.result.short;
            let stat = {
              title: d.title,
              image: d.cover.cover100,
              album: {
                title: d.album.albumTitle,
                year: d.album.year,
              },
              file: d.audioFile,
              stats: data.result.stats,
            };
            this.onStat(stat);
          }
        });
      }
    });
  }
}

export type TrackStat = {
  title: string;
  image?: string;
  album?: {
    title: string;
    year: string;
  };
  file?: string;
  stats?: any;
};

let callback: any;
let statsListener: any = null;

function _onStats(data: any) {
  let title = '';
  if (data.icy) {
    title = data.icy.StreamTitle;
  } else if (data.ogg) {
    title = data.ogg.ARTIST + ' - ' + data.ogg.ALBUM;
  }

  callback({
    title,
  });

  // if (title && title !== streamData.title) {
  //   streamData.title = title;
  //   loadAlbumImage(title);
  // }
}

// function loadAlbumImage(title: string) {
//   fetch(`https://live2.mystreamplayer.com/album.php?key=${title}`).then(
//     (res) => {
//       res.json().then((json) => {
//         if (json.Image) {
//           streamData.image = json.Image;
//         }
//       });
//     }
//   );
// }
function startRead(url: string, onStats: (stat: TrackStat) => void) {
  statsListener?.stop();
  callback = onStats;

  if (url.startsWith('https://101.ru'))
    statsListener = new StreamDataReaderJson(url, onStats);
  else
    statsListener = new IcecastMetadataStats(url, {
      sources: ['icy', 'ogg'], // 'stats', '7.html', 'status-json.xsl'],
      onStats: _onStats,
    });

  statsListener.start();
}

export default startRead;

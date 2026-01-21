import IcecastMetadataStats from 'icecast-metadata-stats';

export type TrackStat = {
  title: string;
  image: string | null;
  album: {
    albumTitle: string;
    year: string;
  } | null;
  file: string | null;
  stat: any | null;
};

export class StreamDataReaderJson {
  url: string;
  _timer = 0;
  onStat: (stat: any) => void;

  constructor(url: string, onStat: (stat: any) => void) {
    this.url = url;
    this.onStat = onStat;
  }

  start(url?: string) {
    if (url) this.url = url;

    if (this._timer) clearInterval(this._timer);
    this._timer = window.setInterval(() => {
      this.read();
    }, 30000);
    debugger;
    this.read();
  }

  stop() {
    clearInterval(this._timer);
    this._timer = 0;
  }

  read() {
    console.log('read stat');
    fetch(this.url).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (data.errorCode == 0) {
            let d = data.result.short;
            let stat = {
              title: d.title,
              image: d.cover.cover250,
              album: d.album,
              file: d.audiofile,
              stat: data.result.stat,
            };
            this.onStat(stat);
          }
        });
      }
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
let callback: (stat: TrackStat) => void = () => {};
let statsListener: any = null;

function _onStats(data: any) {
  let stat: TrackStat = {
    title: '',
    image: null,
    album: null,
    file: null,
    stat: null,
  };

  if (data.icy) {
    stat.title = data.icy.StreamTitle;
    //statsListener.sources = ['icy'];
  } else if (data.ogg) {
    stat.title = data.ogg.ARTIST + ' - ' + data.ogg.ALBUM;
    stat.album = {
      albumTitle: data.ogg.ALBUM,
      year: data.ogg.YEAR,
    };
    statsListener.sources = ['ogg'];
  } else {
    //statsListener?.stop();
  }

  callback(stat);
}

function startRead(url: string, onStats: (stat: TrackStat) => void) {
  statsListener?.stop();
  callback = onStats;

  if (url.startsWith('https://101.ru'))
    statsListener = new StreamDataReaderJson(url, onStats);
  else
    statsListener = new IcecastMetadataStats(url, {
      sources: ['icy', 'ogg', 'stats'], //, '7.html', 'status-json.xsl'],
      onStats: _onStats,
    });

  statsListener.start();
}

function stopRead() {
  statsListener?.stop();
}

export { startRead, stopRead };

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

import { stat } from 'fs';

export default class StreamDataReaderJson {
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

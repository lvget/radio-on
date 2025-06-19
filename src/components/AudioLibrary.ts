//import { Playlist } from './AudioLibrary';
import { reactive } from 'vue';
import { player } from './Audio';
import { LocalStorage, Dialog, exportFile, Notify } from 'quasar';
import CollectionDialog from 'src/components/CollectionDialog.vue';
import StationDialog from 'src/components/StationDialog.vue';
import PlaylistDialog from 'src/components/PlaylistDialog.vue';

export type AudioStream = {
  name: string;
  src: string;
  desc: string;
  img?: string;
};

export type Playlist = {
  name: string;
  icon: string;
  streams: AudioStream[];
  playlists?: Playlist[];
};

export type TopPlaylist = Playlist & {
  src: string;
};

let EmptyPlaylist: Playlist = {
  name: '',
  icon: '',
  streams: [],
  playlists: [],
};

const EmptyStream: AudioStream = {
  name: '',
  src: '',
  desc: '',
  img: '',
};

let allStreams: AudioStream[] = [];

function getStreams(p: Playlist): AudioStream[] {
  let res = [] as AudioStream[];
  p.streams.forEach((x) => res.push(x));
  (p.playlists || []).forEach((c) => getStreams(c).forEach((x) => res.push(x)));
  return res;
}

const favorite: Playlist = {
  name: 'Избранное',
  icon: 'las la-star',
  streams: [],
  playlists: [],
};

const stor = reactive({
  favorite,
  playlists: [] as Playlist[],
  currentPlaylist: EmptyPlaylist,
  currentStream: EmptyStream,
  play() {
    player.play(this.currentStream.src);
    player.muted = false;
  },
  pause() {
    player.pause();
  },
  toggle() {
    if (player.isStop()) {
      this.play();
    } else {
      player.stop();
    }
  },
  nextStream() {
    let idx = allStreams.findIndex(
      (item) => item.name == this.currentStream.name
    );
    idx++;
    if (idx >= allStreams.length) idx = 0;
    this.selectStream(allStreams[idx]);
  },
  prevStream() {
    let idx = allStreams.findIndex(
      (item) => item.name == this.currentStream.name
    );
    idx--;
    if (idx < 0) idx = allStreams.length - 1;
    this.selectStream(allStreams[idx]);
  },
  random() {
    const idx = Math.floor(Math.random() * allStreams.length);
    this.currentStream = allStreams[idx];
    this.play();
  },

  selectCollection(p: Playlist) {
    this.currentPlaylist = p;
    allStreams = getStreams(p);
    LocalStorage.setItem('currentPlaylist', this.currentPlaylist.name);
  },
  selectStream(stream: AudioStream) {
    if (this.currentStream != stream) {
      this.currentStream = stream;
      LocalStorage.setItem('currentStream', this.currentStream);
    }
    this.play();
  },
  addPlaylist() {
    this.editPlaylist();
  },
  editPlaylist(playlist?: Playlist) {
    Dialog.create({
      component: PlaylistDialog,
      componentProps: { playlist },
    }).onOk((_playlist: Playlist) => {
      if (playlist) {
        Object.assign(playlist, _playlist);
      } else {
        this.playlists.push(_playlist);
      }
    });
  },
  removePlaylist(playlist: Playlist) {
    this.playlists = this.playlists.filter((x) => x != playlist);
  },
  async savePlaylist(playlist: Playlist) {
    let name = playlist.name.toLowerCase() + '.json';
    let data = JSON.stringify(playlist, null, 2);
    if (
      window.location.protocol == 'https' &&
      (window as any).showSaveFilePicker
    ) {
      const pickerOpts = {
        types: [
          {
            description: 'Json',
            accept: {
              'json/*': ['.json'],
            },
          },
        ],
        suggestedName: name,
      };

      try {
        let fileHandle = await (window as any).showSaveFilePicker(pickerOpts);
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
      } catch (e: any) {
        Notify.create({
          message: e.toString(),
          color: 'negative',
        });
        return;
      }
    } else {
      exportFile(name, data);
    }
    Notify.create({
      message: 'Saved to file: ' + name,
      color: 'positive',
    });
  },

  addCollection(playlist: Playlist) {
    this.editCollection(playlist);
  },

  editCollection(parent: Playlist, playlist?: Playlist) {
    Dialog.create({
      component: CollectionDialog,
      componentProps: { collection: playlist },
    }).onOk((_playlist: Playlist) => {
      if (playlist) {
        Object.assign(playlist, _playlist);
      } else {
        if (!parent.playlists) parent.playlists = [];
        parent.playlists.push(_playlist);
        this.selectCollection(_playlist);
      }
    });
  },
  removeCollection(parent: Playlist, playlist: Playlist) {
    if (parent.playlists)
      parent.playlists = parent.playlists.filter((x) => x != playlist);
  },

  addStream() {
    this.editStream();
  },
  editStream(stream?: AudioStream) {
    Dialog.create({
      component: StationDialog,
      componentProps: { stream },
    }).onOk((_stream: AudioStream) => {
      if (stream) {
        Object.assign(stream, _stream);
      } else {
        this.currentPlaylist.streams.push(_stream);
        this.selectStream(_stream);
      }
    });
  },
  removeStream(stream: AudioStream) {
    this.currentPlaylist.streams = this.currentPlaylist.streams.filter(
      (x) => x != stream
    );
  },
  isFavorite(s: AudioStream) {
    return this.favorite.streams.findIndex((item) => item.name == s.name) >= 0;
  },
  toggleFavorite(s: AudioStream) {
    let find = false;
    let streams = this.favorite.streams;
    for (let i = 0; i < streams.length; i++) {
      if (streams[i].name == s.name) {
        streams.splice(i, 1);
        find = true;
        break;
      }
    }
    if (!find) streams.push(s);
    LocalStorage.setItem('favorite', this.favorite);
  },
  loadPlaylist(url: string) {
    fetch(url).then((res) => {
      if (res.ok) {
        res.json().then((playlist: Playlist) => {
          this.playlists.push(playlist);
          this.selectCollection(playlist);

          //   LocalStorage.getItem('currentPlaylist') || '';
          // this.currentPlaylist =
          //   playlist.playlists.find((x) => x.name == currentPlaylist) ||
          //   EmptyCollection;
        });
      }
    });
  },
  async openPlaylist() {
    if (!(window as any).showOpenFilePicker) {
      alert(
        'Your current device does not support the File System API. Try again on desktop Chrome!'
      );
    } else {
      //here you specify the type of files you want to allow

      let options = {
        types: [
          {
            description: 'Json',
            accept: {
              'json/*': ['.json'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };

      // Open file picker and choose a file
      let fileHandle = await (window as any).showOpenFilePicker(options);
      if (!fileHandle[0]) {
        return;
      }

      // get the content of the file
      let file = await fileHandle[0].getFile();
      let reader = new FileReader();
      reader.onload = (event: any) => {
        let playlist = JSON.parse(event.target.result);
        stor.playlists.push(playlist);
      };
      reader.readAsText(file);
    }
  },
  getIcon(playlist: Playlist) {
    if (playlist.icon?.startsWith('http')) {
      return `img:${playlist.icon}`;
    } else {
      return playlist.icon || 'las la-music';
    }
  },
});

stor.favorite = LocalStorage.getItem('favorite') || favorite;
stor.playlists.push(stor.favorite);

stor.loadPlaylist('/rock.json');

stor.currentStream = LocalStorage.getItem('currentStream') || EmptyStream;

export default stor;

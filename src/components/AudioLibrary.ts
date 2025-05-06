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
};

export type AudioCollection = {
  name: string;
  streams: AudioStream[];
  icon?: string;
};

export type Playlist = {
  name: string;
  icon: string;
  collections: AudioCollection[];
};

let EmptyPlaylist: Playlist = {
  name: '',
  icon: '',
  collections: [],
};

const EmptyStream = {
  name: '',
  src: '',
  desc: '',
};

const EmptyCollection: AudioCollection = {
  name: '',
  streams: [],
};

const favorite: Playlist = {
  name: 'Избранное',
  icon: 'mdi-star',
  collections: [
    {
      name: 'Избранное',
      streams: [],
    },
  ],
};

const stor = reactive({
  favorite,
  playlists: [] as Playlist[],
  // active: {
  //   plylist: EmptyPlaylist,
  //   collection: EmptyCollection,
  //   stream: EmptyStream,
  // },
  currentCollection: EmptyCollection,
  currentStream: EmptyStream,
  play() {
    player.play(this.currentStream.src);
    player.muted = false;
    document.title = this.currentStream.name;
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
  nextStrem() {
    let idx = this.currentCollection.streams.findIndex(
      (item) => item.name == this.currentStream.name
    );
    idx++;
    if (idx >= this.currentCollection.streams.length) idx = 0;
    this.selectStream(this.currentCollection.streams[idx]); // % this.currentCollection.streams.length]
  },
  prevStream() {
    let idx = this.currentCollection.streams.findIndex(
      (item) => item.name == this.currentStream.name
    );
    idx--;
    if (idx < 0) idx = this.currentCollection.streams.length - 1;
    this.selectStream(this.currentCollection.streams[idx]);
  },
  random() {
    const idx = Math.floor(
      Math.random() * this.currentCollection.streams.length
    );
    this.currentStream = this.currentCollection.streams[idx];
    this.play();
  },

  selectCollection(col: AudioCollection) {
    this.currentCollection = col;
    LocalStorage.setItem('currentCollection', this.currentCollection.name);
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

  editCollection(playlist: Playlist, collection?: AudioCollection) {
    Dialog.create({
      component: CollectionDialog,
      componentProps: { collection },
    }).onOk((_collection: AudioCollection) => {
      if (collection) {
        Object.assign(collection, _collection);
      } else {
        playlist.collections.push(_collection);
        this.selectCollection(_collection);
      }
    });
  },
  removeCollection(playlist: Playlist, collection: AudioCollection) {
    playlist.collections = playlist.collections.filter((x) => x != collection);
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
        this.currentCollection.streams.push(_stream);
        this.selectStream(_stream);
      }
    });
  },
  removeStream(stream: AudioStream) {
    this.currentCollection.streams = this.currentCollection.streams.filter(
      (x) => x != stream
    );
  },
  isFavorite(s: AudioStream) {
    return (
      this.favorite.collections[0].streams.findIndex(
        (item) => item.name == s.name
      ) >= 0
    );
  },
  toggleFavorite(s: AudioStream) {
    let find = false;
    let streams = this.favorite.collections[0].streams;
    for (let i = 0; i < streams.length; i++) {
      if (streams[i].name == s.name) {
        streams.splice(i, 1);
        find = true;
        break;
      }
    }
    if (!find) streams.push(s);
    LocalStorage.setItem('favorite', streams);
  },
  loadPlaylist(url: string) {
    fetch(url).then((res) => {
      if (res.ok) {
        res.json().then((playlist: Playlist) => {
          this.playlists.push(playlist);
          let currentCollection =
            LocalStorage.getItem('currentCollection') || '';
          this.currentCollection =
            playlist.collections.find((x) => x.name == currentCollection) ||
            EmptyCollection;
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
});

stor.loadPlaylist('/rock.json');
stor.favorite.collections[0].streams = LocalStorage.getItem('favorite') || [];
stor.currentStream = LocalStorage.getItem('currentStream') || EmptyStream;

export default stor;

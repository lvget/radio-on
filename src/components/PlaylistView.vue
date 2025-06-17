<template>
  <div class="absolute-full">
    <q-scroll-area class="fit">
      <div style="max-width: 845px;  margin: 0 auto;">
        <template v-for="(c, cid) in collections" :key="c.name">
          <q-expansion-item dense v-if="settings.searchText.length == 0 || c.streams.length > 0" class="q-mb-sm"
            default-opened>
            <template v-slot:header>
              <q-item-section avatar>
                <div class="row items-center">
                  <q-avatar class="bg-liter text2" size="2em">
                    <q-icon :name="AudioLibrary.getIcon(c)" />
                  </q-avatar>
                  <span class="collection-title">{{ c.name }}</span>
                </div>

              </q-item-section>
              <q-item-section>
              </q-item-section>
              <q-item-section side>
                {{ c.streams?.length }}
              </q-item-section>
            </template>

            <div v-if="settings.ui.view == 'list'" v-intersection="onIntersection" :data-id="cid">
              <template v-for="(s, i) in c.streams" :key="s.name">
                <div class="row items-center q-pb-xs q-pr-sm q-ma-xs q-gutter-xs cursor-pointer text2"
                  :class="[s.src == AudioLibrary.currentStream.src ? 'active' : '']" @click="play(s)">

                  <div>
                    <q-img :src="s.img || '/img/dynamic.png'" class="stream-list-cover" />
                  </div>
                  <div class="col">
                    <div class="text1 ellipsis" style="font-size: 1.2em">{{ s.name }}</div>
                    <div v-if="settings.ui.showUrl" class="text2 ellipsis" style="font-size: 0.65em">{{ s.src }}</div>
                  </div>
                  <div>
                    <template v-if="s == AudioLibrary.currentStream">
                      <q-spinner-audio size="2em" v-if="player.isPlay()" class="accent" />
                      <q-spinner-ios v-if="player.isWaiting()" size="2em" class="accent" />
                    </template>
                  </div>
                  <div>
                    <q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'"
                      @click.stop="toggleFavorite(s);" />
                  </div>
                  <q-btn flat round dense icon="las la-ellipsis-v" @click.stop="onContextMenu($event, s);" />
                </div>
              </template>
            </div>

            <div v-if="settings.ui.view == 'tile'" style="max-width: 845px; margin: 0 auto;" class="row items-start"
              v-intersection="onIntersection" :data-id="cid">
              <template v-if="c.streams">
                <div v-for="(s) in c.streams" :key="s.name" class="row items-center justify-center stream-card text2"
                  @contextmenu="onContextMenu($event, s)">
                  <div class="relative-position stream-cover row items-center justify-center text2 bg1"
                    :class="[s.src == AudioLibrary.currentStream.src ? 'active' : '']" @click="play(s)" :style="img(s)"
                    :title="settings.ui.showUrl ? `${s.name}\n${s.src}` : ''">
                    <template v-if="s == AudioLibrary.currentStream">
                      <q-spinner-audio size="2em" v-if="player.isPlay()" class="absolute-bottom-left accent" />
                      <q-inner-loading :showing="player.isWaiting()" label="loading..." label-style="font-size: 1.1em"
                        class="accent" />
                    </template>
                    <!-- <q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'" @click.stop="toggleFavorite(s);"
                    class="absolute-top-left" /> -->
                    <q-btn flat round dense icon="las la-ellipsis-v" @click.stop="onContextMenu($event, s);"
                      class="absolute-top-right" style="margin: -6px -10px;" />
                  </div>
                  <div class="stream-title">{{ s.name }}</div>
                </div>
              </template>
            </div>
            <q-separator class="active " />
          </q-expansion-item>
        </template>
      </div>
    </q-scroll-area>
  </div>
  <q-menu v-model="menu.show" :target="menu.target" anchor="center middle" self="top left">
    <q-list class="bg-white">
      <q-item clickable v-close-popup @click="AudioLibrary.editStream(menu.stream);">
        <q-item-section avatar><q-icon name="las la-edit" /></q-item-section>
        <q-item-section>Редактировать</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="AudioLibrary.removeStream(menu.stream);">
        <q-item-section avatar><q-icon name="las la-trash" /></q-item-section>
        <q-item-section>Удалить</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <!-- <q-popup-proxy v-model="menu.show" :target="menu.target" context-menu>
    <q-list class="bg-white">
      <q-item clickable v-close-popup @click="AudioLibrary.editStream(menu.stream);">
        <q-item-section avatar><q-icon name="las la-edit" /></q-item-section>
        <q-item-section>Редактировать</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="AudioLibrary.removeStream(menu.stream);">
        <q-item-section avatar><q-icon name="las la-trash" /></q-item-section>
        <q-item-section>Удалить</q-item-section>
      </q-item>
    </q-list>
  </q-popup-proxy> -->

</template>

<script setup lang="ts">
import AudioLibrary, { AudioStream, Playlist } from './AudioLibrary';
import { player, PlayerStatus } from './Audio/index';
import { ref, watch, reactive, computed } from 'vue';
import settings from 'src/stores/Settings';

const menu = reactive({
  show: false,
  target: '' as any,
  stream: {} as AudioStream
});

const favorites = ref<boolean[]>([]);

const playlists = computed(() => {
  let res = [] as { p: Playlist, streams: AudioStream[] }[];

  function add(p: Playlist) {
    res.push({ p, streams: p.streams || [] });
  }
  add(AudioLibrary.currentPlaylist);
  AudioLibrary.currentPlaylist.playlists?.forEach(add);

  return res;
})


const collections = computed(() => {
  let text = settings.searchText.toLocaleLowerCase();
  let res = [] as Playlist[];
  res.push()

  function add(p: Playlist) {
    let streams = text.length == 0 ? p.streams : p.streams.filter(s => s.name.toLocaleLowerCase().indexOf(text) >= 0)
    res.push({
      name: p.name,
      icon: AudioLibrary.getIcon(p),
      streams: p.streams || []
    });
  }

  add(AudioLibrary.currentPlaylist);
  AudioLibrary.currentPlaylist.playlists?.forEach(x => add(x));
  return res;

})

let collVisible: number[] = []

watch(() => AudioLibrary.currentPlaylist, initFavorites)

function initFavorites() {
  favorites.value = AudioLibrary.currentPlaylist.streams?.map(s => AudioLibrary.isFavorite(s)) || [];
}

function img(s: AudioStream) {
  return `background-image: url('${s.img ? s.img : '/img/dynamic.png'}')`
}

function toggleFavorite(s: AudioStream) {
  AudioLibrary.toggleFavorite(s);
  initFavorites();
}

function play(s: AudioStream) {
  if (s != AudioLibrary.currentStream) {
    AudioLibrary.selectStream(s);
  } else {
    player.toggle();
  }
}

function onContextMenu(e: Event, s: AudioStream) {
  menu.show = true
  menu.target = e.currentTarget
  menu.stream = s
}

function onIntersection(entry: any) {
  let idx = Number(entry.target.dataset.id)

  if (entry.isIntersecting === true) {
    collVisible.push(idx)
  }
  else {
    collVisible = collVisible.filter(i => i != idx)
  }
  idx = Math.min(...collVisible)
  let collection = collections.value[idx]
  if (collection) {
    //library.currentPlaylist = collection
  }

  return true;
}


initFavorites();
</script>

<style scoped lang="scss">
.stream-list-cover {
  width: 50px;
  height: 50px;
  border-width: 1px;
  border-style: solid;
  border-radius: 50%;
  overflow: hidden;
  background-size: cover;
}

.stream-card {
  width: 110px;
  margin: 10px 5px;
  cursor: pointer;
  overflow: hidden;
  background-size: cover;
}

.stream-cover {
  padding: 5px;
  width: 100px;
  height: 100px;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  overflow: hidden;
  background-size: cover;
}

.stream-name {
  text-align: center;
  text-decoration: solid;
}

.stream-title {
  text-align: center;
  font-size: 0.9em;
  margin-top: 5px;
  line-height: 1.1em;

  text-wrap: none;
}

.menu-btn {
  display: none;
  position: absolute;
  bottom: 1px;
  right: 1px;
}

.stream-card:hover .menu-btn {
  display: block;
}

.icon-favorite {
  position: absolute;
  top: 1px;
  right: 1px;
}

.collection-title {
  font-size: 0.8em;
  border-radius: 7px;
  padding: 1px 10px;
}
</style>

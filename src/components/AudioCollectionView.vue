<template>
  <div class="absolute-full">
    <q-scroll-area class="fit" style="max-width: 845px;  margin: 0 auto;">
      <!-- <div v-if="settings.ui.view == 'tile'" style="max-width: 845px; margin: 0 auto;" class="row items-start">
        <template v-for="(s, i) in AudioLibrary.currentCollection.streams" :key="s.name">

          <div class="row items-center justify-center stream-card text2">
            <div class="relative-position stream-cover row items-center justify-center text2 bg1"
              :class="[s.src == AudioLibrary.currentStream.src ? 'active' : '']" @click="play(s)" :style="img(s)"
              :title="settings.ui.showUrl ? `${s.name}\n${s.src}` : ''">
              <template v-if="s == AudioLibrary.currentStream">
                <q-spinner-audio size="2em" v-if="player.isPlay()" class="absolute-bottom-left accent" />
                <q-inner-loading :showing="player.isWaiting()" label="loading..." label-style="font-size: 1.1em"
                  class="accent" />
              </template>
<q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'" @click.stop="toggleFavorite(s);"
  class="absolute-top-left" />
<q-btn flat round dense icon="las la-ellipsis-v" @click.stop="onContextMenu($event, s);" class="absolute-top-right"
  style="margin: -6px -10px;" />
</div>
<div class="stream-title">{{ s.name }}</div>
</div>
</template>
</div> -->

      <template v-for="(c) in collections" :key="c.name">
        <q-expansion-item dense v-if="settings.searchText.length == 0 || c.streams.length > 0" class="q-mb-sm"
          default-opened>
          <!-- <q-btn dense class="bg-liter q-mt-md" size="0.8em" @click="c.show = !c.show">{{ c.name }}
          <q-badge rounded class="bg1 q-mx-sm" :color="c.name">
            {{ c.streams.length }}</q-badge>
        </q-btn> -->
          <template v-slot:header>

            <q-item-section avatar>
              <q-btn dense flat size="0.8em" class="bg-liter" @click="c.show = !c.show">{{ c.name }}
                <!-- <q-badge rounded class="bg1 q-mx-sm" :color="c.name">
                {{ c.streams.length }}</q-badge> -->
              </q-btn>
            </q-item-section>
            <q-item-section>
            </q-item-section>
            <q-item-section side>
              {{ c.streams.length }}
            </q-item-section>
          </template>

          <div v-if="settings.ui.view == 'list'">
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
              <q-separator />
            </template>
          </div>

          <div v-if="settings.ui.view == 'tile'" style="max-width: 845px; margin: 0 auto;" class="row items-start">
            <template v-for="(s, i) in c.streams" :key="s.name">

              <div class="row items-center justify-center stream-card text2">
                <div class="relative-position stream-cover row items-center justify-center text2 bg1"
                  :class="[s.src == AudioLibrary.currentStream.src ? 'active' : '']" @click="play(s)" :style="img(s)"
                  :title="settings.ui.showUrl ? `${s.name}\n${s.src}` : ''">
                  <template v-if="s == AudioLibrary.currentStream">
                    <q-spinner-audio size="2em" v-if="player.isPlay()" class="absolute-bottom-left accent" />
                    <q-inner-loading :showing="player.isWaiting()" label="loading..." label-style="font-size: 1.1em"
                      class="accent" />
                  </template>
                  <q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'" @click.stop="toggleFavorite(s);"
                    class="absolute-top-left" />
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


    </q-scroll-area>

    <!-- <div v-if="settings.ui.view == 'list'" style="max-width: 845px;  margin: 0 auto;">
        <template v-for="(s, i) in AudioLibrary.currentCollection.streams" :key="s.name">
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
              <q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'" @click.stop="toggleFavorite(s);" />
            </div>
            <q-btn flat round dense icon="las la-ellipsis-v" @click.stop="onContextMenu($event, s);" />
          </div>
          <q-separator />
        </template>
      </div> -->

  </div>

  <q-popup-proxy v-model="menu.show" :target="menu.target">
    <q-list>
      <q-item clickable v-close-popup @click="AudioLibrary.editStream(menu.stream);">
        <q-item-section avatar><q-icon name="las la-edit" /></q-item-section>
        <q-item-section>Редактировать</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="AudioLibrary.removeStream(menu.stream);">
        <q-item-section avatar><q-icon name="las la-trash" /></q-item-section>
        <q-item-section>Удалить</q-item-section>
      </q-item>
    </q-list>
  </q-popup-proxy>

</template>

<script setup lang="ts">
import AudioLibrary, { AudioStream, AudioCollection } from './AudioLibrary';
import { player, PlayerStatus } from './Audio/index';
import { ref, watch, reactive, computed } from 'vue';
import settings from 'src/stores/Settings';

const menu = reactive({
  show: false,
  target: '' as any,
  stream: {} as AudioStream
});

const favorites = ref<boolean[]>([]);
//const collections = ref<Record<string, AudioStream[]>>({});

const collections = computed(() => {
  let text = settings.searchText.toLocaleLowerCase();
  let res = [] as any[];
  AudioLibrary.playlists.forEach(p => {
    // let x = p.collections.filter(c => {
    //   let i = c.name.indexOf(settings.searchText)
    // });

    p.collections.forEach(c => {
      let streams = text.length == 0 ? c.streams : c.streams.filter(s => s.name.toLocaleLowerCase().indexOf(text) >= 0)
      debugger
      res.push({
        name: c.name,
        streams//: c.streams.filter(s => s.name.toLocaleLowerCase().indexOf(text) >= 0)
      });
    })
  });
  return res;

})

watch(() => AudioLibrary.currentCollection, initFavorites)



function initFavorites() {
  favorites.value = AudioLibrary.currentCollection.streams.map(s => AudioLibrary.isFavorite(s));
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
  console.log(e)
  menu.show = true
  menu.target = e.currentTarget
  menu.stream = s

}
initFavorites();
</script>

<style scoped>
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

/* .stream-card:hover {
  background-image: none !important;
} */

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

.icon-play {
  position: absolute;
  bottom: 1px;
  right: 1px;
}
</style>

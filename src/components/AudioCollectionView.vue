<template>
  <div class="absolute-full">
    <q-scroll-area class="fit">
      <div v-if="view == 'tile'" style="max-width: 845px; margin: 0 auto;" class="row items-start text2">
        <template v-for="(s, i) in AudioLibrary.currentCollection.streams" :key="s.name">

          <div class="row items-center justify-center stream-card text2">
            <div class="relative-position stream-cover row items-center justify-center text2 bg1"
              :class="[s.src == AudioLibrary.currentStream.src ? 'active' : '']" @click="play(s)" :style="img(s)"
              :title="`${s.name}\n${s.src}`">
              <div class="stream-name" v-if="!s.img">{{ s.name }}</div>
              <template v-if="s == AudioLibrary.currentStream">
                <q-spinner-audio size="2em" v-if="player.isPlay()" class="icon-play accent" />
                <q-inner-loading :showing="player.isWaiting()" label="loading..." label-style="font-size: 1.1em"
                  class="accent" />
              </template>
              <q-menu touch-position context-menu dense>
                <q-list>
                  <q-item clickable @click="AudioLibrary.editStream(s);" v-close-popup>
                    <q-item-section avatar><q-icon name="las la-edit" /></q-item-section>
                    <q-item-section>Редактировать</q-item-section>
                  </q-item>
                  <q-item clickable @click="AudioLibrary.removeStream(s);" v-close-popup>
                    <q-item-section avatar><q-icon name="las la-trash" /></q-item-section>
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'" class="icon-favorite"
                @click.stop="toggleFavorite(s);" />
            </div>
            <div class="stream-title">{{ s.name }}</div>
          </div>
        </template>
      </div>


      <div v-if="view == 'list'" style="max-width: 845px; margin: 0 auto;" class="text2">
        <template v-for="(s, i) in AudioLibrary.currentCollection.streams" :key="s.name">
          <div class="row items-center q-my-md q-gutter-sm cursor-pointer" @click="play(s)">

            <div>
              <q-img :src="s.img || '/icons/favicon-128x128.png'"
                style="width: 50px; height: 50px; border-radius: 50%;" />
            </div>
            <div class="col">
              <div class="text-bold text1">{{ s.name }}</div>
              <div style="font-size: 0.7em">{{ s.src }}</div>
            </div>
            <div>
              <template v-if="s == AudioLibrary.currentStream">
                <q-spinner-audio size="2em" v-if="player.isPlay()" class="accent" />
                <q-inner-loading :showing="player.isWaiting()" label="loading..." label-style="font-size: 1.1em"
                  class="accent" />
              </template>
            </div>
            <div>
              <q-icon name="lar la-star" :class="favorites[i] ? 'accent' : 'text2'" @click.stop="toggleFavorite(s);" />
            </div>
          </div>


        </template>
      </div>



    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import AudioLibrary, { AudioStream } from './AudioLibrary';
import { player, PlayerStatus } from './Audio/index';
import { ref, watch } from 'vue';

const view = ref('list')
const favorites = ref<boolean[]>([]);

watch(() => AudioLibrary.currentCollection, initFavorites)

function initFavorites() {
  favorites.value = AudioLibrary.currentCollection.streams.map(s => AudioLibrary.isFavorite(s));
}

function img(s: AudioStream) {
  return s.img ? `background-image: url('${s.img}')` : ''
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

initFavorites();
</script>

<style scoped>
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

<template>
  <div>
    <div class="row items-center justify-center q-gutter-md text2">
      <template v-for="(s, i) in AudioLibrary.currentCollection.streams" :key="s.name">
        <div class="relative-position stream-card row items-center justify-center text2 bg1"
          :class="[s.src == AudioLibrary.currentStream.src ? 'active' : '']" @click="play(s)">
          <div class="stream-name">{{ s.name }}</div>
          <template v-if="s == AudioLibrary.currentStream">
            <q-spinner-audio size="2em" v-if="player.isPlay()" class="icon-play accsent" color="accsent" />
            <q-inner-loading :showing="player.isWaiting()" label="loading..." label-style="font-size: 1.1em" />
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
          <q-icon name="lar la-star" :class="favs[i] ? 'accsent' : 'text2'" class="icon-favorite"
            @click.stop="toggleFavorite(s);" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import AudioLibrary, { AudioStream } from './AudioLibrary';
import { player, PlayerStatus } from './Audio/index';
import { ref, watch } from 'vue';

const favs = ref<boolean[]>([]);

watch(() => AudioLibrary.currentCollection, initFavs)

function initFavs() {
  favs.value = AudioLibrary.currentCollection.streams.map(s => AudioLibrary.isFavorite(s));
}

function toggleFavorite(s: AudioStream) {
  AudioLibrary.toggleFavorite(s);
  initFavs();
}

function play(s: AudioStream) {
  if (s != AudioLibrary.currentStream) {
    AudioLibrary.selectStream(s);
  } else {
    player.toggle();
  }
}

initFavs();
</script>

<style scoped>
.stream-card {
  width: 100px;
  height: 100px;
  border-width: 1px;
  border-style: solid;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
}

.stream-name {
  text-align: center;
  text-decoration: solid;
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

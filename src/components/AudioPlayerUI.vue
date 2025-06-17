<template>
  <div class="row items-center">
    <div class="q-ma-xs">
      <q-btn flat round to="/stream">
        <q-img :src="streamData.image || '/img/dynamic.png'" style="width: 70px; height: 70px; border-radius: 50%" />
      </q-btn>

    </div>
    <div class="col">
      <div class="q-mx-sm row items-center no-wrap text2">
        <div class="q-mx-xs">
          <q-spinner-audio size="2em" v-if="player.isPlay()" />
          <q-spinner-ios size="2em" v-if="player.isWaiting()" />
        </div>
        <div>
          <div class="text-caption text-weight-light">
            {{ AudioLibrary.currentStream.name }}
          </div>
          <div class="text-caption ellipsis text-no-wrap">
            {{ streamData.title }}
          </div>
        </div>
      </div>
      <div class="q-px-sm q-pb-sm row items-center no-wrap">
        <q-space />
        <div class="row no-wrap">
          <q-btn @click="AudioLibrary.prevStream()" icon="las la-step-backward" flat round />
          <q-btn @click="AudioLibrary.toggle()" :icon="player.isPlay() ? 'las la-stop' : 'las la-play'" round
            color="accent" text-color="black" />
          <q-btn @click="AudioLibrary.nextStream()" icon="las la-step-forward" flat round />

          <q-btn @click="AudioLibrary.random()" icon="las la-random" flat round class="q-ml-md" />
        </div>
        <q-space />
        <q-btn icon="las la-sliders-h" flat round to="/settings/sound" />
        <div class="row no-wrap" @mousewheel.prevent="setVolume">
          <q-btn @click="showVolume" :icon="'las la-volume-' + (player.muted ? 'mute' : 'up')" flat round>
            <span class="text-caption text-weight-light">
              {{ player.volume }}
            </span>
          </q-btn>
        </div>

        <div class="volume accent" :class="{ volumeVisible: volumeVisible }">
          <div class="column items-center active" style="border-radius: 15px">
            <div class="q-my-sm">{{ player.volume }}%</div>
            <q-slider v-model="player.volume" :min="0" :max="100" :step="5" height="250px" vertical reverse />
            <q-btn @click="player.toggleMuted()" :icon="'las la-volume-' + (player.muted ? 'mute' : 'up')" flat
              round></q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { player } from './Audio';
import AudioLibrary from './AudioLibrary';
import streamData from './StreamData';
//import AudioStreamAnimation from './AudioStreamAnimation.vue';
let volumeVisible = ref(false);
let timer = 0;

function showVolume() {
  if (timer) {
    clearInterval(timer);
    timer = 0;
  }

  volumeVisible.value = !volumeVisible.value;

  if (volumeVisible.value) {
    timer = setTimeout(() => {
      volumeVisible.value = false;
    }, 15000);
  }
}
function setVolume(e) {
  let v = player.volume
  if (e.wheelDelta > 0) {
    v += 5;
    if (v > 100) v = 100
  }
  else {
    v -= 5;
    if (v < 0) v = 0
  }
  player.volume = v
}
</script>
<style scoped lang="scss">
.volume {
  position: absolute;
  bottom: 60px;
  right: -60px;
  border-radius: 25px;
  overflow: hidden;
  transition: right 0.5s;
}

.volumeVisible {
  right: 10px;
}
</style>

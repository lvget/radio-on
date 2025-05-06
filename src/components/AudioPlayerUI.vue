<template>
  <div>
    <div class="q-mx-md row items-center q-gutter-md no-wrap text2">
      <div>
        <q-img :src="streamData.image || '/icons/favicon-32x32.png'" style="width: 30px; height: 30px;" />
      </div>
      <div style="width: 2em">
        <q-spinner-audio size="2em" v-if="player.isPlay()" />
        <q-spinner-ios size="2em" v-if="player.isWaiting()" />
      </div>
      <div>
        <div class="text-caption">{{ AudioLibrary.currentStream.name }}</div>
        <div>{{ streamData.title }}</div>
      </div>

    </div>
    <div class="q-pa-sm row items-center no-wrap">
      <div class="col row">
        <q-space />
        <q-space />
      </div>
      <div class="">
        <q-btn @click="AudioLibrary.prevStream()" icon="las la-step-backward" flat round />
        <q-btn @click="AudioLibrary.toggle()" :icon="player.isPlay() ? 'las la-stop' : 'las la-play'" round
          color="accsent" text-color="black" />
        <q-btn @click="AudioLibrary.nextStrem()" icon="las la-step-forward" flat round />
      </div>
      <div class="col row no-wrap">
        <q-btn @click="AudioLibrary.random()" icon="las la-random" flat round class="q-ml-md"></q-btn>
        <q-space />
        <q-btn @click="showSoundBar" :icon="'las la-volume-' + (player.muted ? 'mute' : 'up')" flat round>{{
          player.volume
          }}</q-btn>
      </div>

      <div ref="soundBar" class="sound accesnt" style="right: -60px">
        <div class="column items-center q-ma-sm">
          <div>{{ player.volume }}%</div>
          <div class="q-my-sm active q-pa-sm" style="border-radius: 15px">
            <q-slider v-model="player.volume" :min="0" :max="100" :step="5" height="250px" vertical reverse />
          </div>
          <q-btn @click="player.toggleMuted()" :icon="'las la-volume-' + (player.muted ? 'mute' : 'up')" flat
            round></q-btn>
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
const soundBar = ref(null);
let timer = 0
function showSoundBar() {
  if (timer) clearInterval(timer);
  if (soundBar.value.style.right == '-60px') {
    soundBar.value.style.right = '5px';
    timer = setTimeout(() => {
      soundBar.value.style.right = '-60px';
    }, 15000)
  }
  else {
    soundBar.value.style.right = '-60px';
  }

}
</script>
<style scoped lang="scss">
.sound {
  position: absolute;
  bottom: 90px;
  right: -60px;
  border-radius: 25px;
  overflow: hidden;
  transition: right 0.5s
}
</style>

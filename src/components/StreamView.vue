<template>
  <div style="width: 90%; max-width: 500px; margin: 0 auto;">
    <q-card class="bg1 q-mb-md">
      <q-card-section>
        <div class=text-h6>{{ AudioLibrary.currentStream.name }}</div>
      </q-card-section>
      <q-card-section>
        <q-img :src="streamData.image || '/img/dynamic.png'" style="width: 90%; max-width: 350px; margin: 0 auto;" />
      </q-card-section>

      <q-card-section>
        <div>
          <div class="text-caption ellipsis text-no-wrap">
            {{ streamData.title }}
          </div>
          <div v-if="streamData.album">
            {{ streamData.album.albumTitle }} - {{ streamData.album.year }}
          </div>
          <div class="row items-center">
            <div v-if="streamData.stat" class="col">
              <!-- {{ streamData.stat }}
              {{ date.getDateDiff(new Date(streamData.stat.finishSong), new Date(streamData.stat.startSong), 'seconds') }}
            -->
              {{ Math.round((streamData.stat.finishSong - streamData.stat.startSong) / 6) / 10 }} мин
            </div>
            <div v-if="streamData.file">
              <q-btn flat icon="las la-download" :href="streamData.file" target="_blank" label="" />
            </div>
          </div>
        </div>

      </q-card-section><q-btn icon="close" flat round class="absolute-top-right" to="/" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import AudioLibrary from './AudioLibrary';
import streamData from './StreamData';
import { player } from './Audio';
import { date } from 'quasar'

</script>

<style scoped></style>

<template>
  <q-scroll-area class="fit">
    <q-toolbar>
      Radio-On
      <q-space />
      <q-btn flat round dense icon="las la-cloud-download-alt" @click="AudioLibrary.openPlaylist()"
        title="Загрузить плейлист" />
      <q-btn flat round dense icon="las la-folder-open" @click="AudioLibrary.openPlaylist()" title="Открыть плейлист" />
      <q-btn flat round dense icon="las la-plus-circle" @click="AudioLibrary.addPlaylist()" title="Создать плейлист" />
    </q-toolbar>
    <q-separator />
    <q-list class="bg2 text2">
      <q-item clickable tag="a" to="/collection/favorite/0"
        @click="AudioLibrary.selectCollection(AudioLibrary.favorite.collections[0])"
        :class="{ bgActive: isActive(AudioLibrary.favorite.collections[0]) }">
        <q-item-section avatar>
          <q-icon name="las la-star" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ AudioLibrary.favorite.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <template v-for="(p, i) in AudioLibrary.playlists" :key="'pl' + i">
      <q-separator />
      <q-expansion-item :label="p.name" class="bg1 text1">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar class="bg2 text2">
              <q-icon :name="p.icon || 'las la-music'" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ p.name }}
          </q-item-section>
          <q-menu touch-position context-menu dense>
            <q-list>
              <q-item>
                <q-item-section class="text-bold text-center">Плейлист</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="AudioLibrary.addCollection(p)" v-close-popup>
                <q-item-section avatar><q-icon name="las la-calendar-plus" /></q-item-section>
                <q-item-section>Добавить коллекцию</q-item-section>
              </q-item>
              <q-item clickable @click="AudioLibrary.editPlaylist(p)" v-close-popup>
                <q-item-section avatar><q-icon name="las la-edit" /></q-item-section>
                <q-item-section>Редактировать</q-item-section>
              </q-item>
              <q-item clickable @click="AudioLibrary.savePlaylist(p)" v-close-popup>
                <q-item-section avatar><q-icon name="las la-save" /></q-item-section>
                <q-item-section>Сохранить</q-item-section>
              </q-item>
              <q-item clickable @click="AudioLibrary.removePlaylist(p)" v-close-popup>
                <q-item-section avatar><q-icon name="las la-trash" /></q-item-section>
                <q-item-section>Удалить</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </template>
        <q-list class="bg2 text2">
          <template v-for="s in p.collections" :key="s.name">
            <q-item clickable tag="a" :to="`/collection/${p.name}/${s.name}`" @click="AudioLibrary.selectCollection(s)"
              :class="{ 'active ': isActive(s) }">
              <q-item-section avatar>
                <q-avatar class="bg1 text2">
                  <q-icon :name="icon(s)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ s.name }}</q-item-label>
              </q-item-section>

              <q-menu touch-position context-menu dense v-if="isActive(s)">
                <q-list>
                  <q-item>
                    <q-item-section class="text-bold text-center">Коллекция</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="AudioLibrary.addStream()" v-close-popup>
                    <q-item-section avatar><q-icon name="las la-calendar-plus" /></q-item-section>
                    <q-item-section>Добавить станцию</q-item-section>
                  </q-item>
                  <q-item clickable @click="AudioLibrary.editCollection(p, s)" v-close-popup>
                    <q-item-section avatar><q-icon name="las la-edit" /></q-item-section>
                    <q-item-section>Редактировать</q-item-section>
                  </q-item>
                  <q-item clickable @click="AudioLibrary.removeCollection(p, s)" v-close-popup>
                    <q-item-section avatar><q-icon name="las la-trash" /></q-item-section>
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </template>
        </q-list>
      </q-expansion-item>
    </template>
  </q-scroll-area>

</template>

<script setup lang="ts">
import AudioLibrary, { AudioCollection, Playlist } from './AudioLibrary';
function isActive(c: AudioCollection) {
  return c == AudioLibrary.currentCollection;
}
function icon(collection: AudioCollection) {
  if (collection.icon?.startsWith('http'))
    return 'img:' + collection.icon;
  return collection.icon || 'las la-music';
}
</script>

<style scoped></style>

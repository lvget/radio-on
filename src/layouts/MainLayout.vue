<template>
  <q-layout view="lHh lpR lFf">
    <q-header reveal class="bg1 text1">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>{{ library.currentCollection.name }}</q-toolbar-title>
        <q-space v-if="!search" />
        <q-input dense rounded outlined v-if="search" v-model="settings.searchText" input-class="text2" dark autofocus
          debounce="300" placeholder="Поиск">
          <template v-slot:append>
            <q-btn size="xs" flat round dense icon="close" @click="settings.searchText = ''; search = false"
              class="text2" />
          </template>
          <template v-slot:prepend>
            <q-icon size="xs" name="las la-search" class="text2" />
          </template>
        </q-input>

        <q-btn v-else flat dense icon="las la-search" @click="search = true" />
        <q-btn flat dense icon="las la-list-ul" @click="settings.ui.view = 'list'"
          :color="settings.ui.view === 'list' ? 'accent' : ''" />
        <q-btn flat dense icon="las la-icons" @click="settings.ui.view = 'tile'"
          :color="settings.ui.view === 'tile' ? 'accent' : ''" />
        <q-btn class="menu-btn" flat dense icon="las la-ellipsis-v" round>
          <q-menu>
            <q-list>
              <q-item clickable to="/login" v-close-popup>
                <q-item-section avatar><q-icon name="las la-user" /></q-item-section>
                <q-item-section>Вход</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable to="/about" v-close-popup>
                <q-item-section avatar><q-icon name="las la-cog" /></q-item-section>
                <q-item-section>About</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable to="/settings" v-close-popup>
                <q-item-section avatar><q-icon name="las la-cog" /></q-item-section>
                <q-item-section>Настройки</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section avatar><q-icon name="las la-palette" /></q-item-section>
                <q-item-section>Тема</q-item-section>
                <q-menu v-close-popup anchor="top right">
                  <div>
                    <q-btn flat round icon="las la-palette" />
                  </div>
                  <q-color v-model="settings.theme" no-header no-footer style="max-width: 350px" />
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg2 text2">
      <PlaylistsNavigation />
    </q-drawer>

    <q-footer class="bg1 text1">
      <AudioPlayerUI />
    </q-footer>

    <q-page-container class="bg2 text2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AudioPlayerUI from 'components/AudioPlayerUI.vue';
import PlaylistsNavigation from 'components/PlaylistsNavigation.vue';
import library from 'components/AudioLibrary';
import settings from 'src/stores/Settings';

defineOptions({
  name: 'MainLayout',
});

const leftDrawerOpen = ref(false);
const search = ref(settings.searchText.length > 0);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

</script>

<style scoped>
.search {
  width: 200px;
  height: 24px;
  border: solid 1px #ccc;
  border-radius: 10px;
  font-size: 12px;
}

.search input {
  height: 22px;
  border: none;
  background-color: transparent;
}

.search input:focus {
  outline: none !important;
}
</style>

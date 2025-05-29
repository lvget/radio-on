<template>
  <q-layout view="lHh lpR lFf">
    <q-header reveal class="bg1 text1">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>{{ library.currentCollection.name }}</q-toolbar-title>
        <q-space />
        <q-btn flat dense icon="las la-list-ul" />
        <q-btn flat dense icon="las la-icons" />
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
                  <q-color v-model="theme" no-header no-footer @change="chgColor" style="max-width: 350px" />
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
import { ref, reactive, onMounted } from 'vue';
import AudioPlayerUI from 'components/AudioPlayerUI.vue';
import PlaylistsNavigation from 'components/PlaylistsNavigation.vue';
import library from 'components/AudioLibrary';
import { setCssVar } from 'quasar'
import { HSL } from 'src/components/HSL';
import { LocalStorage, useQuasar } from 'quasar';

const theme = ref('#000');
const bg1 = ref('#000');
const bg2 = ref('#000');
const bgActive = ref('#000');
const bgAccent = ref('#000');
const bgLiter = ref('#000');
const text1 = ref('#fff');
const text2 = ref('#fff');
const textActive = ref('#fff');
const textAccent = ref('#fff');

chgColor(LocalStorage.getItem('theme') || '#131a1f');

defineOptions({
  name: 'MainLayout',
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function chgColor(color: string) {
  theme.value = color
  let hsl = HSL.fromHex(color);
  let lite = hsl.l > 50;
  bg1.value = color;
  bg2.value = hsl.clone().lighten(5 * (lite ? -1 : 1)).toHex();
  bgActive.value = hsl.clone().rotate(15).lighten(15).toHex();
  textActive.value = HSL.fromHex(bgActive.value).lighten(50).saturate(50).toHex()

  let accent = hsl.clone().rotate(120);
  accent.s = 100;
  accent.l = lite ? 25 : 75;
  bgAccent.value = accent.toHex(); //.lighten(100).toHex();
  textAccent.value = HSL.fromHex(bgAccent.value).lighten(100).toHex();

  bgLiter.value = hsl.clone().lighten(30).toHex();
  text1.value = lite ? '#000' : '#fff';
  text2.value = HSL.fromHex(bg2.value).lighten(65).toHex(); // hsl.l >50? '#000' : '#fff';

  setCssVar('accent', bgAccent.value)
  setCssVar('primary', textActive.value)

  // Для текущей сессии
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  // Для iOS
  // document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content = color;

  LocalStorage.setItem('theme', theme.value);
}

function login() {
  ;
}


</script>
<style lang="scss">
.bg1 {
  background-color: v-bind(bg1);
}

.bg2 {
  background-color: v-bind(bg2);
}

.bg-accent {
  background-color: v-bind(bgAccent);
}

.accent {
  color: v-bind(bgAccent);
}

.bg-liter {
  background-color: v-bind(bgLiter);
}

.liter {
  color: v-bind(bgLiter);
}

.text1 {
  color: v-bind(text1);
  border-color: v-bind(text1);

}

.text2 {
  color: v-bind(text2);
  border-color: v-bind(text2);
  text-shadow: 1px 1px 2px v-bind(bg1);
}

.active {
  border-color: v-bind(textActive);
  color: v-bind(textActive);
  background-color: v-bind(bgActive);
}

.bg-active {
  background-color: v-bind(bgActive);
}
</style>

<template>
  <q-layout view="lHh lpR lFf">
    <q-header reveal class="bg1 text1">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          {{ headTitle }}
        </q-toolbar-title>
        <q-btn flat dense round icon="close" to="/" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg2 text2">
      <q-scroll-area class="fit">
        <div class="column fit">
          <q-toolbar class="bg1 text1">
            <q-btn flat dense to="/" no-caps title="На главную">Radio-On</q-btn>
            <!-- <div>Radio-On</div> -->
            <q-space />
            <q-btn flat dense round icon="las la-redo-alt" @click="clearSettings" title="Сбросить настройки" />
          </q-toolbar>
          <q-space />
          <q-list>
            <q-item v-for="m in menu" :key="m.route" :to="m.route" @click="selectMenu(m)" clickable>
              <q-item-section avatar>
                <q-icon :name="m.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ m.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </div>
      </q-scroll-area>
    </q-drawer>

    <q-footer class="bg1 text1">
      <q-separator class="bg2" />
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

defineOptions({
  name: 'SettingsLayout',
});

const menu = [{
  title: 'Sound',
  icon: 'las la-headphones',
  route: 'sound'
},
{
  title: 'Theme',
  icon: 'las la-palette',
  route: 'ui'
},
{
  title: 'Authorization',
  icon: 'las la-universal-access',
  route: 'login'
},
{
  title: 'About',
  icon: 'las la-info',
  route: 'about'
}
]
const leftDrawerOpen = ref(false);
const headTitle = ref('Settings');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function selectMenu(m: any) {
  headTitle.value = m.title
}
function clearSettings() {
  localStorage.clear();
  location.reload();
}
</script>

<style scoped></style>

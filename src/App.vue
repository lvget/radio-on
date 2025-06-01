<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import settings from 'src/stores/Settings';
import { setCssVar, AddressbarColor } from 'quasar'
import { HSL } from 'src/utils/HSL';

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

  AddressbarColor.set(color)

  // Для текущей сессии
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  // Для iOS
  // document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').content = color;

}

watch(() => settings.theme, chgColor);

chgColor(settings.theme);

defineOptions({
  name: 'App',
});
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

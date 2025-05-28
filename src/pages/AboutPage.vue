<template>
  <q-page padding>
    <div style="width: 90%; max-width: 800px; margin: 0 auto;">
      <q-card class="bg1">
        <q-card-section>
          <div class=text-h4>Radio On</div>
          <div class=text-subtitle2>https://radio-on.web.app </div>
          <div class=caption>Сборник интернет-радио станций </div>
        </q-card-section>

        <q-separator inset color="primary" />

        <q-card-section>
          <div>version: {{ version.ver }}</div>
          <div>build: {{ version.time }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps @click="share" color="primary" icon="las la-share">Share</q-btn>
          <q-space />
          <q-btn flat no-caps @click="checkVersion">Проверить обновление</q-btn>
          <q-btn flat no-caps v-if="newVer" @click="update" color="accent">Update ({{ newVer.ver }})</q-btn>
        </q-card-actions>

      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Notify, copyToClipboard } from 'quasar'
import version from '../../version.json';

const newVer = ref<any>(null);

defineOptions({
  name: 'AboutPage',
});

function checkVersion() {
  fetch('/version.json?_=' + Date.now())
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let isNew = data.ver > version.ver;
      if (isNew)
        newVer.value = data;

      Notify.create({
        message: isNew ? `Новая версия доступна (${data.ver})` : 'Версия актуальна',
        icon: isNew ? 'warning' : 'done',
        color: 'positive',
        position: 'top',
      })
    }).catch((error) => {
      Notify.create({
        message: 'Ошибка проверки обновления',
        caption: error.toString(),
        icon: 'error',
        color: 'negative',
        position: 'top',
      })
      console.error(error);
    })
}

function forceSWupdate(): Promise<void> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.update()
        }
        resolve()
      })
    }
    else {
      resolve()
    }
  })
}

function update() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.update()
      }

      window.location.reload()
    })
  }
  else {
    window.location.reload()
  }
}

function share() {
  let url = 'https://radio-on.web.app';
  if (navigator.share) {
    navigator.share({
      title: 'Radio On',
      url
    })
      .then(() => { ; })
      .catch(console.error);
  } else {
    copyToClipboard(url).then(() => {

      Notify.create({
        message: 'Адрес скопирован в буфер обмена',
        position: 'top',
      })

    });
  }
}

</script>

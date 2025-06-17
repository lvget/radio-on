<template>
  <q-page padding>
    <q-scroll-area style="height: 100vh;">
      <div style="width: 90%; max-width: 500px; margin: 0 auto;">
        <q-card class="bg1 q-mb-md">
          <q-card-section>
            <div class=text-h6>Цветовая тема</div>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-ma-xs">Основной цвет</div>
            <q-color v-model="settings.theme" no-header no-footer
              style="width: 80%; max-width: 250px; margin: 0 auto;" />
          </q-card-section>
        </q-card>

        <q-card class="bg1 q-mb-md">
          <q-card-section>
            <div class="text-h6">Плейлист</div>
          </q-card-section>
          <q-card-section>
            <div class="column">
              <div class="row items-center no-wrap q-gutter-md q-mb-md">
                <div>Вид: </div>
                <q-btn flat dense icon="las la-list-ul" @click="settings.ui.view = 'list'"
                  :color="settings.ui.view === 'list' ? 'accent' : ''" label="Список" />
                <q-btn flat dense icon="las la-icons" @click="settings.ui.view = 'tile'"
                  :color="settings.ui.view === 'tile' ? 'accent' : ''" label="Плитка" />
              </div>

              <q-toggle v-model="settings.ui.showUrl" label="Показывать URL потока" />
              <q-toggle v-model="settings.ui.showAll" label="Показывать пустые плейлисты" />


              <!-- <q-select filled dense v-model="settings.ui.view" behavior="menu" emit-value
                :options="[{ label: 'Список', value: 'list' }, { label: 'Плитка', value: 'tile' }]"
                label="Вид плейлиста" /> -->
            </div>
          </q-card-section>
        </q-card>
      </div>

    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import settings from 'src/stores/Settings';

defineOptions({
  name: 'SettingsPage',
});
</script>

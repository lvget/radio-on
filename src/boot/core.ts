import { boot } from 'quasar/wrappers';
import 'components/MediaMetadata';
import AudioLibrary from '../components/AudioLibrary';
import { watch } from 'vue';
import { loadSettings, saveSettings } from 'src/stores/Settings';

export default boot(async ({ app, router }) => {
  loadSettings();

  window.addEventListener('beforeunload', () => {
    saveSettings();
  });

  watch(
    () => AudioLibrary.currentStream,
    (v) => {
      document.title = v.name;
    }
  );
});

import { boot } from 'quasar/wrappers';
//import { createPinia } from 'pinia'
import 'components/MediaMetadata';
import AudioLibrary from '../components/AudioLibrary';
import { watch } from 'vue';

export default boot(async ({ app, router }) => {
  //const pinia = createPinia()
  //app.use(pinia)

  watch(
    () => AudioLibrary.currentStream,
    (v) => {
      console.log(AudioLibrary.currentStream);
      document.title = AudioLibrary.currentStream.name;
    }
  );
});

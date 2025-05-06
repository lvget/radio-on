import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia'
import 'components/MediaMetadata'

export default boot(async ({ app, router }) => {
  const pinia = createPinia()
  app.use(pinia)
});
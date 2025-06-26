import { Loading as loading } from 'quasar'

export const Loading = {
  show(message = '', subMess = '') {
    if (!message)
      loading.show();
    else
      loading.show({ message: `${message}...<br><span class="text-amber text-italic">${subMess}</span>`, html: true });
  },
  hide() {
    loading.hide();
  }
}
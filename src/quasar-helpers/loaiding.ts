import { Loading as loading } from 'quasar'

export const Loading = {
  show(message: string = '', submess: string = ''){
    if(!message) 
      loading.show();
    else
      loading.show({ message:`${message}...<br><span class="text-amber text-italic">${submess}</span>`, html: true });
  },
  hide(){
    loading.hide();
  }
}
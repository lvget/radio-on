import { LocalStorage } from 'quasar';
import { reactive } from 'vue';

type Settings = {
  volume: number;
  theme: string;
  searchText: string;
  ui: {
    view: 'list' | 'tile';
    showAll: boolean;
    showUrl: boolean;
  };
};

let settings = reactive<Settings>({
  volume: 100,
  theme: '#131a1f',
  searchText: '',
  ui: {
    view: 'list',
    showAll: true,
    showUrl: true,
  },
});

export function loadSettings() {
  Object.assign(settings, LocalStorage.getItem('settings') || {});
}

export function saveSettings() {
  LocalStorage.set('settings', settings);
}
export default settings;

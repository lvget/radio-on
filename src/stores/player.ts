import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    src: '',
  }),
  getters: {
    getSrc: (state) => state.src,
  },

  actions: {},
});

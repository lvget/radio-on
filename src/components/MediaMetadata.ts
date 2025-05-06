import { watch } from 'vue';
import { player } from './Audio';
import streamData from './StreamData';
import AudioLibrary from './AudioLibrary';

if ('mediaSession' in navigator) {
  let metadata = new MediaMetadata({
    title: 'radio-on.web.app',
    artist: '',
    album: '',
    artwork: [
      {
        src: 'https://radio-on.web.app/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: 'https://radio-on.web.app/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });

  watch(
    () => streamData.title,
    (title) => {
      metadata.artist = title;
    }
  );
  watch(
    () => streamData.image,
    (img) => {
      metadata.artwork[0].src = img;
      metadata.artwork[1].src = img;
    }
  );
  watch(
    () => AudioLibrary.currentStream,
    (stream) => {
      metadata.title = stream.name;
    }
  );

  navigator.mediaSession.metadata = metadata;
  navigator.mediaSession.setActionHandler('play', () => {
    player.play();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    player.pause();
  });
  navigator.mediaSession.setActionHandler('stop', () => {
    player.stop();
  });
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    /* Code excerpted. */
  });
  navigator.mediaSession.setActionHandler('seekforward', () => {
    /* Code excerpted. */
  });
  navigator.mediaSession.setActionHandler('seekto', () => {
    /* Code excerpted. */
  });
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    AudioLibrary.prevStream();
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    AudioLibrary.nextStrem();
  });
}

import { watch } from 'vue';
import { player } from './Audio';
import streamData from './StreamData';
import AudioLibrary from './AudioLibrary';

if ('mediaSession' in navigator) {
  const defaultArtwork256 = 'https://radio-on.web.app/img/dynamic.png';
  const defaultArtwork512 = 'https://radio-on.web.app/img/dynamic.png';

  let metadata = {
    title: 'radio-on.web.app',
    artist: '',
    album: '',
    artwork: [
      {
        src: defaultArtwork256,
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: defaultArtwork512,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  watch(
    () => streamData,
    (data) => {
      metadata.artist = data.title;
      metadata.artwork[0].src = data.image || defaultArtwork256;
      metadata.artwork[1].src = data.image || defaultArtwork512;
      navigator.mediaSession.metadata = new MediaMetadata(metadata);
    },
    { deep: true }
  );

  watch(
    () => AudioLibrary.currentStream,
    (stream) => {
      //console.log('AudioLibrary.currentStream', stream);
      metadata.title = stream.name;
      metadata.artwork[0].src = stream.img || defaultArtwork256;
      metadata.artwork[1].src = stream.img || defaultArtwork512;
      navigator.mediaSession.metadata = new MediaMetadata(metadata);
    }
  );

  navigator.mediaSession.metadata = new MediaMetadata(metadata); //metadata;
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
    AudioLibrary.nextStream();
  });
}

<template>
  <!-- <div class=""></div> -->
    
    <canvas id="fft" style="background-color: aqua;" class="fit">
    <q-resize-observer @resize="onResize" />
    </canvas>
  
  
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { player } from './Audio';

const audio = player.getAudio();
const streamData = new Uint8Array(128);
const context = new AudioContext();
const analyser = context.createAnalyser();
analyser.fftSize = 256;
try{
  context.createMediaElementSource(audio).connect(analyser);
  analyser.connect(context.destination);
}
catch(e){
  console.error(e);
}  

let width = 0, height = 0, barWidth = 0;
let canvas: HTMLCanvasElement|null = null;// = document.querySelector('canvas#fft') as HTMLCanvasElement;
let timer = window.setInterval(() => {
      analyser.getByteFrequencyData(streamData);
    }, 20);

onMounted(() => {
  canvas = document.querySelector('canvas#fft') as HTMLCanvasElement;

  if(canvas){
    //onResize({width: canvas.parentElement?.clientWidth||0, height: canvas.parentElement?.clientHeight||0})
    init();
    draw(streamData, canvas);
  } 
})

onBeforeUnmount(() => {
  if(timer) window.clearInterval(timer);
})

function onResize(size: {width: number, height: number}) {
  console.log(size)
  width = size.width;
  height = size.height;
  if(canvas){
    canvas.width = size.width
    canvas.height = size.height
    //init();
  }
}

function init(){
  if(canvas){
    //canvas.width = window.innerWidth;
    // width = canvas.width;
    // height = canvas.height;
    // barWidth = (width / streamData.length) * 2.5;
  }
}

let draw = (buffer: Uint8Array, canvas: HTMLCanvasElement) => {

const ctx = canvas.getContext('2d');
if(!ctx) return;
// const { width, height } = canvas;
// const barWidth = (width / buffer.length) * 2.5;
let barHeight;
let x = 0;

let draw = () => {

  x = 0;
  ctx.fillStyle = '#1976d2';
  ctx.fillRect(0, 0, width, height);

  buffer.forEach((_height) => {
    barHeight = _height * 0.6;
    ctx.fillStyle = '#3c90ce';
    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  });

  requestAnimationFrame(draw);
}

draw();

};







</script>

<style scoped>

</style>
// import { reactive } from 'vue';

// export default reactive({
//   bg: '#000000',
//   bg2: '#000000',
//   text: '#ffffff',
//   text2: '#ffffff',
//   acsent: '#f00',
//   init(color: string){
//     this.bg = color;
//   }
// });

function border(v: number, min: number, max: number): number {
  if (v > max) v = min + v % max
  else if (v < min) v = max - v % max
  return v
}

export class HSL {
  constructor(
      public h: number,
      public s: number,
      public l: number
  ) { }

  static fromHex(hex: string) {
      let h = 0, s = 0, l = 0
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
          let r = parseInt(result[1], 16)
          let g = parseInt(result[2], 16)
          let b = parseInt(result[3], 16)
          r /= 255, g /= 255, b /= 255;
          let max = Math.max(r, g, b), min = Math.min(r, g, b);
          l = (max + min) / 2;
          if (max == min) {
              h = s = 0; // achromatic
          }
          else {
              let d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch (max) {
                  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                  case g: h = (b - r) / d + 2; break;
                  case b: h = (r - g) / d + 4; break;
              }
              h /= 6;
          }

          h = Math.round(360 * h)
          s = Math.round(100 * s)
          l = Math.round(100 * l)
      }
      else {
          result = /^hsl\(([0-9]{1,3}) ([0-9]{1,3})% ([0-9]{1,3})%\)$/.exec(hex)
          if (result) {
              h = parseInt(result[1], 10)
              s = parseInt(result[2], 10)
              l = parseInt(result[3], 10)
          }
      }

      return new HSL(h, s, l)
  }

  clone() {
      return new HSL(this.h, this.s, this.l)
  }

  css() {
      return `hsl(${this.h} ${this.s}% ${this.l}%)`
  }

  toRgb() {
      let h = this.h / 360
      let s = this.s / 100
      let l = this.l / 100
      let r, g, b;

      if (s == 0) {
          r = g = b = l; // achromatic
      }
      else {
          let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
          }

          let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          let p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  toHex() {
      return '#' +
          this.toRgb().map(x => {
              let s = x.toString(16)
              if (s.length < 2) s = '0' + s
              return s
          }).join('')
  }

  rotate(v = 10) {
      this.h = border(this.h + v, 0, 360)
      return this
  }

  lighten(v = 10) {
      if (this.l > 50) this.l -= v
      else this.l += v
      this.l = border(this.l, 0, 100)
      return this
  }

  saturate(v = 10) {
      if (this.s > 50) this.s -= v
      else this.s += v
      this.s = border(this.s, 0, 100)
      return this
  }

  correct(target: HSL, from: HSL) {
      let dh = target.h - from.h
      target.h = border(this.h + dh, 0, 360)
      //let dl = target.l - from.l
      //target.l = border(this.l + dl, 0, 100)
      return target
  }
}

import RgbToHsl from "./RgbToHsl.js";
import random from "./Random.js";

export default class Agent {

    constructor(x, y, color, bit, wOb) {
        this.x = x;
        this.y = y;
        this.sy = null;
        this.color = this.setColor(color);
        this.step = 5;
        this.bit = bit;
        this.wOb = wOb;
    }

    setColor(arr) {
        let r = (arr.reduce((a,n) => a + n[0], arr[0][0]) / arr.length)
        let g = (arr.reduce((a,n) => a + n[1], arr[0][1]) / arr.length)
        let b = (arr.reduce((a,n) => a + n[2], arr[0][1]) / arr.length)
        let [h,s,l] = RgbToHsl(...[r,g,b]).map(e => e.toFixed());
        return [[r,g,b], [h,s,l]];
    }

    setSize(bright, contrast, size) {
        let f = (l) => l = l < 1 ? 1 : l > 99 ? 99 : l
        let con = (l,f = false) => {
            let a = l + ( !f ? (contrast * 0.2) : -(contrast * 0.2) )
            return a = contrast < 0 ? f ? a > 50 ? 50 : a : a < 50 ? 50 : a : a
        }

        let l = Number(this.color[1][2]) + Number(bright)
        l = f(l)
        l = l > 50 ? con(l) : con(l, true);
        l = f(l);

        let m = [];
        for (let i = 1; i <= this.bit; i++) {
            m.push(size / this.bit * i);
        }
        m.unshift(0)

        let i = this.wOb? Math.floor( (m.length * l) / 100 ) : Math.ceil((m.length * l) / 100 )
        return this.wOb ? m[ i ] : m.at( -i );
    }

    colorized(colored) {
        let m = [];
        for (let i = 1; i <= this.bit; i++) {
            m.push(255 / this.bit * i);
        }
        m.unshift(0)
        let [r,g,b] = [m [ Math.floor(m.length * this.color[0][0] / 255) ],
                       m [ Math.floor(m.length * this.color[0][1] / 255) ],
                       m [ Math.floor(m.length * this.color[0][2] / 255) ],]
        let color = colored ? `rgb(${[r,g,b]})`
                            : this.wOb ? `rgb(200,200,200)` : `rgb(10,10,10)`;
        return color;
    }

    draw(ctx, colored, bright, contrast, size, chaotic) {
        let a = this.setSize(bright, contrast, size);
        if (a == 0) return;
        ctx.fillStyle = this.colorized(colored);
        let rand = size * chaotic
        let [x,y] = [this.x + random(-rand, rand), this.y + random(-rand, rand)]

        ctx.beginPath();
        ctx.arc(x, y, a, 0, 2* Math.PI);
        ctx.fill();

        //if (random(0,100) < 20) {
        //    this.step--
        //    if (!this.step) return
        //    this.draw(ctx, colored, bright, contrast, size, chaotic)
        //};
    }

}
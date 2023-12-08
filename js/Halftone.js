import Agent from "./Agent.js";

export default class Halftone {

    constructor(canvas) {
        this.canvas       = canvas;
        this.ctx          = this.canvas.getContext('2d', { willReadFrequently: true });
        this.data         = null;
        this.matrix       = null;
        this.mass         = [];
        this.canvasScale = 1;
        
        this.count     = 10;
        this.size      = 10;
        this.w         = null;
        this.h         = null;
        this.bright    = 0;
        this.colored   = false;
        this.bright    = 0;
        this.contrast  = 0;
        this.imgSize   = 500;
        this.chaotic   = 0.5;
        this.bit       = 8;
        this.wOb       = true;
    }

    resize(v, video) {
        let limit = 0.9;
        this.w = Math.floor(v.w * limit)
        this.h = Math.floor(v.h * limit)
        if (this.w >= innerWidth * limit || this.h >= innerHeight * limit) {
            this.resize({w: this.w, h: this.h})
        } else {
            this.canvas.width = this.w
            this.canvas.height = this.h

            return
        }
    }

    makeMatrix(uint8Array, width, height) {
        let matrix = []
        let indx = 0
        for (let i = 0; i < height; i++) {
          matrix.push([]);
          for (let j = 0; j < width * 4; j+=4) {
            matrix[i].push([uint8Array[indx+0],
                            uint8Array[indx+1],
                            uint8Array[indx+2],
                            uint8Array[indx+3]]);
            indx+=4
          }
        }

        return matrix
    }

    pushPixels() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        for (let y = 0; y < this.matrix.length; y+=this.count) {
            for (let x = 0; x < this.matrix[y].length; x += this.count) {
                let p = []
                for(let iy = 0; iy < this.count; iy++) {
                    for(let ix = 0; ix < this.count; ix++) {
                        if (this.matrix[y+iy] && this.matrix[y+iy][x+ix] && !this.matrix[y+iy][x+ix].includes(undefined)) {
                            p.push(this.matrix[y+iy][x+ix])
                        }
                    }
                }
                if (!p.length) continue
                let agent = new Agent(x, y, p, this.bit, this.wOb);
                agent.draw(this.ctx, this.colored, this.bright, this.contrast, this.size, this.chaotic);
            }
        }
    }

    draw(video) {
        this.canvas.width =  this.w * this.canvasScale
        this.canvas.height = this.h * this.canvasScale

        this.ctx.drawImage(video, 0, 0, this.w, this.h);
        this.data = this.ctx.getImageData(0, 0, this.w, this.h);

        this.ctx.scale(this.canvasScale, this.canvasScale)
        this.matrix = this.makeMatrix(this.data.data, this.w, this.h)

        this.pushPixels();

        //this.makeTag(this.tagX, this.tagY)
    }

    init() {
        this.canvas.imageSmoothingEnabled = false;

        this.addControls();

    }

    addControls() {
        document.getElementById(`canvasScale`).addEventListener('input', (e) => {
            document.querySelector(`.canvasScale-txt`).innerHTML = `canvasScale: ` + e.target.value;
            this.canvasScale = Number(e.target.value);
        })


        document.querySelectorAll('.inp_p input').forEach((e,i) => {
            e.addEventListener('input', el => {
                let val = Number(el.target.value);
                el.target.previousElementSibling.innerHTML = val;
                i == 0 ? this.count    = val :
                i == 1 ? this.size     = val :
                i == 2 ? this.bright   = val :
                i == 3 ? this.contrast = val :
                i == 4 ? this.chaotic  = val :
                i == 5 ? this.bit  = val : null
            });
        });

        document.querySelector('#colored').onclick = ({target}) => {
            this.colored = !this.colored;
            target.innerHTML = this.colored ? 'Colored' : 'Monochrome'
        }

        document.querySelector('#wob').onclick = ({target}) => {
            this.wOb = !this.wOb;
            target.innerHTML = this.wOb ? 'White on Black' : 'Black On White';
            target.style.cssText = this.wOb ? '' : 'background-color: white; color: rgb(10,10,10)';
            this.canvas.style.backgroundColor = this.wOb ? 'rgba(200,200,200,0)' : 'rgba(200,200,200,1)';
        }
        
    }

}
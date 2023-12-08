export default class VideoLoader {

    constructor(input, video) {
        this.input  = input;
        this.block  = video;
        this.file   = null;
        this.size   = {w: 0, h: 0}
    }

    getSize() {
        return this.size
    }

    init(canvas, main) {
        this.input.addEventListener('change', () => {
            this.file = this.input.files[0];
            if (!this.file.type.includes('video')) {
                console.log('file type not video');
                return
            }
            
            let videourl = URL.createObjectURL(this.file);
            this.block.setAttribute("src", videourl);
            setTimeout(() => {
                this.size.w = this.block.videoWidth
                this.size.h = this.block.videoHeight

                this.block.width = this.size.w;
                this.block.height = this.size.h;

                canvas.resize(this.getSize())

                this.block.width = canvas.w;
                this.block.height = canvas.h;               
                
                main.controls.time.max = this.block.duration
            }, 1000)
        })

        this.block.addEventListener('play', () => {
            console.log('play')
            main.process();
        })

        Array.from(document.querySelector('.resizing').children).forEach((e,i) => {
            e.addEventListener('click', () => {
                if (i == 1) {
                    canvas.w = this.block.width  = Math.floor(this.block.width * 1.1)
                    canvas.h = this.block.height = Math.floor(this.block.height * 1.1)
                } else {
                    canvas.w = this.block.width  = Math.floor(this.block.width * 0.9)
                    canvas.h = this.block.height = Math.floor(this.block.height * 0.9)
                }
            })
        })
    }

}
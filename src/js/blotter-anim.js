import imagesLoaded from 'imagesloaded'
import WebFont from 'webfontloader'

export default function blotterAnim() {
    const MathUtils = {
        lineEq: (y2, y1, x2, x1, currentVal) => {
            // y = mx + b 
            var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
            return m * currentVal + b;
        },
        lerp: (a, b, n) =>  (1 - n) * a + n * b
    };
    
    class Renderer {
        constructor(options, material) {
            this.options = options;
            this.material = material;
            for (let i = 0, len = this.options.uniforms.length; i <= len-1; ++i) {
                this.material.uniforms[this.options.uniforms[i].uniform].value = this.options.uniforms[i].value;
            }
            for (let i = 0, len = this.options.animatable.length; i <= len-1; ++i) {
                this[this.options.animatable[i].prop] = this.options.animatable[i].from;
                this.material.uniforms[this.options.animatable[i].prop].value = this[this.options.animatable[i].prop];
            }
            this.currentScroll = window.pageYOffset;
            this.maxScrollSpeed = 80;
            requestAnimationFrame(() => this.render());
        }
        render() {
            const newScroll = window.pageYOffset;
            const scrolled = Math.abs(newScroll - this.currentScroll);
            for (let i = 0, len = this.options.animatable.length; i <= len-1; ++i) {
                this[this.options.animatable[i].prop] = MathUtils.lerp(this[this.options.animatable[i].prop], Math.min(MathUtils.lineEq(this.options.animatable[i].to, this.options.animatable[i].from, this.maxScrollSpeed, 0, scrolled), this.options.animatable[i].to), this.options.easeFactor);
                this.material.uniforms[this.options.animatable[i].prop].value = this[this.options.animatable[i].prop];
            }
            this.currentScroll = newScroll;
            requestAnimationFrame(() => this.render());
        }
    }

    class RollingDistortMaterial {
        constructor(options) {
            this.options = {
                uniforms: [
                    {
                        uniform: 'uSineDistortSpread', 
                        value: 0.354
                    },
                    {
                        uniform: 'uSineDistortCycleCount', 
                        value: 5
                    },
                    {
                        uniform: 'uSineDistortAmplitude', 
                        value: 0
                    },
                    {
                        uniform: 'uNoiseDistortVolatility', 
                        value: 0
                    },
                    {
                        uniform: 'uNoiseDistortAmplitude', 
                        value: 0.168
                    },
                    {
                        uniform: 'uDistortPosition', 
                        value: [0.38,0.68]
                    },
                    {
                        uniform: 'uRotation', 
                        value: 48
                    },
                    {
                        uniform: 'uSpeed', 
                        value: 0.421
                    }
                ],
                animatable: [
                    {prop: 'uSineDistortAmplitude', from: 0, to: 0.5}
                ],
                easeFactor: 0.05
            };
            Object.assign(this.options, options);
            this.material = new Blotter.RollingDistortMaterial();
            new Renderer(this.options, this.material);
            return this.material;
        }
    }

    class Material {
        constructor(type, options = {}) {
            let material;
            switch (type) {
                case 'RollingDistortMaterial':
                    material = new RollingDistortMaterial(options);
                    break;
            }
            return material;
        }
    }

    class BlotterEl {
        constructor(el, options) {
            this.DOM = {el: el};
            this.DOM.textEl = this.DOM.el.querySelector('span');
            const fontFamily = this.DOM.el.dataset.font || 'ogg'
            this.style = {
                family : `"${fontFamily}",serif`,
                size : 80,
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 40,
                paddingBottom: 40,
                fill : this.DOM.el.dataset.colour || "#ff4e00"
            };
            Object.assign(this.style, options.style);

            this.material = new Material(options.type, options);
            this.text = new Blotter.Text(this.DOM.textEl.innerHTML, this.style);
            this.blotter = new Blotter(this.material, {texts: this.text});
            this.scope = this.blotter.forText(this.text);
            this.DOM.el.removeChild(this.DOM.textEl);
            this.scope.appendTo(this.DOM.el);

            const observer = new IntersectionObserver(entries => entries.forEach(entry => this.scope[entry.isIntersecting ? 'play' : 'pause']()));
            observer.observe(this.scope.domElement);
        }
    }

    const config = {
        type: 'RollingDistortMaterial',
        uniforms: [
            {
                uniform: 'uSineDistortSpread', 
                value: .5
            },
            {
                uniform: 'uSineDistortCycleCount', 
                value: 3
            },
            {
                uniform: 'uSineDistortAmplitude', 
                value: 0.001
            },
            {
                uniform: 'uNoiseDistortVolatility', 
                value: 5
            },
            {
                uniform: 'uNoiseDistortAmplitude', 
                value: 0.1
            },
            {
                uniform: 'uDistortPosition', 
                value: [0.5,0]
            },
            {
                uniform: 'uRotation', 
                value: 180
            },
            {
                uniform: 'uSpeed', 
                value: 1
            }
        ],
        animatable: [
            {prop: 'uNoiseDistortAmplitude', from: 0.0, to: 0.8}
        ],
        easeFactor: 0.05
    }

    WebFont.load({
        custom: {
            families: ['ogg']
        },
        active: () => [...document.querySelectorAll('[data-blotter]')].forEach((el) => new BlotterEl(el, config))
    })
    // Preload all the images in the page.
    imagesLoaded(document.querySelectorAll('.grid__item-img'), {background: true}, () => {
        document.body.classList.remove('loading');
    })
}
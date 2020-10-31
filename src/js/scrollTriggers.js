import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const setupTriggers = () => {

    const introSection = document.querySelector('.intro')
    if (!introSection) return false

    gsap.from(".clubbersLogo", {
        scale: 2.75,
        x: '50vw',
        y: 300,
        rotate: -40,
        xPercent: -50,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: introSection,
          start: "top top",
          end: "bottom center",
          scrub: 1,
        //   markers: true
        }
    })
    
    gsap.to(".intro__fg", {
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: introSection,
          start: "top top",
          end: "+30px top",
          scrub: 1,
        //   markers: true
        }
    })

    gsap.from(".intro__datas .emdash", {
      width: '4em',
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.intro__datas',
        start: "top bottom",
        end: "bottom center",
        scrub: 1,
        // markers: true
      }
  })

    let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter("[data-skew]", "skewY", "deg"), // fast
    clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees. 

    ScrollTrigger.create({
    onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
        }
    }
    });

    // make the right edge "stick" to the scroll bar. force3D: true improves performance
    gsap.set(".skewElem", {transformOrigin: "right center", force3D: true});

}
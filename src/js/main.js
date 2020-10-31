import blotterAnim from './blotter-anim'
import {setupTriggers} from './scrollTriggers'
import Splitting from 'splitting'
import Flickity from 'flickity'

blotterAnim()
setupTriggers()
Splitting()

new Flickity( document.querySelector('.carousel'), {
    cellAlign: 'center',
    contain: false
})

document.querySelectorAll('.faq .view').forEach(view => view.addEventListener('click', e => e.target.closest('dt').classList.toggle('open')))
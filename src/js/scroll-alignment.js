import '../scss/scroll-alignment.scss';
import * as ScrollMagic from 'scrollmagic';
import { TweenMax, TimelineMax } from 'gsap';
import { ScrollMagicPluginGsap, ScrollMagicPluginIndicator } from 'scrollmagic-plugins';

// Add plugins
ScrollMagicPluginIndicator(ScrollMagic);
ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax);

// init controller
const controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({ triggerElement: '.start-sphere', duration: 1000, offset: 700 })
  .setPin('.pin')
  .addIndicators({ name: '1 (duration: 0)' }) // add indicators (requires plugin)
  .addTo(controller);

new ScrollMagic.Scene({ triggerElement: '.start-sphere', duration: 500, offset: 700 })
  .setTween('.sphere', 0.5, { scale: 0.050 }) // the tween duration can be omitted and defaults to 1
  .addIndicators({ name: '1 (duration: 0)' }) // add indicators (requires plugin)
  .addTo(controller);

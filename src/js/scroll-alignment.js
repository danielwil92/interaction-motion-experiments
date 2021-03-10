import '../scss/scroll-alignment.scss';
import { gsap } from 'gsap/all';

const SELECTORS = {
  START: '.intro',
  DOT: '.word__ball',
};

const CONFIG = {
  MAX_BALL_SCALE: 70,
};

const $start = document.querySelector(SELECTORS.START);
const circleSpeed = 0.3;

function calculateDotScale(scrollAmount) {
  // Animation Percentaje
  const percentageScrolled = ((scrollAmount * 100) / CONFIG.START_ANIMATION.FINISH)
    .toFixed(3);
  // How much has passed of the max
  const prevScale = (percentageScrolled * CONFIG.MAX_BALL_SCALE) / 100;

  // Revert 100% is 1 and 0% is CONFIG.MAX_BALL_SCALE
  return (CONFIG.MAX_BALL_SCALE - prevScale) + 1;
}

function animateDot(scrollAmount) {
  return gsap.to(
    SELECTORS.DOT,
    {
      duration: circleSpeed,
      scale: calculateDotScale(scrollAmount),
    },
  );
}

function animateOnScroll() {
  const scrollAmount = window.pageYOffset + (window.innerHeight / 2);

  if (scrollAmount > CONFIG.START_ANIMATION.START
    && scrollAmount < CONFIG.START_ANIMATION.FINISH) {
    animateDot(scrollAmount);
  }
}

function getBoundaries() {
  const { height } = $start.getBoundingClientRect();

  CONFIG.START_ANIMATION = {
    START: height,
    FINISH: height + 1000,
  };
}

getBoundaries();
window.addEventListener('scroll', animateOnScroll);

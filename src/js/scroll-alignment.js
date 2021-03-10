import '../scss/scroll-alignment.scss';
import { gsap } from 'gsap/all';

const SELECTORS = {
  START: '.intro',
  WORD: '.word',
  DOT: '.word__ball',
  LETTERS: '.word__character, .word__single',
};

const CONFIG = {
  DOT: {
    MAX_SCALE: 80,
    SPEED: 0.3,
  },
  WORD: {
    SPEED: 0.2,
  },
  LETTERS: {
    SPEED: 0.2,
  },
  SCREEN: {
    HALF: window.innerHeight / 2,
  },
};

const $start = document.querySelector(SELECTORS.START);
const $word = document.querySelector(SELECTORS.WORD);
const $dot = document.querySelectorAll(SELECTORS.DOT);
const $letters = [];

function calculateDotUnit(scrollAmount, min, max) {
  // Animation Percentage
  const percentageScrolled = ((scrollAmount * 100) / CONFIG.DOT.FINISH)
    .toFixed(3);
  // How much has passed of the max
  const prevScale = (percentageScrolled * max) / 100;

  // Revert 100% is 1 and 0% is CONFIG.MAX_BALL_SCALE
  return (CONFIG.DOT.MAX_SCALE - prevScale) + min;
}

function animateDot(scrollAmount) {
  return gsap.to(
    $dot,
    {
      duration: CONFIG.DOT.SPEED,
      scale: calculateDotUnit(scrollAmount, 1, CONFIG.DOT.MAX_SCALE),
      bottom: `${calculateDotUnit(scrollAmount, 10, CONFIG.SCREEN.HALF + 100)}%`,
    },
  );
}

function animateWord(scrollAmount) {
  return gsap.to(
    $word,
    {
      duration: CONFIG.WORD.SPEED,
      y: Math.ceil((scrollAmount * 100) / CONFIG.WORD.FINISH),
    },
  );
}

function animateYOnLetter(percentage) {
  return 100 - (percentage * 100);
}

function animateLetter(scrollAmount) {
  const getTimelineInit = (number) => number - CONFIG.LETTERS.START;
  const scrollPercentageCompleted = Math.ceil(
    (getTimelineInit(scrollAmount) * 100) / getTimelineInit(CONFIG.LETTERS.FINISH),
  );
  const timeline = scrollPercentageCompleted / CONFIG.LETTERS.TIMELINE.TIME_FOR_EACH;
  const letter = $letters[Math.floor(timeline)];
  let letterTimeline = timeline % 1;

  if (letterTimeline > 0.95) {
    letterTimeline = 1;
  }

  if (letterTimeline < 0.15) {
    letterTimeline = 0;
  }

  gsap.to(
    letter,
    {
      duration: CONFIG.LETTERS.SPEED,
      y: `${animateYOnLetter(letterTimeline)}%`,
      opacity: letterTimeline,
    },
  );
}

function animateOnScroll() {
  const scrollAmount = window.pageYOffset + CONFIG.SCREEN.HALF;

  if (scrollAmount >= CONFIG.DOT.START
    && scrollAmount <= CONFIG.DOT.FINISH) {
    animateDot(scrollAmount);
  }

  if (scrollAmount >= CONFIG.WORD.START
    && scrollAmount <= CONFIG.WORD.FINISH) {
    animateWord(scrollAmount);
  }

  if (scrollAmount >= CONFIG.LETTERS.START
    && scrollAmount <= CONFIG.LETTERS.FINISH) {
    animateLetter(scrollAmount);
  }
}

/**
 * Set the Timeline Animation based on .intro element
 */
function setTimeline() {
  const { height } = $start.getBoundingClientRect();

  CONFIG.DOT.START = height / 2;
  CONFIG.DOT.FINISH = height + 400;

  CONFIG.WORD.START = CONFIG.DOT.START;
  CONFIG.WORD.FINISH = CONFIG.WORD.START + 300;

  CONFIG.LETTERS.START = CONFIG.DOT.START + 400;
  CONFIG.LETTERS.FINISH = CONFIG.LETTERS.START + 800;

  // Get Letters
  document.querySelectorAll(SELECTORS.LETTERS).forEach((letter) => {
    $letters.push(!letter.classList.contains('word__character--wrapper')
      ? letter : letter.querySelector('.word__single'));
  });
  // SET TIMELINE CONFIG
  CONFIG.LETTERS.TIMELINE = {
    TIME_FOR_EACH: 100 / $letters.length,
    LENGTH: CONFIG.LETTERS.FINISH - CONFIG.LETTERS.START,
  };

  // Set Initial State for Animation
  animateOnScroll(window.pageYOffset);
}

setTimeline();
window.onscroll = animateOnScroll;

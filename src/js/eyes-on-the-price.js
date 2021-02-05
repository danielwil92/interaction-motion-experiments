// shared module
import '../scss/eyes-on-the-price.scss';

/**
 * Selectors
 * @enum {string}
 */
const SELECTORS = {
  BALL: '.ball',
  WRAPPER: '.follow-ball',
};

/**
 * Easing Options
 * @enum {function(number):number}
 */
const EASING = {
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t), // eslint-disable-line no-plusplus, no-param-reassign, max-len
  inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t), // eslint-disable-line no-plusplus, no-param-reassign, max-len
  linear: (t) => t,
};

/**
 * Configuration
 * @enum {number|function(number):number}
 */
const CONF = {
  BALL: {
    DURATION: 1000,
  },
  EASING: EASING.linear,
};

/**
 * @type {boolean}
 */
let isMoving = false;

/**
 * Configuration
 * @type {Array<Object<number>>}
 */
let recordMovement = [];

/** @type {HTMLElement} */
const $wrapper = document.querySelector(SELECTORS.WRAPPER);
/** @type {HTMLElement} */
const $ball = document.querySelector(SELECTORS.BALL);

/**
 * Makes the ball follow the mouse
 */
function stopFollowMovement() {
  const { x, y } = recordMovement.slice(-1)[0];

  recordMovement = [{ x, y }];
  isMoving = false;
  console.log('stop animating!'); // eslint-disable-line no-console
}

/**
 * Animation Facade
 *
 * @param index
 * @param animation
 * @return {boolean}
 */
function moveBall(index, animation) {
  if (!recordMovement[index]) return true;

  let { x, y } = recordMovement[index];

  if (animation < 0) {
    x *= Math.min(animation, 1);
    y *= Math.min(animation, 1);
  }

  $ball.style.left = `${x}px`;
  $ball.style.top = `${y}px`;

  return false;
}

function animateBallMovement() {
  // flags for animation loop
  let stop = false;
  let start = null;
  // Get Index
  let counter = 0;

  const nextFrame = (time) => {
    counter += 1;

    if (stop) {
      stopFollowMovement();
      return;
    }

    const runtime = time - start;
    const relativeProgress = CONF.EASING(runtime / CONF.BALL.DURATION);

    stop = moveBall(counter, relativeProgress);

    requestAnimationFrame(nextFrame);
  };

  const startAnim = (time) => {
    start = time;
    nextFrame(time);
  };

  requestAnimationFrame(startAnim);
}

/**
 * Makes the ball follow the mouse
 *
 * @param {Event} event
 */
function followBall(event) {
  recordMovement.push({
    x: event.pageX,
    y: event.pageY,
  });

  if (!isMoving) {
    isMoving = true;

    console.log('start animating!'); // eslint-disable-line no-console

    animateBallMovement();
  }
}

$wrapper.addEventListener('mousemove', (event) => {
  followBall(event);
});

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
 * Configuration
 * @enum {number}
 */
const CONF = {
  BALL: {
    FOLLOW_DELAY: 0,
  },
};

/** @type {HTMLElement} */
const $wrapper = document.querySelector(SELECTORS.WRAPPER);
/** @type {HTMLElement} */
const $ball = document.querySelector(SELECTORS.BALL);

/**
 * Makes the ball follow the mouse
 *
 * @param {event} event
 */
function followBall(event) {
  setTimeout(() => {
    $ball.style.left = `${event.pageX}px`;
    $ball.style.top = `${event.pageY}px`;
  }, CONF.BALL.FOLLOW_DELAY);
}

$wrapper.addEventListener('mousemove', followBall);

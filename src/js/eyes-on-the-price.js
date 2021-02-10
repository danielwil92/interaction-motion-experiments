// shared module
import '../scss/eyes-on-the-price.scss';

/**
 * Selectors
 * @enum {string|Object<Object<string>>}
 */
const SELECTORS = {
  BALL: '.ball',
  WRAPPER: '.follow-ball',
  INFORMATIVE: {
    COORDINATES: {
      X: '.informative__coordinate--x span',
      Y: '.informative__coordinate--y span',
    },
  },
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
 * @enum {Object}
 */
const CARTESIAN_PLANE = {};

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
/** @type {Object<Object<HTMLElement>>} */
const $informative = {
  COORDINATES: {
    X: document.querySelector(SELECTORS.INFORMATIVE.COORDINATES.X),
    Y: document.querySelector(SELECTORS.INFORMATIVE.COORDINATES.Y),
  },
};

/**
 * Create a Cartesian so I am able to determine the position of the ball
 */
function createCartesianPlane() {
  const { width, height } = $wrapper.getBoundingClientRect();

  CARTESIAN_PLANE.center = {
    X: Math.min(width / 2),
    Y: Math.min(height / 2),
  };

  /**
   * Calculates the coordinates in X.
   *
   * @param {number} coordinate
   * @return {number}
   */
  const getCoordinateX = (coordinate) => {
    const axisCenter = CARTESIAN_PLANE.center.X;

    return coordinate > axisCenter ? coordinate - axisCenter : (axisCenter - coordinate) * -1;
  };

  /**
   * Calculates the coordinates in Y.
   *
   * @param {number} coordinate
   * @return {number}
   */
  const getCoordinateY = (coordinate) => {
    const axisCenter = CARTESIAN_PLANE.center.Y;

    return coordinate > axisCenter ? (coordinate - axisCenter) * -1 : axisCenter - coordinate;
  };

  CARTESIAN_PLANE.transformPositionIntoCoordinate = (coordinateX, coordinateY) => {
    const coordinates = {
      coordinateX: getCoordinateX(coordinateX),
      coordinateY: getCoordinateY(coordinateY),
    };

    const { X, Y } = $informative.COORDINATES;

    X.innerText = coordinates.coordinateX;
    Y.innerText = coordinates.coordinateY;

    return coordinates;
  };
}

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
 * @param {number} left
 * @param {number} top
 * @return {boolean}
 */
function moveBall(left, top) {
  $ball.style.setProperty('--ball-left-position', `${left}px`);
  $ball.style.setProperty('--ball-top-position', `${top}px`);
}

function followMovement(index, animation) {
  if (!recordMovement[index]) return true;

  let { x, y } = recordMovement[index];

  if (animation < 0) {
    x *= Math.min(animation, 1);
    y *= Math.min(animation, 1);
  }

  moveBall(x, y);
  CARTESIAN_PLANE.transformPositionIntoCoordinate(x, y);

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

    stop = followMovement(counter, relativeProgress);

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

createCartesianPlane();
$wrapper.addEventListener('mousemove', followBall);

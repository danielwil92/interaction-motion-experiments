// shared module
import '../scss/eyes-on-the-price.scss';

/** @type {boolean} */
const debug = document.querySelector('body').classList.contains('debug');

/**
 * Selectors
 * @enum {string|Object<Object<string>>}
 */
const SELECTORS = {
  BALL: '.ball',
  WRAPPER: '.follow-ball',
  SQUARE: '.follow-ball__square',
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
 * @enum {number|function(number):number|Object<number|string>}
 */
const CONF = {
  ANIMATION_EASING: EASING.linear, // Change to see a different animation flow. Ref EASING.
  BALL: {
    DURATION: 1000, // More than one 1000 will no take effect
    RESISTANCE: 100, // How much should the callback wait until it follows the ball
    CSS_VARIABLE: {
      LEFT: '--ball-left-position',
      TOP: '--ball-top-position',
    },
  },
  SQUARE: {
    CONSTRAIN: 0.15, // MUST BE SET DEPENDING ON THE ELEMENTS PARENTS PERSPECTIVE - Set by the CSS
    CSS_VARIABLE: {
      X: '--rotate-X',
      Y: '--rotate-Y',
    },
  },
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
/** @type {Array<HTMLElement>} */
const $squares = [...document.querySelectorAll(SELECTORS.SQUARE)];
/** @type {Array<Object>} */
let squares = [];

/** @type {Object<Object<HTMLElement>>} */
const $informative = {
  COORDINATES: {
    X: document.querySelector(SELECTORS.INFORMATIVE.COORDINATES.X),
    Y: document.querySelector(SELECTORS.INFORMATIVE.COORDINATES.Y),
  },
};

/**
 * Create a Cartesian Plane so the component is able to determine the position of the ball and
 * the squares, and calculates the rotation based on each center
 */
function createCartesianPlane() {
  const { height } = $wrapper.getBoundingClientRect();

  CARTESIAN_PLANE.center = {
    X: 0,
    Y: height,
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

    if (debug) {
      const { X, Y } = $informative.COORDINATES;

      X.innerText = coordinates.coordinateX;
      Y.innerText = coordinates.coordinateY;
    }

    return coordinates;
  };
}

/**
 * Calculates cartesian position of each element and its row position
 * to be used later on the calculations of followBall
 *
 * @param {HTMLElement} element
 */
function getCartesianPlanePosition(element) {
  const {
    width, height, top, left,
  } = element.getBoundingClientRect();
  const positionX = (width / 2) + left;
  const positionY = (height / 2) + top;

  return {
    element,
    cartesian: {
      center: CARTESIAN_PLANE.transformPositionIntoCoordinate(positionX, positionY),
    },
  };
}

/**
 * Calculates the rotation based on the square center and the ball position
 *
 * @param {Object<number>} ballCoordinate
 * @param {Object<number>} squareCenterCoordinate
 */
function getRotation(ballCoordinate, squareCenterCoordinate) {
  return {
    rotateX: (ballCoordinate.coordinateY - squareCenterCoordinate.coordinateY) * (CONF.SQUARE.CONSTRAIN * -1), // eslint-disable-line max-len
    rotateY: (ballCoordinate.coordinateX - squareCenterCoordinate.coordinateX) * (CONF.SQUARE.CONSTRAIN * -1), // eslint-disable-line max-len
  };
}

/**
 * Animation for each square so each one "looks" At the ball
 *
 * @param {number} coordinateX
 * @param {number} coordinateY
 */
function lookAtTheBall(coordinateX, coordinateY) {
  const { X, Y } = CONF.SQUARE.CSS_VARIABLE;

  // eslint-disable-next-line array-callback-return
  squares.map((square) => {
    const { element, cartesian } = square;
    const { rotateX, rotateY } = getRotation({ coordinateX, coordinateY }, cartesian.center);

    element.style.setProperty(X, `${rotateX}deg`);
    element.style.setProperty(Y, `${rotateY}deg`);

    if (debug) {
      element.innerText = `
        ${X}, ${rotateX}
        ${Y}, ${rotateY}`;
    }
  });
}

/**
 * Updates the css variables so the ball starts moving
 *
 * @param {number} left
 * @param {number} top
 * @return {boolean}
 */
function moveBall(left, top) {
  $ball.style.setProperty(CONF.BALL.CSS_VARIABLE.LEFT, `${left}px`);
  $ball.style.setProperty(CONF.BALL.CSS_VARIABLE.TOP, `${top}px`);
}

/**
 * Moves the ball and makes squares follow the moments.
 * Return indicates if the animation should stop or continue
 *
 * @param {number} index - in Array
 * @param {number} animation - milliseconds
 *
 * @return {boolean}
 */
function followMovement(index, animation) {
  if (!recordMovement[index]) return true;

  let { x, y } = recordMovement[index];

  if (animation < 0) {
    x *= Math.abs(animation);
    y *= Math.abs(animation);
  }

  // Move Fall
  moveBall(x, y);
  // Calculate Ball Position in Cartesian Plane
  const { coordinateX, coordinateY } = CARTESIAN_PLANE.transformPositionIntoCoordinate(x, y);
  // Make Them Look at the Ball
  lookAtTheBall(coordinateX, coordinateY);

  return false;
}

/**
 * Stops the animation Follow ball animations
 * and sets its final state as the initial state for the next animation
 */
function stopFollowMovement() {
  const { x, y } = recordMovement.slice(-1)[0];

  recordMovement = [{ x, y }];
  isMoving = false;
}

function followBallMovement() {
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
    const relativeProgress = CONF.ANIMATION_EASING(runtime / CONF.BALL.DURATION);

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

    setTimeout(followBallMovement, CONF.BALL.RESISTANCE);
  }
}

createCartesianPlane();
// eslint-disable-next-line no-unused-vars
squares = $squares.map(getCartesianPlanePosition);
$wrapper.addEventListener('mousemove', followBall);

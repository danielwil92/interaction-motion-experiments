import '../scss/zooom.scss';
import { TweenMax, TimelineMax } from 'gsap';

// Greensock
const tl = new TimelineMax();

const $playButton = document.querySelector('.btn-play');
const $logoWrapper = document.querySelector('.svg-wrapper');
let player;

const onYouTubeIframeAPIReady = () => {
  player = new YT.Player('player', { // eslint-disable-line no-undef
    height: '100%',
    width: '100%',
    videoId: 'km3sqKZ7CPE',
  });
};

window.addEventListener('load', onYouTubeIframeAPIReady);

const onAnimationComplete = () => {
  player.playVideo();
};

const playAnimation = () => {
  $logoWrapper.classList.add('svg-wrapper--animate');
  onAnimationComplete();

  tl.add(
    TweenMax.to('.svg-wrapper', 4,
      {
        scale: 200,
        transformOrigin: '50%, 50%',
      }),
  )
    .delay(5);
};

$playButton.addEventListener('click', playAnimation);

// shared module
import '../scss/asset-control.scss';
import sprites from '../images/static/Circle_SafetyC_Sprite-min.png';

const $input = document.querySelector('.input');
const $animation = document.querySelector('.animation');

const imageSprite = new Image();
imageSprite.src = sprites;

$animation.appendChild(imageSprite);

const { spritesPerRow } = $input.dataset;
const spriteSize = 600;

$input.addEventListener('input', (event) => {
  const position = event.target.value;

  const row = parseInt(position / spritesPerRow, 10) + 1;
  const column = (position % spritesPerRow);

  imageSprite.style.transform = `translate3d(-${column * spriteSize}px,-${row * spriteSize}px, 0)`;
});

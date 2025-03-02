// index.js
import { Core } from '../../TETTE_CORE/core/core_logic/Core.js';
import { getShape2d } from '../../TETTE_CORE/gameObjects/shapes/shape2d.js';
import { SceneManager } from '../../TETTE_CORE/core/core_logic/SceneManager.js';


const renderType = 'webgl'; // Change to '2d' or 'webgl' as needed

// Get shape2d object configured with renderType
const shape2d = getShape2d(renderType);
// Создаем менеджер сцен
const sceneManager = new SceneManager();

// Создаем экземпляр Core
const game = new Core({
  canvasId: 'canvas',
  renderType: renderType,
  backgroundColor: 'rgb(210, 105, 30)',
  sceneManager: sceneManager,
  // gameType: 'platformer',
});

sceneManager.createScene('level1','level2');

// Уровень 1
const playerLevel1 = shape2d.square({
  x: 100,
  y: 100,
  size: 50,
  color: 'rgb(10, 105, 30)',
});

playerLevel1.update = function(deltaTime) {
  this.x += deltaTime * 0.1;
  if (this.x > 700) {
    sceneManager.changeScene('level2');
  }
};

const player2Level1 = shape2d.circle({
  x: 150,
  y: 50,
  radius: 50,
  color: 'green',
  borderColor: 'black',
  borderWidth: 2
});


player2Level1.update = function(deltaTime) {
  this.x += deltaTime * 0.1;
  if (this.x > 700) {
    sceneManager.changeScene('level2');
  }
};
const ellipseObj = shape2d.ellipse({
  x: 200,
  y: 400,
  rX: 100,
  rY: 50,
  color: 'blue',
  borderColor: 'white',
  borderWidth: 2
});

ellipseObj.update = function(deltaTime) {
  this.x += deltaTime * 0.1;
  if (this.x > 700) {
    sceneManager.changeScene('level2');
  }
};
const myLine = shape2d.line({
  x1: 100,
  y1: 100,
  x2: 300,
  y2: 300,
  color: 'blue',
  widthline: 5,
  lineRounded: 'round'
});

sceneManager.addGameObjectToScene('level1', playerLevel1, player2Level1, ellipseObj, myLine);

// Уровень 2
const playerLevel2 = shape2d.rectangle({
  x: 50,
  y: 50,
  width:100,
  height:200,
  color: 'blue',
});

playerLevel2.update = function(deltaTime) {
  this.x += deltaTime * 0.05;
  if (this.x > 700) {
    console.log('You have completed level 2!');
  }
};


const myText = shape2d.text({
  text: 'Данила и дёма',
  x: 100,
  y: 50,
  fontsize: 76,
  color: 'green',
  fontFamily: 'Verdana',
  borderColor: 'black',
  borderWidth: 1
});
const myImage = new Image(); // Создаём новый объект Image
myImage.src = './raketa.png';

myImage.onload = () => {
  const mySprite = shape2d.sprite({
    image: myImage, // Используем загруженное изображение
    x: 100,
    y: 150,
    width:300,
    height: 200,
    // preserveAspectRatio: true,
  });

  // Добавляем спрайт в уровень 2
  sceneManager.addGameObjectToScene('level2', mySprite);
};
// const mySprite = shape2d.sprite({
//   image: myImage, // Загрузите изображение перед использованием
//   x: 100,
//   y: 150,
//   width: 300,
//   height: 400
// });
const triangle = shape2d.polygon({
  vertices: [{ x: 100, y: 100 }, { x: 150, y: 200 }, { x: 50, y: 200 }],
  color: 'green'
});

// Пример создания звезды
const star = shape2d.star({
  x: 200,
  y: 200,
  radius: 50,
  points: 5,
  color: 'yellow'
});

// Пример создания дуги
const arcObj = shape2d.arc({
  x: 300,
  y: 300,
  radius: 100,
  startAngle: 0,
  endAngle: Math.PI, // Половина окружности
  color: 'blue',
  borderColor: 'black',
  borderWidth: 2
});

// Пример создания кривой Безье
const bezier = shape2d.bezierCurve({
  startX: 100,
  startY: 100,
  controlX1: 150,
  controlY1: 50,
  controlX2: 250,
  controlY2: 200,
  endX: 300,
  endY: 100,
  color: 'red'
});
const circle = shape2d.circle({
  x: 150,
  y: 150,
  radius: 50,
  startAngle: 0,
  endAngle: 2 * Math.PI, // Полная окружность
  color: 'green',
  borderColor: 'red',
  borderWidth: 2
});
// sceneManager.createScene('level2');
sceneManager.addGameObjectToScene('level2',  playerLevel2, myText, triangle, star, arcObj, bezier, circle);
// sceneManager.addGameObjectToScene('level2', mySprite);

// Начинаем с уровня 1
sceneManager.changeScene('level1');

// Запуск игры
game.start();

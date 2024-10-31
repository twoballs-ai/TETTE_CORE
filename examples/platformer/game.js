import { Core } from '../../TETTE_CORE/core/core_logic/Core.js';
import { SceneManager } from '../../TETTE_CORE/core/core_logic/SceneManager.js';
import { PlatformerPlayerCharacter } from '../../TETTE_CORE/gameObjects/characters/PlatformerPlayerCharacter.js'; 
import { getShape2d } from '../../TETTE_CORE/gameObjects/shapes/shape2d.js';
import { Enemy } from '../../TETTE_CORE/gameObjects/characters/Enemy.js';
// Получаем объект shape2d, настроенный с renderType
const renderType = '2d'; 
const shape2d = getShape2d(renderType);
const sceneManager = new SceneManager();

// Создаем сцены 'level1' и 'level2'
sceneManager.createScene('level1', 'level2');
const enemy = new Enemy({
    x: 800,
    y: 700,
    width: 50,
    height: 140,
    color: 'green',
    health: 50,
    speed: 2,
    layer: 2,
    enablePhysics: true,
    animations: {
    //   run: [
    //     './enemy_run/frame1.png',
    //     './enemy_run/frame2.png',
    //     // Добавьте пути к кадрам анимации бега врага
    //   ],
    //   idle: [
    //     './enemy_idle/frame1.png',
    //     // Добавьте пути к кадрам анимации ожидания врага
    //   ],
    //   die: [
    //     './enemy_die/frame1.png',
    //     // Добавьте пути к кадрам анимации смерти врага
    //   ],
    },
  });
  
  // Задаем границы патрулирования
  enemy.leftBoundary = 400;
  enemy.rightBoundary = 800;
  
  // Добавляем врага на сцену 'level1'
  sceneManager.addGameObjectToScene('level1', enemy);
// Загружаем кадры для анимации "бега"
const runAnimationFrames = [
  './run_animation/run-1.png',
  './run_animation/run-2.png',
  './run_animation/run-3.png',
  './run_animation/run-4.png',
  './run_animation/run-5.png',
  './run_animation/run-6.png',
  './run_animation/run-7.png',
  './run_animation/run-8.png',
];

// Создаем игрока с анимацией "бега" и включенной физикой
const player = new PlatformerPlayerCharacter({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  color: 'red',
  health: 100,
  speed: 3,
  layer: 2, // Игрок будет на слое 2
  enablePhysics: true, // Включаем физику для игрока
  animations: {
    run: runAnimationFrames,
  }
});

// Создаем изображение пола
const myImage = new Image();
myImage.src = './floor.png';

// Создаем пол с включенной физикой
const mySpriteGrid = shape2d.spriteGrid({
  image: myImage,
  x: 0,
  y: 800,
  width: 160,
  height: 150,
  repeatX: 12,
  spacingX: 0,
  enablePhysics: true, // Включаем физику для пола
  isStatic: true,   
  layer: 2,    // Делаем пол статичным объектом
});
const nebo = new Image();
nebo.src = './nebo.jpg';

nebo.onload = () => {
  const neboSprite = shape2d.sprite({
    image: nebo, // Используем загруженное изображение
    x: 0,
    y: 0,
    width: 1920,
    height: 830,
    layer: 0, // Игрок будет на слое 2,

    // preserveAspectRatio: true, // Сохраняем пропорции
    // enablePhysics: true, // Включаем физику
    isStatic: true,     // Делаем объект динамическим
  });

  // Добавляем спрайт в уровень 1
  sceneManager.addGameObjectToScene('level1', neboSprite);
};
const boxImage = new Image();
boxImage.src = './box.jpg';

boxImage.onload = () => {
  const mySprite = shape2d.sprite({
    image: boxImage, // Используем загруженное изображение
    x: 500,
    y: 150,
    width: 100,
    height: 100,
    preserveAspectRatio: true, // Сохраняем пропорции
    enablePhysics: true, // Включаем физику
    isStatic: false,     // Делаем объект динамическим
    layer: 2, 
  });

  // Добавляем спрайт в уровень 1
  sceneManager.addGameObjectToScene('level1', mySprite);
};
// Добавляем игрока на сцену 'level1'
sceneManager.addGameObjectToScene('level1', player,mySpriteGrid );



// Переключаемся на сцену 'level1'
sceneManager.changeScene('level1');

// Создаем экземпляр Core
const game = new Core({
  canvasId: 'canvas',
  renderType: renderType,
  backgroundColor: 'gray',
  sceneManager: sceneManager,
  width: window.innerWidth,
  height: window.innerHeight,
});

// Устанавливаем тип игры 'platformer' (включает физику)
game.setGameType('platformer');

// Запускаем игру
game.start();

// TETTE_CORE/index.js

// Экспортируем основные компоненты ядра
export { Core } from './core/core_logic/Core.js';
export { SceneManager } from './core/core_logic/SceneManager.js';
export { GameObject } from './core/core_logic/gameObject.js';
export { GraphicalContext } from './core/core_logic/GraphicalContext.js';

// Экспортируем фигуры
export { Rectangle } from './gameObjects/shapes/2d/Rectangle.js';
export { Circle } from './gameObjects/shapes/2d/Circle.js';
// export { Line } from './core/figures/Line.js';
// export { Ellipse } from './core/figures/Ellipse.js';
export { shape2d } from './gameObjects/shapes/2d/shape.js';

// Экспортируем контролы
export { KeyboardControl } from './core/controls/keyboardControl.js';
export { MouseControl } from './core/controls/mouseControl.js';
export { TouchControl } from './core/controls/touchControl.js';

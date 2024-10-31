![image](https://github.com/user-attachments/assets/55d81f94-10b4-498d-b6ac-36e1ab8cfb32)

# TETTE.js

![TETTE.js Logo](https://your-repo-url/logo.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Roadmap](#roadmap)
- [Installation](#installation)
- [Usage](#usage)
    - [Example Project](#example-project)
- [Current Status](#current-status)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

**TETTE.js** is a lightweight and flexible JavaScript game framework designed to simplify the development of 2D games. By providing a robust set of tools and abstractions, TETTE.js allows developers to focus on creating engaging gameplay without getting bogged down by low-level rendering details. TETTE.js supports multiple rendering backends, including Canvas 2D, WebGL, and WebGPU, ensuring high performance and versatility across different platforms and devices.

## Features

- **Multiple Rendering Backends**: Seamlessly switch between Canvas 2D, WebGL, and future support for WebGPU.
- **Primitives**: Easy-to-use 2D shapes like squares, circles, ellipses, lines, polygons, stars, and bezier curves.
- **Scene Management**: Organize your game into multiple scenes or levels with ease.
- **Physics Integration**: (Upcoming) Incorporate realistic physics into your games.
- **Input Handling**: (Upcoming) Robust controls for keyboard, mouse, and gamepad inputs.
- **Pre-made Game Templates**: (Upcoming) Quickly prototype games using predefined templates.
- **GUI Components**: (Upcoming) Build interactive user interfaces for your games.

## Roadmap

TETTE.js is structured to evolve through several development stages, ensuring a solid foundation and incremental feature enhancements.

### 1. Primitives
- **Current**: Implementation of basic primitives using Canvas 2D and partial support for WebGL.
- **Upcoming**: Complete WebGL support and initial implementation for WebGPU.

### 2. Physics
- **Planned**: Integrate a physics engine to handle realistic movements, collisions, and interactions.

### 3. Controls
- **Planned**: Develop comprehensive input handling for various devices, including keyboard, mouse, and gamepads.

### 4. Pre-made Game Templates
- **Planned**: Provide ready-to-use game templates (e.g., platformers, shooters) to accelerate game development.

### 5. GUI
- **Planned**: Create a set of GUI components for menus, HUDs, and other interactive elements.

## Installation

You can integrate TETTE.js into your project using npm or by directly including the script.

### Using npm

```bash
npm install tette.js
```

### Using CDN

Include the following script tag in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/tette.js/dist/tette.min.js"></script>
```

## Usage

Getting started with TETTE.js is straightforward. Below is an example project that demonstrates how to initialize the framework, create scenes, and add game objects.

### Example Project

#### Directory Structure

```
project/
├── index.html
├── game.js
├── TETTE_CORE/
│   ├── core/
│   │   ├── Core.js
│   │   ├── Renderer.js
│   │   └── SceneManager.js
│   └── gameObjects/
│       └── shapes/
│           ├── 2d/
│           │   └── shape2d.js
│           ├── webgl/
│           │   └── shapeWebGL.js
│           └── webgpu/
│               └── shapeWebGPU.js
└── assets/
    └── raketa.png
```

#### `index.html`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Игра с использованием TETTE</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #333;
        }

        /* Стиль для канваса */
        #canvas {
            border: 1px solid white; /* Белая граница */
            box-sizing: border-box; /* Учитываем границу в расчет размеров */
        }
    </style>
</head>
<body>

<canvas id="canvas" width="900" height="600"></canvas>

<!-- Подключение основного игрового файла -->
<script type="module" src="./game.js"></script>

</body>
</html>
```

#### `game.js`

```javascript
// game.js
import { Core } from '../../TETTE_CORE/core/core_logic/Core.js';
import { getShape2d } from '../../TETTE_CORE/gameObjects/shapes/shape2d.js';
import { SceneManager } from '../../TETTE_CORE/core/core_logic/SceneManager.js';

const renderType = '2d'; // Change to '2d' or 'webgl' as needed

// Get shape2d object configured with renderType
const shape2d = getShape2d(renderType);

// Создаем менеджер сцен
const sceneManager = new SceneManager();

// Создаем экземпляр Core
const game = new Core({
  canvasId: 'canvas',
  renderType: renderType,
  backgroundColor: [210/255, 105/255, 30/255, 1], // RGB преобразованный в нормализованные значения
  sceneManager: sceneManager,
  // gameType: 'platformer',
});

sceneManager.createScene('level1','level2');

// Уровень 1
const playerLevel1 = shape2d.square({
  x: 100,
  y: 100,
  size: 50,
  color: [10/255, 105/255, 30/255, 1], // RGB нормализованный
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
  color: [0, 1, 0, 1], // Green
  borderColor: [0, 0, 0, 1], // Black
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
  color: [0, 0, 1, 1], // Blue
  borderColor: [1, 1, 1, 1], // White
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
  color: [0, 0, 1, 1], // Blue
  widthline: 5,
  lineRounded: 'round'
});

sceneManager.addGameObjectToScene('level1', playerLevel1, player2Level1, ellipseObj, myLine);

// Уровень 2
const playerLevel2 = shape2d.rectangle({
  x: 50,
  y: 50,
  width: 100,
  height: 200,
  color: [0, 0, 1, 1], // Blue
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
  color: [0, 1, 0, 1], // Green
  fontFamily: 'Verdana',
  borderColor: [0, 0, 0, 1], // Black
  borderWidth: 1
});

const myImage = new Image(); // Создаём новый объект Image
myImage.src = './raketa.png';

myImage.onload = () => {
  const mySprite = shape2d.sprite({
    image: myImage, // Используем загруженное изображение
    x: 100,
    y: 150,
    width: 300,
    height: 200,
    // preserveAspectRatio: true,
  });

  // Добавляем спрайт в уровень 2
  sceneManager.addGameObjectToScene('level2', mySprite);
};

const triangle = shape2d.polygon({
  vertices: [{ x: 100, y: 100 }, { x: 150, y: 200 }, { x: 50, y: 200 }],
  color: [0, 1, 0, 1], // Green
});

// Пример создания звезды
const star = shape2d.star({
  x: 200,
  y: 200,
  radius: 50,
  points: 5,
  color: [1, 1, 0, 1], // Yellow
});

// Пример создания дуги
const arcObj = shape2d.arc({
  x: 300,
  y: 300,
  radius: 100,
  startAngle: 0,
  endAngle: Math.PI, // Половина окружности
  color: [0, 0, 1, 1], // Blue
  borderColor: [0, 0, 0, 1], // Black
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
  color: [1, 0, 0, 1] // Red
});

const circle = shape2d.circle({
  x: 150,
  y: 150,
  radius: 50,
  startAngle: 0,
  endAngle: 2 * Math.PI, // Полная окружность
  color: [0, 1, 0, 1], // Green
  borderColor: [1, 0, 0, 1], // Red
  borderWidth: 2
});

sceneManager.addGameObjectToScene('level2', playerLevel2, myText, triangle, star, arcObj, bezier, circle);

// Начинаем с уровня 1
sceneManager.changeScene('level1');

// Запуск игры
game.start();
```

## Current Status

TETTE.js is actively developing with the following features currently implemented:

- **Primitives**:
  - **Canvas 2D**: Fully implemented basic shapes including squares, circles, ellipses, lines, polygons, stars, arcs, and bezier curves.
  - **WebGL**: Partially implemented primitives with ongoing support for rendering using WebGL.
  - **WebGPU**: Planned for future development; currently under initial implementation.

- **Rendering Backends**:
  - **2D Canvas**: Fully supported for straightforward 2D game rendering.
  - **WebGL**: Partially supported, allowing for more advanced and performant rendering.
  - **WebGPU**: To be implemented as the final rendering backend for cutting-edge graphics performance.

## Project Roadmap

TETTE.js follows a structured roadmap to ensure feature completeness and stability. The development progresses through the following stages:

1. **Primitives**
   - **Completed**: Basic shapes rendering using Canvas 2D and partial WebGL support.
   - **Next Steps**: Complete WebGL support and begin initial WebGPU implementation.

2. **Physics**
   - **Planned**: Integrate a physics engine to handle realistic movements, collisions, and interactions between game objects.

3. **Controls**
   - **Planned**: Develop comprehensive input handling for keyboard, mouse, and gamepad inputs to facilitate player interactions.

4. **Pre-made Game Templates**
   - **Planned**: Provide a set of ready-to-use game templates (e.g., platformers, shooters) to accelerate game development and prototyping.

5. **GUI**
   - **Planned**: Create a suite of GUI components for building interactive menus, HUDs, and other user interface elements within games.

## Contributing

Contributions are welcome! If you'd like to contribute to TETTE.js, please follow these guidelines:

1. **Fork the Repository**: Click the "Fork" button at the top-right of the repository page.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/tette.js.git
   cd tette.js
   ```

3. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Commit Your Changes**:
   ```bash
   git commit -m "Add feature X"
   ```

5. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**: Go to the original repository and click "New Pull Request".

Please ensure your code follows the project's coding standards and includes appropriate documentation and tests.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions, issues, or suggestions, feel free to reach out:

- **Email**: your-email@example.com
- **GitHub Issues**: [TETTE.js Issues](https://github.com/your-username/tette.js/issues)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

**Happy Coding with TETTE.js!**

// Core.js

import { GraphicalContext } from './GraphicalContext.js';
import { GameTypeFactory } from './GameTypeFactory.js';
import { ColorMixin } from './ColorMixin.js';

export class Core {
  constructor({ canvasId, renderType = '2d', backgroundColor = 'black', sceneManager, width = 900, height = 600 }) {
    this.renderType = renderType;
    console.log(renderType);
    const normalizedBackgroundColor = ColorMixin(backgroundColor, renderType);

    this.graphicalContext = new GraphicalContext(canvasId, renderType, normalizedBackgroundColor, width, height);
    this.renderer = this.graphicalContext.getRenderer();
    this.sceneManager = sceneManager;
    this.lastTime = 0;
    this.loop = this.loop.bind(this);
    this.gameTypeInstance = null;
    this.isGuiMode = false;
    this.animationFrameId = null; // Added for animation frame ID
    this.selectedObject = null; // Added to track selected object
    console.log(width, height);
  }

  resize(width, height) {
    if (this.graphicalContext) {
      this.graphicalContext.resize(width, height);

      // If something needs to be updated in the scene or re-rendered
      this.renderer.clear();
      this.sceneManager.render(this.renderer.context);

      console.log(`Core resized to: ${width}x${height}`);
    }
  }

   highlightObject(object, color = 'purple', fillColor = 'rgba(200, 100, 255, 0.2)', borderWidth = 0.2, padding = 10) {
    if (!object || !this.renderer) return;

    const ctx = this.renderer.context;

    console.log('Highlighting object:', object);

    ctx.save();

    // Добавляем тень
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Получаем размеры и позицию объекта
    const { x, y, width, height } = object.getBoundingBox ? object.getBoundingBox() : object;

    // Рисуем полупрозрачную заливку с отступом
    ctx.fillStyle = fillColor;
    ctx.fillRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding); // Добавляем отступы

    // Рисуем тонкую рамку с отступом
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding); // Добавляем отступы

    // Рисуем resize handles (угловые точки)
    const handleSize = 6;
    const handleColor = color;

    const handles = [
      { x: x - padding - handleSize / 2, y: y - padding - handleSize / 2, cursor: 'nwse-resize', direction: 'nw' },
      { x: x + width + padding - handleSize / 2, y: y - padding - handleSize / 2, cursor: 'nesw-resize', direction: 'ne' },
      { x: x - padding - handleSize / 2, y: y + height + padding - handleSize / 2, cursor: 'nesw-resize', direction: 'sw' },
      { x: x + width + padding - handleSize / 2, y: y + height + padding - handleSize / 2, cursor: 'nwse-resize', direction: 'se' },
    ];

    ctx.fillStyle = 'white';
    ctx.strokeStyle = handleColor;
    ctx.lineWidth = 1;

    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });

    ctx.restore();
  }

  setSelectedObject(object) {
    this.selectedObject = object;
    this.render(); // Перерисовываем сцену с новым выделением
  }

  setSelectedObject(object) {
    this.selectedObject = object;
    this.render(); // Re-render the scene with the new selection
  }

  setGameType(gameType) {
    if (gameType) {
      console.log(`Setting game type: ${gameType}`);
      this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType);
      if (!this.gameTypeInstance) {
        console.error(`Error: game type ${gameType} not loaded.`);
      }
    }
  }

  getSceneManager() {
    return this.sceneManager;
  }

  enableGuiMode() {
    this.isGuiMode = true;
    console.log('GUI mode enabled.');
    this.render();
  }

  disableGuiMode() {
    this.isGuiMode = false;
    console.log('GUI mode disabled.');
    this.start();
  }

  async start() {
    if (typeof this.renderer.init === 'function') {
      await this.renderer.init();
    }

    if (this.gameTypeInstance && typeof this.gameTypeInstance.start === 'function') {
      this.gameTypeInstance.start();
    }

    if (!this.isGuiMode) {
      this.animationFrameId = requestAnimationFrame(this.loop); // Updated to use animation frame
    }
  }

  loop(timestamp) {
    if (!this.isGuiMode) {
      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;
  
      if (this.gameTypeInstance && this.gameTypeInstance.update) {
        this.gameTypeInstance.update(deltaTime);
      }
  
      // Важно: обновляем сначала логику
      if (this.logicSystem) {
        this.logicSystem.update(deltaTime);
      }
  
      // Затем обновляем сцену
      this.sceneManager.update(deltaTime);
  
      // Рендерим
      this.renderer.clear();
      this.sceneManager.render(this.renderer.context);
  
      if (this.selectedObject) {
        this.highlightObject(this.selectedObject, 'purple');
      }
  
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log('Game loop stopped.');
    }
  }

  update(deltaTime) {
    if (this.gameTypeInstance && this.gameTypeInstance.update) {
      this.gameTypeInstance.update(deltaTime);
    }
    this.sceneManager.update(deltaTime);
    this.render();
  }

  render() {
    this.renderer.clear();
    this.sceneManager.render(this.renderer.context);

    if (this.selectedObject) {
      this.highlightObject(this.selectedObject, 'purple');
    }
  }
}

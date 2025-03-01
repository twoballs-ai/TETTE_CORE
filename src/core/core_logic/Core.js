import { GraphicalContext } from './GraphicalContext.js';
import { GameTypeFactory } from './GameTypeFactory.js';
import { ColorMixin } from './ColorMixin.js';
import { Highlighter } from './utils/Highlighter.js';
import { PreviewMode } from '../core_logic/RenderMode/mode/PreviewMode.js';
import { FullPreviewMode } from '../core_logic/RenderMode/mode/FullPreviewMode.js';
import { GameMode } from '../core_logic/RenderMode/mode/GameMode.js';
import { EditorMode } from '../core_logic/RenderMode/mode/EditorMode.js';
export class Core {
  constructor({ canvasId, renderType = '2d', backgroundColor = 'black', sceneManager, width = 900, height = 600 }) {
    this.renderType = renderType;
    const normalizedBackgroundColor = ColorMixin(backgroundColor, renderType);

    this.graphicalContext = new GraphicalContext(canvasId, renderType, normalizedBackgroundColor, width, height);
    this.renderer = this.graphicalContext.getRenderer();
    this.sceneManager = sceneManager;

    this.currentMode = null; // Текущий режим
    this.lastTime = 0;
    this.loop = this.loop.bind(this);
    this.animationFrameId = null;
    this.gameTypeInstance = null;
    this.selectedObject = null; // Текущий выделенный объект
  }

  // Переключение между режимами
  switchMode(ModeClass, ...args) {
    if (this.currentMode) {
      this.currentMode.stop();
    }
    this.currentMode = new ModeClass(this, ...args);
    this.currentMode.start();
  }

  // Изменение размеров канваса
  resize(width, height) {
    if (this.graphicalContext) {
      this.graphicalContext.resize(width, height);
      this.renderer.clear();
      this.sceneManager.render(this.renderer.context);
      // console.log(`Core resized to: ${width}x${height}`);
    }
  }

  // Установка выделенного объекта
  setSelectedObject(object) {
    this.selectedObject = object;
    this.render(); // Перерисовываем сцену с новым выделением
  }

  // Установка типа игры через фабрику
  setGameType(gameType) {
    if (gameType) {
      // console.log(`Setting game type: ${gameType}`);
      this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType);
      if (!this.gameTypeInstance) {
        console.error(`Error: game type ${gameType} not loaded.`);
      }
    }
  }

  // Доступ к SceneManager
  getSceneManager() {
    return this.sceneManager;
  }

  // Запуск игрового цикла
  async start() {
    if (typeof this.renderer.init === 'function') {
      await this.renderer.init();
    }

    if (this.gameTypeInstance && typeof this.gameTypeInstance.start === 'function') {
      this.gameTypeInstance.start();
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  // Главный цикл игры
  loop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.currentMode) {
      this.currentMode.update(deltaTime); // Обновление текущего режима
      this.currentMode.render(); // Рендеринг текущего режима
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  // Остановка игрового цикла
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      // console.log('Game loop stopped.');
    }
  }

  // Обновление текущего состояния (неявно используется режимами)
  update(deltaTime) {
    if (this.gameTypeInstance && this.gameTypeInstance.update) {
      this.gameTypeInstance.update(deltaTime);
    }
    this.sceneManager.update(deltaTime);
    this.render();
  }

  // Рендеринг текущего состояния (неявно используется режимами)
  render() {
    this.renderer.clear();
    this.sceneManager.render(this.renderer.context);

    if (this.selectedObject) {
      Highlighter.highlightObject(
        this.renderer.context,
        this.selectedObject,
        'purple',
        'rgba(200, 100, 255, 0.2)'
      );
    }
  }
}

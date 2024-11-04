// Core.js
import { GraphicalContext } from './GraphicalContext.js';
import { GameTypeFactory } from './GameTypeFactory.js';
import { ColorMixin } from './ColorMixin.js';

export class Core {
  constructor({ canvasId, renderType = '2d', backgroundColor = 'black', sceneManager, width = 900, height = 600 }) {
    this.renderType = renderType;
    console.log(renderType)
    const normalizedBackgroundColor = ColorMixin(backgroundColor, renderType);

    this.graphicalContext = new GraphicalContext(canvasId, renderType, normalizedBackgroundColor, width, height);
    this.renderer = this.graphicalContext.getRenderer();
    this.sceneManager = sceneManager;
    this.lastTime = 0;
    this.loop = this.loop.bind(this);
    this.gameTypeInstance = null;
    this.isGuiMode = false;
    this.animationFrameId = null; // Добавлено
  }

  setGameType(gameType) {
    if (gameType) {
      console.log(`Установка типа игры: ${gameType}`);
      this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType);
      if (!this.gameTypeInstance) {
        console.error(`Ошибка: тип игры ${gameType} не загружен.`);
      }
    }
  }

  getSceneManager() {
    return this.sceneManager;
  }

  enableGuiMode() {
    this.isGuiMode = true;
    console.log('Режим GUI активирован.');
    this.render();
  }

  disableGuiMode() {
    this.isGuiMode = false;
    console.log('Режим GUI деактивирован.');
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
      this.animationFrameId = requestAnimationFrame(this.loop); // Изменено
    }
  }

  loop(timestamp) {
    if (!this.isGuiMode) {
      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;

      if (this.gameTypeInstance && this.gameTypeInstance.update) {
        this.gameTypeInstance.update(deltaTime);
      }

      this.sceneManager.update(deltaTime);

      this.renderer.clear();
      this.sceneManager.render(this.renderer.context);

      // Продолжаем цикл
      this.animationFrameId = requestAnimationFrame(this.loop); // Изменено
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log('Игровой цикл остановлен.');
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
  }
}

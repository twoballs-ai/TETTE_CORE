// Core.js
import { GraphicalContext } from './GraphicalContext.js';
import { GameTypeFactory } from './GameTypeFactory.js';
import { ColorMixin } from './ColorMixin.js';

export class Core {
  constructor({ canvasId, renderType = '2d', backgroundColor = 'black', sceneManager, width = 900, height = 600 }) {
    const normalizedBackgroundColor = ColorMixin(backgroundColor, renderType);

    // Инициализация графического контекста и рендерера
    this.graphicalContext = new GraphicalContext(canvasId, renderType, normalizedBackgroundColor, width, height);
    this.renderer = this.graphicalContext.getRenderer(); // Получаем рендерер из графического контекста
    this.sceneManager = sceneManager;
    this.lastTime = 0;
    this.loop = this.loop.bind(this); // Привязываем метод loop к текущему контексту
    this.gameTypeInstance = null;
  }

  // Устанавливаем тип игры
  setGameType(gameType) {

    if (gameType) {
      console.log(`Установка типа игры: ${gameType}`);
      this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType); // Загружаем тип игры
      if (!this.gameTypeInstance) {
        console.error(`Ошибка: тип игры ${gameType} не загружен.`);
      }
    }
  }

  // Старт игрового цикла
  async start() {
    
    // Инициализация рендерера (если это необходимо)
    if (typeof this.renderer.init === 'function') {
      await this.renderer.init();
    }

    // Запуск типа игры, если он определен
    if (this.gameTypeInstance && typeof this.gameTypeInstance.start === 'function') {
      this.gameTypeInstance.start();
    }

    // Запуск игрового цикла
    requestAnimationFrame(this.loop);
  }

  // Основной игровой цикл
  loop(timestamp) {
    const deltaTime = timestamp - this.lastTime; // Рассчитываем дельту времени между кадрами
    this.lastTime = timestamp;
  
    // Обновляем тип игры (если он установлен)
    if (this.gameTypeInstance && this.gameTypeInstance.update) {
      this.gameTypeInstance.update(deltaTime);
    }
  
    // Обновляем менеджер сцен
    this.sceneManager.update(deltaTime);
  
    // Рендерим текущую сцену через SceneManager
    this.renderer.clear(); // Очищаем экран
    this.sceneManager.render(this.renderer.context); // Рендерим сцену
    // Продолжаем цикл
    requestAnimationFrame(this.loop);
  }
}

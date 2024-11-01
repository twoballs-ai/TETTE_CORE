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
    this.isGuiMode = false; // Флаг режима GUI
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

  // Включаем режим GUI
  enableGuiMode() {
    this.isGuiMode = true;
    console.log('Режим GUI активирован.');
    this.render(); // Обновляем рендер вручную для отображения статической сцены
  }

  // Выключаем режим GUI
  disableGuiMode() {
    this.isGuiMode = false;
    console.log('Режим GUI деактивирован.');
    this.start(); // Перезапуск игрового цикла при выходе из режима GUI
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
    if (!this.isGuiMode) {
      requestAnimationFrame(this.loop);
    }
  }

  // Основной игровой цикл
  loop(timestamp) {
    if (!this.isGuiMode) {
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

  // Метод обновления для использования в режиме GUI
  update(deltaTime) {
    // Обновляем тип игры, если установлен
    if (this.gameTypeInstance && this.gameTypeInstance.update) {
      this.gameTypeInstance.update(deltaTime);
    }
    // Обновляем сцену
    this.sceneManager.update(deltaTime);
    this.render();
  }

  // Рендеринг сцены
  render() {
    this.renderer.clear(); // Очищаем экран
    this.sceneManager.render(this.renderer.context); // Рендерим текущую сцену
  }
}

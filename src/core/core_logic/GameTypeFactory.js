// GameTypeFactory.js
import { PlatformerGameType } from '../../gameTypePresets/PlatformerGameType.js';
// Добавьте другие типы игр по необходимости

export class GameTypeFactory {
  constructor(core) {
    this.core = core;
  }

  loadGameType(gameType) {
    console.log(`Загрузка типа игры: ${gameType}`); // Отладочный вывод
    switch (gameType) {
      case 'platformer':
        console.log(this.core)
        console.log(`Создание экземпляра PlatformerGameType для: ${gameType}`);
        return new PlatformerGameType(this.core);
      // Добавьте другие типы игр по необходимости
      default:
        console.warn(`Неизвестный тип игры: ${gameType}`);
        return null;
    }
  }
}

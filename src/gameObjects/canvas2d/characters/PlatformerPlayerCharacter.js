// PlatformerPlayerCharacter.js
import { Character } from './Character.js';

export class PlatformerPlayerCharacter extends Character {
  constructor(options) {
    super({ ...options, health: 100, magic: 100, shots: 10, score: 0 });
    this.magic = options.magic || 100;  // Магия для игрока
    this.shots = options.shots || 10;   // Выстрелы игрока
  }

  update(deltaTime) {
    super.update(deltaTime); // Используем базовое обновление
    // Добавьте уникальную логику обновления для игрока, если нужно
  }

  render(context) {
    super.render(context); // Вызов базового рендера
    // Добавьте уникальную логику рендеринга для игрока, если нужно
  }

  shoot() {
    if (this.shots > 0) {
      this.shots -= 1;
      console.log("Выстрел произведен!");
    } else {
      console.log("Нет патронов!");
    }
  }

  useMagic(amount) {
    if (this.magic >= amount) {
      this.magic -= amount;
      console.log("Использована магия");
    } else {
      console.log("Недостаточно магии");
    }
  }
}

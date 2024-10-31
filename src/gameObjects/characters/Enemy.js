// Enemy.js
import { Character } from './Character.js';

export class Enemy extends Character {
  constructor(options) {
    super({ ...options, health: 50, speed: 20 });
  }

  update(deltaTime) {
    super.update(deltaTime); // Используем базовое обновление
    // Добавьте уникальную логику обновления для врага, например, патрулирование
    this.patrol();
  }

  patrol() {
    // Пример логики патрулирования для врага
    if (this.x <= this.leftBoundary) {
      this.rigidBody.velocityX = this.speed;
      this.facingDirection = 1;
    } else if (this.x + this.width >= this.rightBoundary) {
      this.rigidBody.velocityX = -this.speed;
      this.facingDirection = -1;
    }
  }

  render(context) {
    super.render(context); // Вызов базового рендеринга
  }
}

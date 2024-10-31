// RigidBody2d.js
export class RigidBody2d {
    constructor({ mass = 1, friction = 0.9, isStatic = false } = {}) {
      this.mass = mass;
      this.friction = friction;
      this.isStatic = isStatic;
      this.velocityX = 0;
      this.velocityY = 0;
      this.onGround = false;
      // Добавляем позиции и размеры
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    }
  }
  
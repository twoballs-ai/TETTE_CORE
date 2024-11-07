import { RigidBody2d } from '../../core/physics/RigidBody2d.js';

export class Canvas2dGameObject {
  constructor({
    x,
    y,
    width = null,
    height = null,
    radius = null,
    color,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    if (this.radius !== null) {
      this.width = this.radius * 2;
      this.height = this.radius * 2;
    } else {
      this.width = width;
      this.height = height;
    }

    this.color = color;
    this.layer = layer;

    // Поддержка физики
    if (enablePhysics) {
      this.rigidBody = new RigidBody2d({ isStatic });
      this.rigidBody.x = this.x;
      this.rigidBody.y = this.y;
      this.rigidBody.width = this.width;
      this.rigidBody.height = this.height;
    } else {
      this.rigidBody = null;
    }
  }

  serialize() {
    return {
      // Сериализуйте необходимые свойства
      x: this.x,
      y: this.y,
      color: this.color,
      // Добавьте другие свойства
    };
  }

  static deserialize(data) {
    const obj = new Canvas2dGameObject();
    // Восстанавливаем свойства из данных
    obj.x = data.x;
    obj.y = data.y;
    obj.color = data.color;
    // Добавьте другие свойства
    return obj;
  }
  // Метод для обновления позиции объекта
  update(deltaTime) {
    if (this.rigidBody) {
      // Если физика включена, обновляем позиции из rigidBody
      this.x = this.rigidBody.x;
      this.y = this.rigidBody.y;
    } else {
      // Обновляем позицию на основе скорости и времени
      this.x += this.speedX * deltaTime / 1000;  // Скорость в пикселях/секунду
      this.y += this.speedY * deltaTime / 1000;
    }
  }

  // Метод для рендеринга объекта (будет переопределяться в дочерних классах)
  render(context) {
    // Этот метод будет реализован в конкретных примитивах (например, квадрат, круг)
    // context — это контекст 2D/WebGL, передаваемый для рендеринга
  }
}
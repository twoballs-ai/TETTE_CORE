import { RigidBody2d } from '../../core/physics/RigidBody2d.js';

export class GameObject {
  constructor({ x, y, width, height, color, enablePhysics = false, isStatic = false, layer = 0 }) {
    this.x = x;  // Позиция по X
    this.y = y;  // Позиция по Y
    this.width = width;  // Ширина объекта
    this.height = height;  // Высота объекта
    this.color = color;  // Цвет объекта
    this.layer = layer;  // Слой для рендеринга (чем меньше значение, тем раньше рендерится)

    // Добавляем поддержку физики
    if (enablePhysics) {
      this.rigidBody = new RigidBody2d({
        isStatic: isStatic
      });
      this.rigidBody.x = this.x;
      this.rigidBody.y = this.y;
      this.rigidBody.width = this.width;
      this.rigidBody.height = this.height;
    } else {
      this.rigidBody = null;
    }
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
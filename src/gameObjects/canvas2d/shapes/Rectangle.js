import { GameObject } from '../Canvas2dGameObject.js';

export class Rectangle extends GameObject {
  constructor(x, y, width, height = width, color, borderColor = null, borderWidth = 0, round = 0) {
    super(x, y, width, height, color); // Теперь ширина и высота могут быть разными
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.round = round;
  }

  // Метод для рендеринга квадрата/прямоугольника
  render(context) {
    context.beginPath();

    // Если нужно закруглить углы
    if (this.round > 0) {
      this.roundedRect(context, this.x, this.y, this.width, this.height, this.round);
    } else {
      context.rect(this.x, this.y, this.width, this.height);
    }

    // Основной цвет заливки
    context.fillStyle = this.color;
    context.fill();

    // Если есть граница, рисуем её
    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }

    context.closePath();
  }

  // Метод для рисования закругленного прямоугольника
  roundedRect(context, x, y, width, height, radius) {
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
  }
}

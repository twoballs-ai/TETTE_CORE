import { GameObject } from '../gameObject.js';

export class Circle extends GameObject {
  constructor(x, y, radius, startAngle = 0, endAngle = 2 * Math.PI, color = 'black', borderColor = null, borderWidth = 0) {
    super(x, y, radius * 2, radius * 2, color);
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  // Метод для рендеринга круга или дуги
  render(context) {
    context.beginPath();

    // Рисуем дугу или круг в зависимости от углов
    context.arc(this.x + this.radius, this.y + this.radius, this.radius, this.startAngle, this.endAngle);

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
}

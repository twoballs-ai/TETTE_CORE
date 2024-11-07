import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Star extends Canvas2dGameObject {
  constructor({
    x,
    y,
    radius,
    points,
    color = 'black',
    borderColor = null,
    borderWidth = 0,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    // Передаем параметры в базовый конструктор, ширина и высота равны диаметру звезды
    super({
      x,
      y,
      width: radius * 2,
      height: radius * 2,
      color,
      enablePhysics,
      isStatic,
      layer,
    });

    this.radius = radius;
    this.points = points;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  render(context) {
    const step = Math.PI / this.points; // Шаг для расчета углов
    context.beginPath();
    
    // Начальная точка звезды
    context.moveTo(
      this.x + this.radius * Math.cos(0),
      this.y - this.radius * Math.sin(0)
    );

    // Построение звезды
    for (let i = 0; i <= 2 * this.points; i++) {
      const angle = i * step;
      const radius = i % 2 === 0 ? this.radius : this.radius / 2;
      context.lineTo(
        this.x + radius * Math.cos(angle),
        this.y - radius * Math.sin(angle)
      );
    }

    context.closePath();

    // Заливка звезды
    context.fillStyle = this.color;
    context.fill();

    // Отрисовка границы, если она задана
    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }
  }
}

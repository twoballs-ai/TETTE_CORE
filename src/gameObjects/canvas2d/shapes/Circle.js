import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Circle extends Canvas2dGameObject {
  constructor({
    x,
    y,
    radius,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    color = 'black',
    borderColor = null,
    borderWidth = 0,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    super({ x, y, radius, color, enablePhysics, isStatic, layer });
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  // Метод для проверки, находится ли точка внутри круга
  containsPoint(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  // Метод для получения ограничивающего прямоугольника
  getBoundingBox() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2,
    };
  }

  // Метод для рендеринга круга
  render(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    context.fillStyle = this.color;
    context.fill();

    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }

    context.closePath();
  }
}

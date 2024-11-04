import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Circle extends Canvas2dGameObject {
  constructor(x, y, radius, startAngle = 0, endAngle = 2 * Math.PI, color = 'black', borderColor = null, borderWidth = 0) {
    super({ x, y, radius, color });
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  render(context) {
    context.beginPath();
    context.arc(this.x + this.radius, this.y + this.radius, this.radius, this.startAngle, this.endAngle);
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

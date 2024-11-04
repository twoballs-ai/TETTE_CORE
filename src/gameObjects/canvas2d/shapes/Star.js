import { GameObject } from '../Canvas2dGameObject.js';

export class Star extends GameObject {
  constructor(x, y, radius, points, color = 'black', borderColor = null, borderWidth = 0) {
    super(x, y, radius * 2, radius * 2, color);
    this.radius = radius;
    this.points = points;
    this.color = color;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  render(context) {
    const step = Math.PI / this.points;
    context.beginPath();
    context.moveTo(this.x + this.radius * Math.cos(0), this.y - this.radius * Math.sin(0));

    for (let i = 0; i <= 2 * this.points; i++) {
      const angle = i * step;
      const radius = i % 2 === 0 ? this.radius : this.radius / 2;
      context.lineTo(this.x + radius * Math.cos(angle), this.y - radius * Math.sin(angle));
    }

    context.closePath();
    context.fillStyle = this.color;
    context.fill();

    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }
  }
}

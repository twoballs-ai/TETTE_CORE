import { GameObject } from '../gameObject.js';

export class Polygon extends GameObject {
  constructor(vertices, color = 'black', borderColor = null, borderWidth = 0) {
    super(vertices[0].x, vertices[0].y, 0, 0, color); // Используем первую вершину для инициализации
    this.vertices = vertices;
    this.color = color;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  render(context) {
    context.beginPath();
    context.moveTo(this.vertices[0].x, this.vertices[0].y);

    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
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

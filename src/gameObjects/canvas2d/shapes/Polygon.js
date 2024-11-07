import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Polygon extends Canvas2dGameObject {
  constructor({
    vertices,
    color = 'black',
    borderColor = null,
    borderWidth = 0,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    // Определяем минимальные x и y для корректного задания позиции в базовом классе
    const minX = Math.min(...vertices.map(v => v.x));
    const minY = Math.min(...vertices.map(v => v.y));

    super({
      x: minX,
      y: minY,
      width: 0,  // Зададим ширину и высоту как 0, так как для многоугольника они не обязательны
      height: 0,
      color,
      enablePhysics,
      isStatic,
      layer,
    });

    this.vertices = vertices;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  render(context) {
    context.beginPath();
    context.moveTo(this.vertices[0].x, this.vertices[0].y);

    // Рисуем линии к остальным вершинам
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    }

    context.closePath();

    // Заливка основным цветом
    context.fillStyle = this.color;
    context.fill();

    // Рисуем границу, если она задана
    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }
  }
}

import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Ellipse extends Canvas2dGameObject {
  constructor(x, y, rX, rY, rot, start, end, color, borderColor = null, borderWidth = 0) {
    super(x, y, rX * 2, rY * 2, color); // Для эллипса используем радиусы по осям X и Y как размер
    this.rX = rX;
    this.rY = rY;
    this.rot = rot;
    this.start = start;
    this.end = end;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  // Метод для рендеринга эллипса
  render(context) {
    context.beginPath();
    
    // Рисуем эллипс
    context.ellipse(this.x, this.y, this.rX, this.rY, this.rot, this.start, this.end * Math.PI);

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

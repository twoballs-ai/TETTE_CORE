import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Line extends Canvas2dGameObject {
  constructor({
    x1,
    y1,
    x2,
    y2,
    color = 'black',
    widthline = 1,
    lineRounded = 'butt',
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    super({
      x,
      y,
      width,
      height,
      color,
      enablePhysics,
      isStatic,
      layer,
    });

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.widthline = widthline;
    this.lineRounded = lineRounded;
  }

  // Метод для проверки, находится ли точка на линии
  containsPoint(px, py) {
    const distance = this.distanceToSegment(px, py, this.x1, this.y1, this.x2, this.y2);
    return distance <= this.widthline / 2;
  }

  // Метод для расчёта расстояния от точки до линии
  distanceToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    
    if (lengthSquared === 0) return Math.hypot(px - x1, py - y1);

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;

    return Math.hypot(px - closestX, py - closestY);
  }

  // Метод для получения ограничивающего прямоугольника
  getBoundingBox() {
    return {
      x: Math.min(this.x1, this.x2) - this.widthline / 2,
      y: Math.min(this.y1, this.y2) - this.widthline / 2,
      width: Math.abs(this.x2 - this.x1) + this.widthline,
      height: Math.abs(this.y2 - this.y1) + this.widthline,
    };
  }

  // Метод для рендеринга линии
  render(context) {
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);

    context.strokeStyle = this.color;
    context.lineWidth = this.widthline;
    context.lineCap = this.lineRounded;
    context.stroke();
    context.closePath();
  }
}

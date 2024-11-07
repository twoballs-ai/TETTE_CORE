import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class BezierCurve extends Canvas2dGameObject {
  constructor({
    startX,
    startY,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
    color = 'black',
    widthline = 1,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    super({
      x: startX,
      y: startY,
      color,
      enablePhysics,
      isStatic,
      layer,
    });

    this.startX = startX;
    this.startY = startY;
    this.controlX1 = controlX1;
    this.controlY1 = controlY1;
    this.controlX2 = controlX2;
    this.controlY2 = controlY2;
    this.endX = endX;
    this.endY = endY;
    this.widthline = widthline;
  }

  // Метод для проверки, находится ли точка поблизости от кривой Безье
  containsPoint(x, y) {
    const tolerance = 5; // Допустимое расстояние от линии для "выбора"
    
    // Используем квадрат расстояния для вычислений (меньше затрат на вычисления)
    const distSquared = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;

    // Разделим кривую на небольшие сегменты и проверим точки на отрезках
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const cx = this.getBezierPoint(t, this.startX, this.controlX1, this.controlX2, this.endX);
      const cy = this.getBezierPoint(t, this.startY, this.controlY1, this.controlY2, this.endY);
      
      if (distSquared(cx, cy, x, y) <= tolerance * tolerance) {
        return true;
      }
    }
    return false;
  }

  // Получение точки на кривой Безье для параметра t
  getBezierPoint(t, p0, p1, p2, p3) {
    const invT = 1 - t;
    return (
      invT ** 3 * p0 +
      3 * invT ** 2 * t * p1 +
      3 * invT * t ** 2 * p2 +
      t ** 3 * p3
    );
  }

  // Метод для получения ограничивающего прямоугольника
  getBoundingBox() {
    const minX = Math.min(this.startX, this.controlX1, this.controlX2, this.endX);
    const maxX = Math.max(this.startX, this.controlX1, this.controlX2, this.endX);
    const minY = Math.min(this.startY, this.controlY1, this.controlY2, this.endY);
    const maxY = Math.max(this.startY, this.controlY1, this.controlY2, this.endY);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  // Метод для рендеринга кривой Безье
  render(context) {
    context.beginPath();
    context.moveTo(this.startX, this.startY);

    context.bezierCurveTo(
      this.controlX1, this.controlY1,
      this.controlX2, this.controlY2,
      this.endX, this.endY
    );

    context.strokeStyle = this.color;
    context.lineWidth = this.widthline;
    context.stroke();

    context.closePath();
  }
}

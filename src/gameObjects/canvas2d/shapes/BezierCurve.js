import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class BezierCurve extends Canvas2dGameObject {
  constructor(startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY, color = 'black', widthline = 1) {
    super(startX, startY, 0, 0, color);
    this.startX = startX;
    this.startY = startY;
    this.controlX1 = controlX1;
    this.controlY1 = controlY1;
    this.controlX2 = controlX2;
    this.controlY2 = controlY2;
    this.endX = endX;
    this.endY = endY;
    this.color = color;
    this.widthline = widthline;
  }

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

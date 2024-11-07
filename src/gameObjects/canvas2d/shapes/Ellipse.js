import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Ellipse extends Canvas2dGameObject {
  constructor({
    x,
    y,
    rX,
    rY,
    rotation = 0,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    color = 'black',
    borderColor = null,
    borderWidth = 0,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    super({
      x,
      y,
      width: rX * 2,
      height: rY * 2,
      color,
      enablePhysics,
      isStatic,
      layer,
    });
    this.rX = rX;
    this.rY = rY;
    this.rotation = rotation;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  // Method to render the ellipse
  render(context) {
    context.beginPath();

    // Draw the ellipse
    context.ellipse(
      this.x,
      this.y,
      this.rX,
      this.rY,
      this.rotation,
      this.startAngle,
      this.endAngle
    );

    // Fill color
    context.fillStyle = this.color;
    context.fill();

    // Draw border if specified
    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }

    context.closePath();
  }
}

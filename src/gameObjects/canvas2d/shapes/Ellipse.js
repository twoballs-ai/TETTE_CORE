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

  // Method to check if a point is within the ellipse
  containsPoint(x, y) {
    // Adjust the point based on rotation
    const cos = Math.cos(-this.rotation);
    const sin = Math.sin(-this.rotation);
    const dx = x - this.x;
    const dy = y - this.y;
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;

    // Check if point is within the ellipse bounds
    return (
      (rotatedX ** 2) / (this.rX ** 2) + (rotatedY ** 2) / (this.rY ** 2) <= 1
    );
  }

  // Method to get the bounding box of the ellipse
  getBoundingBox() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    // Calculating the transformed radii along rotated axes
    const width = Math.abs(this.rX * cos) + Math.abs(this.rY * sin);
    const height = Math.abs(this.rX * sin) + Math.abs(this.rY * cos);

    return {
      x: this.x - width,
      y: this.y - height,
      width: 2 * width,
      height: 2 * height,
    };
  }
}

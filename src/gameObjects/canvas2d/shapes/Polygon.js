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
    const minX = Math.min(...vertices.map(v => v.x));
    const minY = Math.min(...vertices.map(v => v.y));
    const maxX = Math.max(...vertices.map(v => v.x));
    const maxY = Math.max(...vertices.map(v => v.y));

    super({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
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

  // Method to check if a point is inside the polygon using ray-casting algorithm
  containsPoint(x, y) {
    let inside = false;
    for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
      const xi = this.vertices[i].x;
      const yi = this.vertices[i].y;
      const xj = this.vertices[j].x;
      const yj = this.vertices[j].y;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Method to get the bounding box of the polygon
  getBoundingBox() {
    const minX = Math.min(...this.vertices.map(v => v.x));
    const minY = Math.min(...this.vertices.map(v => v.y));
    const maxX = Math.max(...this.vertices.map(v => v.x));
    const maxY = Math.max(...this.vertices.map(v => v.y));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}

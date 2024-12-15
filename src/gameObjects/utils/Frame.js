import { Canvas2dGameObject } from '../canvas2d/Canvas2dGameObject';

export class Frame extends Canvas2dGameObject {
  constructor({
    x,
    y,
    width,
    height = width, // По умолчанию высота равна ширине, если это квадрат
    color = 'black',
    borderColor = null,
    borderWidth = 0,
    round = 0,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
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

    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.round = round;
  }

  // Метод для рендеринга прямоугольника или квадрата
  render(context) {
    context.beginPath();

    // Если углы закруглены, вызываем метод для закруглённого прямоугольника
    if (this.round > 0) {
      this.roundedRect(context, this.x, this.y, this.width, this.height, this.round);
    } else {
      context.rect(this.x, this.y, this.width, this.height);
    }

    // Основной цвет заливки
    context.fillStyle = this.color;
    context.fill();

    // Если граница задана, рисуем её
    if (this.borderColor) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.stroke();
    }

    context.closePath();
  }
  containsPoint(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  // Метод для получения bounding box
  getBoundingBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  // Метод для рисования закруглённого прямоугольника
  roundedRect(context, x, y, width, height, radius) {
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
  }
}

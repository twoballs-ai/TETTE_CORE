import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Sprite extends Canvas2dGameObject {
  constructor(params) {
    super({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      color: null,
      enablePhysics: params.enablePhysics || false,
      isStatic: params.isStatic || false,
      layer: params.layer || 0,
    });

    this.image = params.image;
    this.preserveAspectRatio = params.preserveAspectRatio || false;
  }

  update(deltaTime) {
    if (this.rigidBody) {
      this.x = this.rigidBody.x;
      this.y = this.rigidBody.y;
    }
  }

  containsPoint(x, y) {
    // Проверка, находится ли точка внутри спрайта
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  getBoundingBox() {
    // Возвращаем ограничивающий прямоугольник спрайта
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  render(context) {
    console.log("11111111111111111111111111111111111111111111")
    if (this.image.complete) {
      let renderWidth = this.width;
      let renderHeight = this.height;

      if (this.preserveAspectRatio) {
        const aspectRatio = this.image.width / this.image.height;
        if (this.width / this.height > aspectRatio) {
          renderWidth = this.height * aspectRatio;
        } else {
          renderHeight = this.width / aspectRatio;
        }
      }

      context.drawImage(this.image, this.x, this.y, renderWidth, renderHeight);
    }
  }
}

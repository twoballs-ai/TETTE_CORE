import { GameObject } from '../Canvas2dGameObject.js';
export class Sprite extends GameObject {
  constructor(params) {
    super({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      color: null, // Цвет можно задать null, так как это спрайт
      enablePhysics: params.enablePhysics || false,
      isStatic: params.isStatic || false,
      layer: params.layer || 0  // Добавляем слой рендеринга
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

  render(context) {
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

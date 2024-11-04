import { Canvas2dGameObject } from '../canvas2d/Canvas2dGameObject.js';

export class SpriteGrid extends Canvas2dGameObject {
  constructor({
    image,
    x,
    y,
    width,
    height,
    repeatX = 1,
    repeatY = 1,
    spacingX = 0,
    spacingY = 0,
    preserveAspectRatio = false,
    enablePhysics = false,
    isStatic = false,
    layer = 0  // Новый параметр для слоя
  }) {
    super({
      x: x,
      y: y,
      width: width * repeatX + spacingX * (repeatX - 1),  // Общая ширина сетки
      height: height * repeatY + spacingY * (repeatY - 1), // Общая высота сетки
      color: null,
      enablePhysics: enablePhysics,
      isStatic: isStatic,
      layer: layer  // Устанавливаем слой в родительском классе
    });

    this.image = image;
    this.repeatX = repeatX;
    this.repeatY = repeatY;
    this.spacingX = spacingX;
    this.spacingY = spacingY;
    this.preserveAspectRatio = preserveAspectRatio;
  }

  update(deltaTime) {
    // Если физика включена, обновляем позиции из rigidBody
    if (this.rigidBody) {
      this.x = this.rigidBody.x;
      this.y = this.rigidBody.y;
    }
  }

  render(context) {
    if (this.image.complete) {
      const renderWidth = this.width / this.repeatX;
      const renderHeight = this.height / this.repeatY;

      for (let i = 0; i < this.repeatX; i++) {
        for (let j = 0; j < this.repeatY; j++) {
          context.drawImage(
            this.image,
            this.x + (renderWidth + this.spacingX) * i,
            this.y + (renderHeight + this.spacingY) * j,
            renderWidth,
            renderHeight
          );
        }
      }
    }
  }
}

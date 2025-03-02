
import { Sprite } from './Sprite.js';

export function getShapes(renderType) {
  console.log(renderType)
  return {
    
    // Функция для создания спрайта
    sprite: function(params) {
      return new Sprite(
        params.image,
        params.x,
        params.y,
        params.width,
        params.height,
        params.preserveAspectRatio || false
      );
    },

  };
}

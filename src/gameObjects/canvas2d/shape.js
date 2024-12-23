
import { Sprite } from './shapes/Sprite.js'; // Обновлённый класс Sprite
import { SpriteGrid } from './shapes/SpriteGrid.js'; // Обновлённый класс Sprite
import { ColorMixin } from '../../core/core_logic/ColorMixin.js';


export function getShapes(renderType) {
  
  function applyColorMixin(params) {
    return {
      color: ColorMixin(params.color || 'black', renderType),
      borderColor: params.borderColor ? ColorMixin(params.borderColor, renderType) : null,
    };
  }


  return {

    sprite: function (params) {
      return new Sprite({
        image: params.image,
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        preserveAspectRatio: params.preserveAspectRatio || false,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    spriteGrid: function (params) {
      return new SpriteGrid({
        image: params.image,
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        repeatX: params.repeatX || 1,
        repeatY: params.repeatY || 1,
        spacingX: params.spacingX || 0,
        spacingY: params.spacingY || 0,
        preserveAspectRatio: params.preserveAspectRatio || false,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

  };
}

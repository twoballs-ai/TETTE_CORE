import { Rectangle } from './shapes/Rectangle.js';
import { Circle } from './shapes/Circle.js';
import { Ellipse } from './shapes/Ellipse.js';
import { Text } from './shapes/Text.js';
import { Sprite } from './shapes/Sprite.js'; // Обновлённый класс Sprite
import { Line } from './shapes/Line.js';
import { Polygon } from './shapes/Polygon.js';
import { BezierCurve } from './shapes/BezierCurve.js';
import { Star } from './shapes/Star.js';
import { ColorMixin } from '../../core/core_logic/ColorMixin.js'; // Убедитесь в правильности пути
import { SpriteGrid } from '../utils/SpriteGrid.js'; // Импортируем компонент сетки спрайтов
export function getShapes(renderType) {
  console.log("s")
  return {
    // Функция для создания квадрата
    square: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Rectangle({
        x: params.x,
        y: params.y,
        width: params.size,
        height: params.size,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        round: params.round,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания прямоугольника
    rectangle: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Rectangle({
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания круга
    circle: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Circle({
        x: params.x,
        y: params.y,
        radius: params.radius,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания дуги
    arc: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Circle({
        x: params.x,
        y: params.y,
        radius: params.radius,
        startAngle: params.startAngle,
        endAngle: params.endAngle,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания эллипса
    ellipse: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Ellipse({
        x: params.x,
        y: params.y,
        radiusX: params.rX,
        radiusY: params.rY,
        rotation: params.rot || 0,
        startAngle: params.start || 0,
        endAngle: params.end || 2 * Math.PI,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания текста
    text: function(params) {
      const color = ColorMixin(params.color || 'black', renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Text({
        text: params.text,
        x: params.x,
        y: params.y,
        fontSize: params.fontsize || 16,
        fontFamily: params.fontFamily || 'Arial',
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания спрайта
    sprite: function(params) {
      return new Sprite({
        image: params.image,
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        preserveAspectRatio: params.preserveAspectRatio || false,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания сетки спрайтов
    spriteGrid: function(params) {
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
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания линии
    line: function(params) {
      const color = ColorMixin(params.color || 'black', renderType);

      return new Line({
        x1: params.x1,
        y1: params.y1,
        x2: params.x2,
        y2: params.y2,
        color: color,
        lineWidth: params.widthline || 1,
        lineCap: params.lineRounded || 'butt',
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания многоугольника
    polygon: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Polygon({
        vertices: params.vertices,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания кривой Безье
    bezierCurve: function(params) {
      const color = ColorMixin(params.color, renderType);

      return new BezierCurve({
        startX: params.startX,
        startY: params.startY,
        controlX1: params.controlX1,
        controlY1: params.controlY1,
        controlX2: params.controlX2,
        controlY2: params.controlY2,
        endX: params.endX,
        endY: params.endY,
        color: color,
        lineWidth: params.widthline || 1,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания звезды
    star: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Star({
        x: params.x,
        y: params.y,
        radius: params.radius,
        points: params.points,
        color: color,
        borderColor: borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },

    // Функция для создания точки
    point: function(params) {
      const color = ColorMixin(params.color || 'black', renderType);

      return new Circle({
        x: params.x,
        y: params.y,
        radius: params.size || 5,
        color: color,
        enablePhysics: params.enablePhysics || false,  // Поддержка физики
        isStatic: params.isStatic || false,
        layer: params.layer || 0  // Добавлен параметр layer
      });
    },
  };
}

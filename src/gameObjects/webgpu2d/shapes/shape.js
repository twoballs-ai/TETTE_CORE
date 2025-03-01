// shapes.js (в папке 2d или webgl)
import { Rectangle } from './Rectangle.js';
import { Circle } from './Circle.js';
import { Ellipse } from './Ellipse.js';
// import { Text } from '../2d/Text.js'; // к сожалению сложно пока преобразовать в webgl
import { Text } from './Text.js';
import { Sprite } from './Sprite.js';
import { Line } from './Line.js';
import { Polygon } from './Polygon.js';
import { BezierCurve } from './BezierCurve.js';
import { Star } from './Star.js';
import { ColorMixin } from '../../../core/core_logic/ColorMixin.js'; // Убедитесь в правильности пути

export function getShapes(renderType) {
  // console.log(renderType)
  return {
    // Функция для создания квадрата
    square: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Rectangle(
        params.x,
        params.y,
        params.size,
        params.size,
        color,
        borderColor,
        params.borderWidth,
        params.round
      );
    },

    // Функция для создания прямоугольника
    rectangle: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;
      // console.log(params.color)
      // console.log(color)
      return new Rectangle(
        params.x,
        params.y,
        params.width,
        params.height,
        color,
        borderColor,
        params.borderWidth
      );
    },

    // Функция для создания круга
    circle: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Circle(
        params.x,
        params.y,
        params.radius,
        0,
        2 * Math.PI,
        color,
        borderColor,
        params.borderWidth
      );
    },

    // Функция для создания дуги
    arc: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Circle(
        params.x,
        params.y,
        params.radius,
        params.startAngle,
        params.endAngle,
        color,
        borderColor,
        params.borderWidth
      );
    },

    // Функция для создания эллипса
    ellipse: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Ellipse(
        params.x,
        params.y,
        params.rX,
        params.rY,
        params.rot || 0,
        params.start || 0,
        params.end || 2 * Math.PI,
        color,
        borderColor,
        params.borderWidth
      );
    },

    // Функция для создания текста
    text: function(params) {
      const color = ColorMixin(params.color || 'black', renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Text(
        params.text,
        params.x,
        params.y,
        params.fontsize || 16,
        color,
        params.fontFamily || 'Arial',
        borderColor,
        params.borderWidth
      );
    },

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

    // Функция для создания линии
    line: function(params) {
      const color = ColorMixin(params.color || 'black', renderType);

      return new Line(
        params.x1,
        params.y1,
        params.x2,
        params.y2,
        color,
        params.widthline || 1,
        params.lineRounded || 'butt'
      );
    },

    // Функция для создания многоугольника
    polygon: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Polygon(
        params.vertices,
        color,
        borderColor,
        params.borderWidth
      );
    },

    // Функция для создания кривой Безье
    bezierCurve: function(params) {
      const color = ColorMixin(params.color, renderType);

      return new BezierCurve(
        params.startX,
        params.startY,
        params.controlX1,
        params.controlY1,
        params.controlX2,
        params.controlY2,
        params.endX,
        params.endY,
        color,
        params.widthline || 1
      );
    },

    // Функция для создания звезды
    star: function(params) {
      const color = ColorMixin(params.color, renderType);
      const borderColor = params.borderColor ? ColorMixin(params.borderColor, renderType) : null;

      return new Star(
        params.x,
        params.y,
        params.radius,
        params.points,
        color,
        borderColor,
        params.borderWidth
      );
    },

    // Функция для создания точки
    point: function(params) {
      const color = ColorMixin(params.color || 'black', renderType);

      return new Circle(
        params.x,
        params.y,
        params.size || 5,
        0,
        2 * Math.PI,
        color
      );
    },
  };
}

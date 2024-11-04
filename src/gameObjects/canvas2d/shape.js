import { Rectangle } from './shapes/Rectangle.js';
import { Circle } from './shapes/Circle.js';
import { Ellipse } from './shapes/Ellipse.js';
import { Text } from './shapes/Text.js';
import { Sprite } from './shapes/Sprite.js'; // Обновлённый класс Sprite
import { Line } from './shapes/Line.js';
import { Polygon } from './shapes/Polygon.js';
import { BezierCurve } from './shapes/BezierCurve.js';
import { Star } from './shapes/Star.js';
import { ColorMixin } from '../../core/core_logic/ColorMixin.js';
import { SpriteGrid } from '../utils/SpriteGrid.js';

export function getShapes(renderType) {

  function applyColorMixin(params) {
    return {
      color: ColorMixin(params.color || 'black', renderType),
      borderColor: params.borderColor ? ColorMixin(params.borderColor, renderType) : null,
    };
  }

  return {
    square: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Rectangle({
        x: params.x,
        y: params.y,
        width: params.size,
        height: params.size,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        round: params.round,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    rectangle: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Rectangle({
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    circle: function (params) {
      console.log("dddd")
      const { color, borderColor } = applyColorMixin(params);
      console.log(params)
      return new Circle({
        x: params.x,
        y: params.y,
        radius: params.radius,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    arc: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Circle({
        x: params.x,
        y: params.y,
        radius: params.radius,
        startAngle: params.startAngle,
        endAngle: params.endAngle,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    ellipse: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Ellipse({
        x: params.x,
        y: params.y,
        radiusX: params.rX,
        radiusY: params.rY,
        rotation: params.rot || 0,
        startAngle: params.start || 0,
        endAngle: params.end || 2 * Math.PI,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    text: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Text({
        text: params.text,
        x: params.x,
        y: params.y,
        fontSize: params.fontsize || 16,
        fontFamily: params.fontFamily || 'Arial',
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

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

    line: function (params) {
      const { color } = applyColorMixin(params);
      return new Line({
        x1: params.x1,
        y1: params.y1,
        x2: params.x2,
        y2: params.y2,
        color,
        lineWidth: params.widthline || 1,
        lineCap: params.lineRounded || 'butt',
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    polygon: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Polygon({
        vertices: params.vertices,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    bezierCurve: function (params) {
      const { color } = applyColorMixin(params);
      return new BezierCurve({
        startX: params.startX,
        startY: params.startY,
        controlX1: params.controlX1,
        controlY1: params.controlY1,
        controlX2: params.controlX2,
        controlY2: params.controlY2,
        endX: params.endX,
        endY: params.endY,
        color,
        lineWidth: params.widthline || 1,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    star: function (params) {
      const { color, borderColor } = applyColorMixin(params);
      return new Star({
        x: params.x,
        y: params.y,
        radius: params.radius,
        points: params.points,
        color,
        borderColor,
        borderWidth: params.borderWidth,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },

    point: function (params) {
      const { color } = applyColorMixin(params);
      return new Circle({
        x: params.x,
        y: params.y,
        radius: params.size || 5,
        color,
        enablePhysics: params.enablePhysics || false,
        isStatic: params.isStatic || false,
        layer: params.layer || 0,
      });
    },
  };
}

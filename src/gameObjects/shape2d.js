// shape2d.js
import { getShapeFactory } from '../core/core_logic/ShapeFactory.js';

export function getShape2d(renderType) {
  console.log(renderType)
  return getShapeFactory(renderType);
}
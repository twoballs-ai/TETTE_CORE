import * as shapes2d from '../../gameObjects/shapes/2d/shape.js';
import * as shapesWebGL from '../../gameObjects/shapes/webgl/shape.js';
import * as shapesWebGPU from '../../gameObjects/shapes/webgpu/shape.js'; // WebGPU версии

export function getShapeFactory(renderType) {
  if (renderType === '2d') {
    return shapes2d.getShapes(renderType);
  } else if (renderType === 'webgl') {
    return shapesWebGL.getShapes(renderType);
  } else if (renderType === 'webgpu') {
    return shapesWebGPU.getShapes(renderType); // WebGPU поддержка
  } else {
    throw new Error('Unsupported render type: ' + renderType);
  }
}
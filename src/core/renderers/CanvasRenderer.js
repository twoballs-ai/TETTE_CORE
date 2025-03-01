import { Renderer } from '../core_logic/Renderer.js';

export class CanvasRenderer extends Renderer {
  constructor(graphicalContext, backgroundColor) { // Удален цвет по умолчанию
    super(graphicalContext);
    this.backgroundColor = backgroundColor; // Устанавливаем переданный цвет фона
    if (!this.backgroundColor) {
      throw new Error('Background color is required for CanvasRenderer.'); // Ошибка, если цвет фона не передан
    }
  }

  // Очищаем экран и устанавливаем фон
  clear() {
    // Заливаем фон
    this.context.fillStyle = this.backgroundColor; // Используем переданный цвет фона
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); // Заливаем весь канвас
  }

  // Рендерим объекты сцены
  // render(scene) {
  //   // console.log("sss")
  //   this.clear(); // Очищаем экран перед отрисовкой
  
  //   // Рендерим объекты текущей сцены
  //   if (scene && scene.gameObjects) {
  //     scene.gameObjects.forEach(entity => {
  //       this.drawEntity(entity);
  //     });
  //   } else {
  //     console.error("No game objects found in the scene!");
  //   }
  // }
  // Рендеринг конкретного объекта
  drawEntity(entity) {
    // Если объект имеет метод render, вызываем его
    if (entity && typeof entity.render === 'function') {
      entity.render(this.context);
    } else {
      console.error("Object does not have a render method!");
    }
  }
}

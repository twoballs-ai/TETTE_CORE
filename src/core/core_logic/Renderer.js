export class Renderer {
    constructor(graphicalContext) {
      if (new.target === Renderer) {
        throw new TypeError('Cannot instantiate abstract class Renderer');
      }
      this.canvas = graphicalContext.getCanvas(); // Получаем canvas
      this.context = graphicalContext.getContext(); // Получаем контекст
    }
  
    // Очищаем экран (реализуется в наследниках)
    clear() {
      throw new Error('Метод "clear()" должен быть реализован в подклассе.');
    }
  
    // Рендеринг сцены (реализуется в наследниках)
    render(scene) {
      throw new Error('Метод "render(scene)" должен быть реализован в подклассе.');
    }
}

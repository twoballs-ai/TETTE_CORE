import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Text extends Canvas2dGameObject {
  constructor({
    text,
    x,
    y,
    fontsize = 16,
    color = 'black',
    fontFamily = 'Arial',
    borderColor = null,
    borderWidth = 0,
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    // Передаем координаты и цвет в базовый конструктор
    super({
      x,
      y,
      width: 0,  // Текст не требует конкретной ширины и высоты для базового класса
      height: 0,
      color,
      enablePhysics,
      isStatic,
      layer,
    });

    this.text = text;
    this.fontsize = fontsize;
    this.fontFamily = fontFamily;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  // Метод для рендеринга текста
  render(context) {
    context.beginPath();

    // Устанавливаем шрифт и цвет текста
    context.font = `${this.fontsize}px ${this.fontFamily}`;
    context.fillStyle = this.color;
    
    // Отрисовываем текст
    context.fillText(this.text, this.x, this.y);

    // Если есть граница, рисуем её
    if (this.borderColor && this.borderWidth > 0) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderWidth;
      context.strokeText(this.text, this.x, this.y);
    }

    context.closePath();
  }

  // Метод для проверки, находится ли точка внутри текста
  containsPoint(px, py) {
    const boundingBox = this.getBoundingBox();
    return (
      px >= boundingBox.x &&
      px <= boundingBox.x + boundingBox.width &&
      py >= boundingBox.y &&
      py <= boundingBox.y + boundingBox.height
    );
  }

  // Метод для получения ограничивающего прямоугольника текста
  getBoundingBox() {
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${this.fontsize}px ${this.fontFamily}`;
    const width = context.measureText(this.text).width;
    const height = this.fontsize; // Высоту текста можно оценить по размеру шрифта

    return {
      x: this.x,
      y: this.y - height, // Верхняя граница текста начинается выше по y-координате
      width: width,
      height: height,
    };
  }
}

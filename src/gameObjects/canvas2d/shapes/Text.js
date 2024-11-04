import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Text extends Canvas2dGameObject {
  constructor(text, x, y, fontsize = 16, color = 'black', fontFamily = 'Arial', borderColor = null, borderWidth = 0) {
    // Передаем координаты и цвет в конструктор базового класса
    super(x, y, 0, 0, color);
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
}

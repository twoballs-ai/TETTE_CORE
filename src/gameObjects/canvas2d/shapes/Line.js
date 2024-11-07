import { Canvas2dGameObject } from '../Canvas2dGameObject.js';

export class Line extends Canvas2dGameObject {
  constructor({
    x1,
    y1,
    x2,
    y2,
    color = 'black',
    widthline = 1,
    lineRounded = 'butt',
    enablePhysics = false,
    isStatic = false,
    layer = 0,
  }) {
    // Рассчитываем начальную позицию и размеры линии для базового конструктора
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    super({
      x,
      y,
      width,
      height,
      color,
      enablePhysics,
      isStatic,
      layer,
    });

    // Устанавливаем свойства линии
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.widthline = widthline;
    this.lineRounded = lineRounded;
  }

  // Метод для рендеринга линии
  render(context) {
    context.beginPath();
    
    // Начальная точка
    context.moveTo(this.x1, this.y1);
    
    // Конечная точка
    context.lineTo(this.x2, this.y2);

    // Цвет и ширина линии
    context.strokeStyle = this.color;
    context.lineWidth = this.widthline;

    // Установка формы концов линии
    context.lineCap = this.lineRounded;

    // Рисуем линию
    context.stroke();
    
    context.closePath();
  }
}

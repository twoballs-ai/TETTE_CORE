import { GameObject } from '../gameObject.js';

export class Line extends GameObject {
  constructor(x1, y1, x2, y2, color = 'black', widthline = 1, lineRounded = 'butt') {
    super(x1, y1, x2 - x1, y2 - y1, color); // x2 и y2 используем для вычисления длины линии
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.widthline = widthline;
    this.lineRounded = lineRounded; // Возможные значения: 'butt', 'round', 'square'
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

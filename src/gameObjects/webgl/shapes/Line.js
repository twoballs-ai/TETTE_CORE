import { Canvas2dGameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class Line extends Canvas2dGameObject {
  constructor(x1, y1, x2, y2, color, widthline = 1, lineRounded = 'butt') {
    super(x1, y1, x2 - x1, y2 - y1, color); // Используем длину линии для ширины и высоты объекта
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.widthline = widthline;
    this.lineRounded = lineRounded; // Возможные значения: 'butt', 'round', 'square'

    // Вершины для линии
    this.vertices = [
      this.x1, this.y1, // Первая точка линии
      this.x2, this.y2  // Вторая точка линии
    ];

    // Цвет для каждой вершины (каждая точка линии)
    this.colors = [
      ...this.color, 1.0,  // Цвет первой вершины
      ...this.color, 1.0   // Цвет второй вершины
    ];

    // Буферы для вершин и цветов
    this.vertexBuffer = null;
    this.colorBuffer = null;
  }

  // Метод для инициализации буферов
  initBuffers(gl) {
    // Создание и заполнение буфера вершин
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    // Создание и заполнение буфера цветов
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
  }

  getTransformationMatrix() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x1, this.y1, 0, 1
    ];
  }

  // Метод для рендеринга через WebGL
  renderWebGL(gl, shaderProgram) {
    if (!this.vertexBuffer || !this.colorBuffer) {
      this.initBuffers(gl);
    }

    // Привязываем буфер вершин
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Привязываем буфер цветов
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(vertexColor);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

    // Передаем матрицу трансформации
    const uTransform = gl.getUniformLocation(shaderProgram, 'uTransform');
    gl.uniformMatrix4fv(uTransform, false, new Float32Array(this.getTransformationMatrix()));

    // Рисуем линию с использованием GL_LINES
    gl.lineWidth(this.widthline); // Установка ширины линии
    gl.drawArrays(gl.LINES, 0, 2);
  }

  // Переопределяем метод render для совместимости, если вызов через Canvas
  render(context) {
    console.warn('render() is not implemented for WebGL Line.');
  }
}

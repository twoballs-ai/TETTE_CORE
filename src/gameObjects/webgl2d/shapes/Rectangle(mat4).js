// Rectangle.js работает но надо поправить импорт
import { GameObject } from '../gameObject.js';
import { mat4 } from 'gl-matrix/esm/index.js'; 

export class Rectangle extends GameObject {
  constructor(x, y, width, height, color, borderColor = null, borderWidth = 0, round = 0) {
    super(x, y, width, height, color);

    // Вершины в локальных координатах (относительно (0, 0))
    this.vertices = [
      0, 0,                // Верхний левый угол
      width, 0,            // Верхний правый угол
      width, height,       // Нижний правый угол
      0, height            // Нижний левый угол
    ];

    // Устанавливаем цвет для каждой вершины
    this.colors = [
      ...color, 1.0,  // Цвет вершины 1
      ...color, 1.0,  // Цвет вершины 2
      ...color, 1.0,  // Цвет вершины 3
      ...color, 1.0   // Цвет вершины 4
    ];

    // Буферы для вершин и цветов
    this.vertexBuffer = null;
    this.colorBuffer = null;

    // Матрица модели
    this.modelMatrix = mat4.create();
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

  // Обновление матрицы модели
  updateModelMatrix() {
    // Сбрасываем матрицу к единичной
    mat4.identity(this.modelMatrix);

    // Применяем трансляцию на текущие координаты x и y
    mat4.translate(this.modelMatrix, this.modelMatrix, [this.x, this.y, 0]);
  }

  // Метод для рендеринга через WebGL
  renderWebGL(gl, shaderProgram) {
    if (!this.vertexBuffer || !this.colorBuffer) {
      this.initBuffers(gl);
    }

    // Обновляем матрицу модели перед отрисовкой
    this.updateModelMatrix();

    // Привязываем буфер вершин
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    if (vertexPosition === -1) {
      console.error('Attribute aVertexPosition not found in shader program.');
    }
    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Привязываем буфер цветов
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    if (vertexColor === -1) {
      console.error('Attribute aVertexColor not found in shader program.');
    }
    gl.enableVertexAttribArray(vertexColor);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

    // Передаем матрицу модели в шейдер
    const uTransform = gl.getUniformLocation(shaderProgram, 'uTransform');
    if (uTransform === null) {
      console.error('Uniform uTransform not found in shader program.');
    }
    gl.uniformMatrix4fv(uTransform, false, this.modelMatrix);

    // Рисуем прямоугольник
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  // Переопределяем метод render для совместимости, если вызов через Canvas
  render(context) {
    console.warn('render() is not implemented for WebGL Rectangle.');
  }
}

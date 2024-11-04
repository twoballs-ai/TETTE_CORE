import { Canvas2dGameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class Rectangle extends Canvas2dGameObject {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);

    // Вершины в локальных координатах
    this.vertices = [
      0, 0,
      this.width, 0,
      this.width, this.height,
      0, this.height
    ];

    // Цвета вершин
    this.colors = [
      ...this.color, 1.0,  // Добавьте альфа-канал, если необходимо
      ...this.color, 1.0,
      ...this.color, 1.0,
      ...this.color, 1.0
    ];

    // Буферы
    this.vertexBuffer = null;
    this.colorBuffer = null;
  }

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
      this.x, this.y, 0, 1
    ];
  }

  renderWebGL(gl, shaderProgram) {
    if (!this.vertexBuffer || !this.colorBuffer) {
      this.initBuffers(gl);
    }

    // Привязка буфера вершин
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Привязка буфера цветов
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(vertexColor);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

    // Передача матрицы трансформации
    const uTransform = gl.getUniformLocation(shaderProgram, 'uTransform');
    gl.uniformMatrix4fv(uTransform, false, new Float32Array(this.getTransformationMatrix()));

    // Рисуем прямоугольник
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}

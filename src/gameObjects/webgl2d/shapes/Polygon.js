import { Canvas2dGameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class Polygon extends Canvas2dGameObject {
  constructor(vertices, color) {
    // Определяем начальные координаты как координаты первой вершины
    super(vertices[0].x, vertices[0].y, 0, 0, color);

    // Вершины в локальных координатах относительно первой вершины
    this.vertices = [];
    vertices.forEach(v => {
      this.vertices.push(v.x - this.x, v.y - this.y);
    });

    // Цвет для каждой вершины (с альфа-каналом)
    this.colors = [];
    for (let i = 0; i < vertices.length; i++) {
      this.colors.push(...this.color, 1.0);
    }

    // Буферы для вершин и цветов
    this.vertexBuffer = null;
    this.colorBuffer = null;
  }

  // Инициализация буферов для WebGL
  initBuffers(gl) {
    // Создаем и заполняем буфер вершин
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    // Создаем и заполняем буфер цветов
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
  }

  // Возвращаем матрицу трансформации для полигона
  getTransformationMatrix() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x, this.y, 0, 1
    ];
  }

  // Рендеринг WebGL
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

    // Передаем матрицу трансформации
    const uTransform = gl.getUniformLocation(shaderProgram, 'uTransform');
    gl.uniformMatrix4fv(uTransform, false, new Float32Array(this.getTransformationMatrix()));

    // Рисуем полигон
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 2);
  }
}

import { GameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class BezierCurve extends GameObject {
  constructor(startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY, color = 'black', widthline = 1) {
    super(startX, startY, 0, 0, color);
    this.startX = startX;
    this.startY = startY;
    this.controlX1 = controlX1;
    this.controlY1 = controlY1;
    this.controlX2 = controlX2;
    this.controlY2 = controlY2;
    this.endX = endX;
    this.endY = endY;
    this.color = color;
    this.widthline = widthline;

    // Количество точек для аппроксимации кривой
    this.numPoints = 100;

    // Массив для хранения точек кривой
    this.vertices = this.calculateBezierVertices();

    // Буферы для WebGL
    this.vertexBuffer = null;
    this.colorBuffer = null;
  }

  // Метод для вычисления точек кривой Безье
  calculateBezierVertices() {
    const vertices = [];

    for (let t = 0; t <= 1; t += 1 / this.numPoints) {
      const x = Math.pow(1 - t, 3) * this.startX +
                3 * Math.pow(1 - t, 2) * t * this.controlX1 +
                3 * (1 - t) * Math.pow(t, 2) * this.controlX2 +
                Math.pow(t, 3) * this.endX;
      
      const y = Math.pow(1 - t, 3) * this.startY +
                3 * Math.pow(1 - t, 2) * t * this.controlY1 +
                3 * (1 - t) * Math.pow(t, 2) * this.controlY2 +
                Math.pow(t, 3) * this.endY;

      vertices.push(x, y);
    }

    return vertices;
  }

  // Метод для инициализации буферов
  initBuffers(gl) {
    // Создание и заполнение буфера вершин
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  }

  // Метод для рендеринга через WebGL
  renderWebGL(gl, shaderProgram) {
    if (!this.vertexBuffer) {
      this.initBuffers(gl);
    }

    // Привязываем буфер вершин
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Передача матрицы трансформации
    const uTransform = gl.getUniformLocation(shaderProgram, 'uTransform');
    gl.uniformMatrix4fv(uTransform, false, new Float32Array(this.getTransformationMatrix()));

    // Рисуем кривую как линию
    gl.lineWidth(this.widthline);
    gl.drawArrays(gl.LINE_STRIP, 0, this.vertices.length / 2);
  }

  // Метод для трансформации позиции (аналогия с другими объектами)
  getTransformationMatrix() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x, this.y, 0, 1
    ];
  }
}

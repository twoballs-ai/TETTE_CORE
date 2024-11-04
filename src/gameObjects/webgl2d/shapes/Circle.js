import { GameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class Circle extends GameObject {
  constructor(x, y, radius, startAngle = 0, endAngle = 2 * Math.PI, color, borderColor = null, borderWidth = 0) {
    super(x, y, radius * 2, radius * 2, color);
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;

    // Определяем вершины в локальной системе координат
    this.vertices = this.calculateCircleVertices();

    // Определяем цвет для каждой вершины
    this.colors = [];
    for (let i = 0; i < this.vertices.length / 2; i++) {
      this.colors.push(...this.color, 1.0);  // Добавляем альфа-канал
    }

    // Буферы для вершин и цветов
    this.vertexBuffer = null;
    this.colorBuffer = null;
  }

  // Метод для вычисления вершин круга в локальной системе координат
  calculateCircleVertices() {
    const vertices = [];
    const steps = 100; // Количество точек для аппроксимации круга

    // Центральная точка круга
    vertices.push(0, 0);  // В локальной системе координат (0, 0)

    // Вычисляем вершины по окружности (локальные координаты)
    for (let t = this.startAngle; t <= this.endAngle; t += (this.endAngle - this.startAngle) / steps) {
      const x = this.radius * Math.cos(t);
      const y = this.radius * Math.sin(t);
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

    // Рисуем круг
    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 2);
  }

  // Переопределяем метод render для совместимости, если вызов через Canvas
  render(context) {
    console.warn('render() is not implemented for WebGL Circle.');
  }
}

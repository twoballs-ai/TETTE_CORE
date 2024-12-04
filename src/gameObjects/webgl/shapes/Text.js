import { Canvas2dGameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class Text extends Canvas2dGameObject {
  constructor(text, x, y, fontsize = 16, color = 'black', fontFamily = 'Arial', borderColor = null, borderWidth = 0) {
    super(x, y, 0, 0, color);
    this.text = text;
    this.fontsize = fontsize;
    this.fontFamily = fontFamily;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.textCanvas = document.createElement('canvas'); // Временный canvas для текста
    this.textCanvasContext = this.textCanvas.getContext('2d'); // Контекст для рисования текста
    this.texture = null; // Текстура для текста
    this.textureLoaded = false;

    this.initTextTexture(); // Инициализация текстовой текстуры
  }

  // Создание текстуры текста
  initTextTexture() {
    // Вычисляем ширину и высоту текста для canvas
    this.textCanvasContext.font = `${this.fontsize}px ${this.fontFamily}`;
    const textWidth = this.textCanvasContext.measureText(this.text).width;
    const textHeight = this.fontsize * 1.5;

    // Устанавливаем размеры canvas на основе размера текста
    this.textCanvas.width = textWidth;
    this.textCanvas.height = textHeight;

    // Устанавливаем шрифт и рисуем текст
    this.textCanvasContext.font = `${this.fontsize}px ${this.fontFamily}`;
    this.textCanvasContext.fillStyle = this.color;
    this.textCanvasContext.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height); // Очистка фона
    this.textCanvasContext.fillText(this.text, 0, this.fontsize);

    // Если есть граница, добавляем обводку
    if (this.borderColor && this.borderWidth > 0) {
      this.textCanvasContext.strokeStyle = this.borderColor;
      this.textCanvasContext.lineWidth = this.borderWidth;
      this.textCanvasContext.strokeText(this.text, 0, this.fontsize);
    }

    this.textureLoaded = false; // Флаг, что текстура еще не загружена
  }

  // Загрузка текстуры в WebGL
  loadTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Устанавливаем параметры текстуры
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Загружаем canvas как текстуру
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.textCanvas
    );

    this.texture = texture;
    this.textureLoaded = true; // Текстура загружена
  }

  // Метод для рендеринга через WebGL
  renderWebGL(gl, shaderProgram) {
    if (!this.textureLoaded) {
      this.loadTexture(gl); // Загружаем текстуру, если она еще не загружена
    }

    if (!this.texture) return;

    // Привязка текстуры
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Установка координат вершин для прямоугольника (фон текста)
    const vertices = [
      this.x, this.y,
      this.x + this.textCanvas.width, this.y,
      this.x + this.textCanvas.width, this.y + this.textCanvas.height,
      this.x, this.y + this.textCanvas.height,
    ];

    // Создаем буфер для вершин
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Привязываем атрибуты позиции вершин
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

    // Устанавливаем координаты текстуры
    const textureCoordinates = [
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ];

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    const textureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(textureCoord);
    gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0);

    // Передача матрицы трансформации
    const uTransform = gl.getUniformLocation(shaderProgram, 'uTransform');
    gl.uniformMatrix4fv(uTransform, false, new Float32Array(this.getTransformationMatrix()));

    // Рендерим текст как текстуру на прямоугольнике
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  // Метод для трансформации позиции
  getTransformationMatrix() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x, this.y, 0, 1
    ];
  }
}

import { GameObject } from '../../canvas2d/Canvas2dGameObject.js';

export class Sprite extends GameObject {
    constructor(image, x, y, width, height, preserveAspectRatio = false) {
        super(x, y, width, height);
        this.image = image;
        this.preserveAspectRatio = preserveAspectRatio;

        this.texture = null; // Текстура изображения
        this.textureLoaded = false;

        // Как только изображение загружено, создаем текстуру
        this.image.onload = () => {
            this.textureLoaded = false; // Сброс флага перед загрузкой текстуры
        };
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

        // Загружаем изображение в текстуру
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.image
        );

        this.texture = texture;
        this.textureLoaded = true;
    }

    // Метод для рендеринга через WebGL
    renderWebGL(gl, shaderProgram) {
        if (!this.textureLoaded) {
            this.loadTexture(gl); // Загружаем текстуру, если она еще не загружена
        }

        if (!this.texture) return;

        // Привязка текстуры
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        let renderWidth = this.width;
        let renderHeight = this.height;

        if (this.preserveAspectRatio) {
            const aspectRatio = this.image.width / this.image.height;
            if (this.width / this.height > aspectRatio) {
                renderWidth = this.height * aspectRatio;
            } else {
                renderHeight = this.width / aspectRatio;
            }
        }

        // Устанавливаем координаты вершин для отображения изображения
        const vertices = [
            this.x, this.y,
            this.x + renderWidth, this.y,
            this.x + renderWidth, this.y + renderHeight,
            this.x, this.y + renderHeight
        ];

        // Буфер для вершин
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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

        // Рендерим прямоугольник с текстурой (спрайт)
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

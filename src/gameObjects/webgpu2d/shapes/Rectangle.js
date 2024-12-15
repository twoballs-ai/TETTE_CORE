// Rectangle.js

import { GameObject } from '../gameObject.js';

export class Rectangle extends GameObject {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);

    // Вершины в локальных координатах
    this.vertices = new Float32Array([
      0, 0,
      this.width, 0,
      this.width, this.height,
      0, this.height,
    ]);

    // Индексы для отрисовки двух треугольников
    this.indices = new Uint16Array([
      0, 1, 2,
      0, 2, 3,
    ]);

    // Цвета вершин
    this.colors = new Float32Array([
      ...this.color, 1.0,
      ...this.color, 1.0,
      ...this.color, 1.0,
      ...this.color, 1.0,
    ]);

    // Буферы
    this.vertexBuffer = null;
    this.colorBuffer = null;
    this.indexBuffer = null;
    this.transformBuffer = null;
    this.bindGroup = null;
  }

  getTransformationMatrix() {
    // Матрица трансформации для позиционирования прямоугольника
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x, this.y, 0, 1,
    ]);
  }

  initBuffers(device, bindGroupLayout) {
    // Создаем и загружаем буфер вершин
    this.vertexBuffer = device.createBuffer({
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);

    // Создаем и загружаем буфер индексов
    this.indexBuffer = device.createBuffer({
      size: this.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, this.indices);

    // Создаем и загружаем буфер цветов
    this.colorBuffer = device.createBuffer({
      size: this.colors.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.colorBuffer, 0, this.colors);

    // Создаем и загружаем буфер униформ для матрицы трансформации
    this.transformBuffer = device.createBuffer({
      size: 16 * 4, // 16 элементов float32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.transformBuffer, 0, this.getTransformationMatrix());

    // Создаем BindGroup для передачи униформы в шейдер
    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.transformBuffer,
          },
        },
      ],
    });
  }

  renderWebGPU(device, passEncoder, bindGroupLayout) {
    if (!this.vertexBuffer || !this.colorBuffer || !this.indexBuffer || !this.transformBuffer) {
      this.initBuffers(device, bindGroupLayout);
    }

    // Обновляем матрицу трансформации
    device.queue.writeBuffer(this.transformBuffer, 0, this.getTransformationMatrix());

    // Устанавливаем буферы вершин и цветов
    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.setVertexBuffer(1, this.colorBuffer);

    // Устанавливаем буфер индексов
    passEncoder.setIndexBuffer(this.indexBuffer, 'uint16');

    // Устанавливаем BindGroup
    passEncoder.setBindGroup(0, this.bindGroup);

    // Вызываем отрисовку
    passEncoder.drawIndexed(6, 1, 0, 0, 0);
  }
}

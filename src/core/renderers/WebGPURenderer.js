// WebGPURenderer.js

import { Renderer } from '../core_logic/Renderer.js';

export class WebGPURenderer extends Renderer {
  constructor(graphicalContext, backgroundColor) {
    super(graphicalContext);
    this.device = null;
    this.context = null;
    this.renderPassDescriptor = null;
    this.pipeline = null;
    this.isInitialized = false;
    this.backgroundColor = backgroundColor || [0, 0, 0, 1]; // Цвет фона по умолчанию
  }

  async init() {
    await this.initializeWebGPU();
    this.isInitialized = true;
  }

  async initializeWebGPU() {
    if (!navigator.gpu) {
      console.error('WebGPU не поддерживается в этом браузере.');
      return;
    }

    // Получаем адаптер и устройство
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.error('Не удалось получить адаптер GPU.');
      return;
    }

    this.device = await adapter.requestDevice();

    // Получаем контекст WebGPU из canvas
    this.context = this.canvas.getContext('webgpu');
    if (!this.context) {
      console.error('Не удалось получить WebGPU контекст из canvas.');
      return;
    }

    // Настраиваем контекст
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: canvasFormat,
      alphaMode: 'opaque',
    });

    // Создаем дескриптор рендер-прохода
    this.renderPassDescriptor = {
      colorAttachments: [{
        view: undefined, // Будет задано в методе render
        clearValue: { r: this.backgroundColor[0], g: this.backgroundColor[1], b: this.backgroundColor[2], a: this.backgroundColor[3] },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    };

    // Инициализируем шейдеры и пайплайн
    await this.initPipeline(canvasFormat);
  }


  async initPipeline(format) {
    // WGSL код вершинного шейдера
    const vertexShaderCode = `
      @group(0) @binding(0)
      var<uniform> uProjection : mat4x4<f32>;

      @group(0) @binding(1)
      var<uniform> uTransform : mat4x4<f32>;

      struct VertexOutput {
        @builtin(position) Position : vec4<f32>,
        @location(0) vColor : vec4<f32>,
      };

      @vertex
      fn main(
        @location(0) aPosition : vec2<f32>,
        @location(1) aColor : vec4<f32>
      ) -> VertexOutput {
        var output : VertexOutput;
        var position : vec4<f32> = vec4<f32>(aPosition, 0.0, 1.0);
        output.Position = uProjection * uTransform * position;
        output.vColor = aColor;
        return output;
      }
    `;

    // WGSL код фрагментного шейдера
    const fragmentShaderCode = `
      @fragment
      fn main(@location(0) vColor : vec4<f32>) -> @location(0) vec4<f32> {
        return vColor;
      }
    `;

    // Создаем модули шейдеров
    const vertexModule = this.device.createShaderModule({
      code: vertexShaderCode,
    });

    const fragmentModule = this.device.createShaderModule({
      code: fragmentShaderCode,
    });

    // Создаем BindGroupLayout для передачи униформ-переменных
    this.bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'uniform' },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'uniform' },
        },
      ],
    });

    // Создаем PipelineLayout с использованием BindGroupLayout
    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout],
    });

    // Создаем графический пайплайн
    this.pipeline = this.device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: vertexModule,
        entryPoint: 'main',
        buffers: [
          {
            // Описание буфера вершин
            arrayStride: 2 * 4, // 2 компоненты по 4 байта (float32)
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
            ],
          },
          {
            // Описание буфера цветов
            arrayStride: 4 * 4, // 4 компоненты по 4 байта (float32)
            attributes: [
              {
                shaderLocation: 1,
                offset: 0,
                format: 'float32x4',
              },
            ],
          },
        ],
      },
      fragment: {
        module: fragmentModule,
        entryPoint: 'main',
        targets: [{
          format: format,
        }],
      },
      primitive: {
        topology: 'triangle-list',
        stripIndexFormat: undefined,
        frontFace: 'ccw',
        cullMode: 'none',
      },
    });

    // Создаем матрицу проекции
    this.createProjectionMatrix();
  }

  createProjectionMatrix() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Ортографическая проекция
    this.projectionMatrix = new Float32Array([
      2 / canvasWidth, 0, 0, 0,
      0, -2 / canvasHeight, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1,
    ]);

    // Создаем буфер для матрицы проекции
    this.projectionBuffer = this.device.createBuffer({
      size: this.projectionMatrix.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.device.queue.writeBuffer(this.projectionBuffer, 0, this.projectionMatrix);
  }

  render(scene) {
    if (!this.isInitialized) {
      console.warn('WebGPURenderer еще не инициализирован.');
      return;
    }

    // Проверяем наличие устройства и контекста перед рендерингом
    if (!this.device || !this.context) {
      console.error('WebGPU устройство или контекст не инициализированы.');
      return;
    }
    // Получаем текущую текстуру из контекста
    const textureView = this.context.getCurrentTexture().createView();
    this.renderPassDescriptor.colorAttachments[0].view = textureView;

    // Создаем командный энкодер
    const commandEncoder = this.device.createCommandEncoder();

    // Начинаем рендер-проход
    const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);

    // Устанавливаем графический пайплайн
    passEncoder.setPipeline(this.pipeline);

    // Создаем общий BindGroup для матрицы проекции
    this.bindGroupProjection = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.projectionBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this.projectionBuffer, // Временно, заменится на буфер трансформации объекта
          },
        },
      ],
    });

    // Отрисовываем каждый объект сцены
    if (scene && scene.gameObjects) {
      scene.gameObjects.forEach(entity => {
        this.drawEntity(entity, passEncoder);
      });
    } else {
      console.error('No game objects found in the scene!');
    }

    // Завершаем рендер-проход
    passEncoder.end();

    // Отправляем команды в очередь
    const commandBuffer = commandEncoder.finish();
    this.device.queue.submit([commandBuffer]);
  }

  drawEntity(entity, passEncoder) {
    // Если объект имеет метод renderWebGPU, вызываем его
    if (entity && typeof entity.renderWebGPU === 'function') {
      entity.renderWebGPU(this.device, passEncoder, this.bindGroupLayout, this.projectionBuffer);
    } else {
      console.error('Object does not have a renderWebGPU method!');
    }
  }
}

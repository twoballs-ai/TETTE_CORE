import { CanvasRenderer } from '../renderers/CanvasRenderer.js';
import { WebGLRenderer } from '../renderers/WebGLRenderer.js';
import { WebGPURenderer } from '../renderers/WebGPURenderer.js';

export class GraphicalContext {
    constructor(canvasId = 'canvas', type = '2d', backgroundColor = 'black', width = 900, height = 600) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id ${canvasId} not found!`);
        }

        // Установка размеров канваса
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.initializeContext(type);
        this.renderer = this.createRenderer(type, backgroundColor); // Передаем цвет фона
    }

    initializeContext(type) {
        if (type === '2d') {
            return this.canvas.getContext('2d');
        } else if (type === 'webgl') {
            return this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        } else if (type === 'webgpu') {
            if (navigator.gpu) {
                return this.canvas.getContext('webgpu');
            } else {
                throw new Error("WebGPU not supported on this browser.");
            }
        } else {
            throw new Error("Unsupported context type: " + type);
        }
    }

    createRenderer(type, backgroundColor) {
        if (type === '2d') {
            return new CanvasRenderer(this, backgroundColor); // Передаем цвет фона
        } else if (type === 'webgl') {
            return new WebGLRenderer(this, backgroundColor); // Передаем цвет фона
        } else if (type === 'webgpu') {
            return new WebGPURenderer(this, backgroundColor); // Передаем цвет фона
        } else {
            throw new Error('Unsupported render type: ' + type);
        }
    }

    getContext() {
        return this.context;
    }

    getCanvas() {
        return this.canvas;
    }

    getRenderer() {
        return this.renderer; // Метод для получения рендерера
    }
}

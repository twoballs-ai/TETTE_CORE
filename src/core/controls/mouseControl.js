export class MouseControl {
    constructor(canvas) {
        this.mousePosition = { x: 0, y: 0 };
        this.isClicked = false;
        this.setupMouseControls(canvas);
    }

    setupMouseControls(canvas) {
        canvas.addEventListener('mousemove', (event) => {
            this.mousePosition = { x: event.clientX, y: event.clientY };
        });

        canvas.addEventListener('mousedown', () => {
            this.isClicked = true;
        });

        canvas.addEventListener('mouseup', () => {
            this.isClicked = false;
        });
    }

    getMousePosition() {
        return this.mousePosition;
    }

    isMouseClicked() {
        return this.isClicked;
    }

    update() {
        // Логика для обновления состояния мыши
    }
}

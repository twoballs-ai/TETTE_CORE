export class TouchControl {
    constructor(canvas) {
        this.touchPosition = { x: 0, y: 0 };
        this.isTouched = false;
        this.setupTouchControls(canvas);
    }

    setupTouchControls(canvas) {
        canvas.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            this.touchPosition = { x: touch.clientX, y: touch.clientY };
            this.isTouched = true;
        });

        canvas.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            this.touchPosition = { x: touch.clientX, y: touch.clientY };
        });

        canvas.addEventListener('touchend', () => {
            this.isTouched = false;
        });
    }

    getTouchPosition() {
        return this.touchPosition;
    }

    isTouchActive() {
        return this.isTouched;
    }

    update() {
        // Логика для обновления состояния тачскрина
    }
}

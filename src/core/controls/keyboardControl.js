export class KeyboardControl {
  constructor() {
    this.keysPressed = {};
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.key] = false;
    });
  }

  isKeyPressed(key) {
    return this.keysPressed[key] || false;
  }
}

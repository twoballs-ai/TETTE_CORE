import { BaseMode } from '../BaseMode.js';

export class GameMode extends BaseMode {
  constructor(core) {
    super(core);
  }

  start() {
    super.start();
    this.sceneManager.changeToFirstScene();
    console.log('Game started.');
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.isLevelComplete()) {
      this.sceneManager.changeToNextScene();
    }
  }

  isLevelComplete() {
    // Логика завершения уровня
    return false;
  }
}

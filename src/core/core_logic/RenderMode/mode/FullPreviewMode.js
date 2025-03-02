import { BaseMode } from '../BaseMode.js';

export class FullPreviewMode extends BaseMode {
  constructor(core) {
    super(core);
    this.currentLevelIndex = 0;
  }

  start() {
    super.start();
    this.loadLevel(this.currentLevelIndex);
  }

  loadLevel(index) {
    const sceneNames = Object.keys(this.sceneManager.scenes);
    if (index >= 0 && index < sceneNames.length) {
      this.sceneManager.changeScene(sceneNames[index]);
      console.log(`Previewing level: ${sceneNames[index]}`);
    }
  }

  nextLevel() {
    this.currentLevelIndex++;
    this.loadLevel(this.currentLevelIndex);
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.isLevelComplete()) {
      this.nextLevel();
    }
  }

  isLevelComplete() {
    // Логика завершения уровня
    return false;
  }
}

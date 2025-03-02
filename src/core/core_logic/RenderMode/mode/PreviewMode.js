import { BaseMode } from '../BaseMode.js';

export class PreviewMode extends BaseMode {
  constructor(core, levelName) {
    super(core);
    this.levelName = levelName;
  }

  start() {
    super.start();

    // Очищаем текущую сцену
    this.sceneManager.clearScene(this.levelName);

    // Переходим к новой сцене
    this.sceneManager.changeScene(this.levelName);

    // Подготавливаем сцену для предпросмотра
    this.preparePreview();
    
    console.log(`Previewing level: ${this.levelName}`);
  }

  preparePreview() {
    const objects = this.sceneManager.getGameObjectsFromCurrentScene();
    objects.forEach((object) => {
      if (typeof object.prepareForPreview === 'function') {
        object.prepareForPreview();
      } else {
        console.warn(`Object "${object.id}" does not support prepareForPreview.`);
      }
    });
  }
  update(deltaTime) {
    this.core.sceneManager.update(deltaTime);

    // Обновляем глобальную логику предпросмотра, если она есть
    if (this.core.logicSystem) {
      this.core.logicSystem.update(deltaTime);
    }
  }

  render() {
    console.log("2222222222222222222222222222222222")
    this.core.renderer.clear();
    this.core.sceneManager.render(this.core.renderer.context);

    // Рендеринг индикатора предпросмотра
    const ctx = this.core.renderer.context;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = '20px Arial';
    ctx.fillText(`Preview Mode: ${this.levelName}`, 10, 30);
    ctx.restore();
  }

  stop() {
    super.stop();
  
    console.log(`Stopped previewing level: ${this.levelName}`);
  
    // Восстанавливаем предыдущую сцену (например, сцену редактора)
    if (this.core.previousMode instanceof EditorMode) {
      this.sceneManager.changeScene(this.core.previousMode.levelName);
    }
  }
}

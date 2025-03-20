// PreviewMode.js
import { BaseMode } from '../BaseMode.js';
import { EditorMode } from './EditorMode.js'; // если у вас есть EditorMode

export class PreviewMode extends BaseMode {
  constructor(core, levelName) {
    super(core);
    this.levelName = levelName;
    this.savedObjects = [];
  }

  start() {
    console.log('Preview mode запущен');
    super.start();

    // Сохраняем текущие объекты
    this.savedObjects = [...this.sceneManager.getGameObjectsFromCurrentScene()];

    // Очищаем сцену, переключаемся
    this.sceneManager.clearScene(this.levelName);
    this.sceneManager.changeScene(this.levelName);

    // preparePreview, если нужно
    this.preparePreview();

    console.log(`Previewing level: ${this.levelName}`);
  }

  preparePreview() {
    const objects = this.sceneManager.getGameObjectsFromCurrentScene();
    objects.forEach((object) => {
      if (typeof object.prepareForPreview === 'function') {
        object.prepareForPreview();
      }
    });
  }

  update(deltaTime) {
    // Вызываем update объектов
    this.sceneManager.update(deltaTime);
    // Если есть какая-то ваша extra logicSystem:
    // if (this.core.logicSystem) this.core.logicSystem.update(deltaTime);
  }

  render() {
    // Очищаем и рендерим
    this.core.renderer.clear();
    this.sceneManager.render(this.core.renderer.context);

    // Рисуем индикатор
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

    // Очищаем текущую сцену
    this.sceneManager.clearScene(this.levelName);

    // Возвращаемся в сцену редактора
    let editorSceneName = this.levelName;
    // Если есть previousMode в core (необязательно):
    if (this.core.previousMode && this.core.previousMode instanceof EditorMode) {
      editorSceneName = this.core.previousMode.levelName;
    }

    this.sceneManager.changeScene(editorSceneName);

    // Восстанавливаем сохранённые объекты
    this.savedObjects.forEach((obj) => {
      this.sceneManager.addGameObjectToScene(editorSceneName, obj);
    });
    this.savedObjects = [];
  }
}

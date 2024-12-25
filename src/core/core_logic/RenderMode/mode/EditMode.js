import { BaseMode } from '../BaseMode';

export class EditMode extends BaseMode {
  constructor(core) {
    super(core);
    this.selectedObject = null; // Объект, который пользователь выделил для редактирования
  }

  start() {
    console.log('Edit Mode started.');
    this.setupEventListeners();
  }

  stop() {
    console.log('Edit Mode stopped.');
    this.removeEventListeners();
    super.stop();
  }

  setupEventListeners() {
    // Настраиваем обработчики для событий (например, клики мышью для выбора объекта)
    const canvas = document.getElementById(this.core.graphicalContext.canvasId);

    this.onClick = (event) => {
      const { offsetX, offsetY } = event;
      this.selectObjectAt(offsetX, offsetY);
    };

    canvas.addEventListener('click', this.onClick);
  }

  removeEventListeners() {
    const canvas = document.getElementById(this.core.graphicalContext.canvasId);
    canvas.removeEventListener('click', this.onClick);
  }

  selectObjectAt(x, y) {
    const objects = this.core.sceneManager.getGameObjectsFromCurrentScene();

    const selected = objects.find((obj) => {
      if (obj.getBoundingBox) {
        const { x: objX, y: objY, width, height } = obj.getBoundingBox();
        return x >= objX && x <= objX + width && y >= objY && y <= objY + height;
      }
      return false;
    });

    if (selected) {
      console.log('Object selected:', selected);
      this.core.setSelectedObject(selected);
      this.selectedObject = selected;
    } else {
      console.log('No object found at position:', x, y);
      this.core.setSelectedObject(null);
      this.selectedObject = null;
    }
  }

  render() {
    super.render();

    if (this.selectedObject) {
      this.core.highlightObject(this.selectedObject, 'blue', 'rgba(100, 200, 255, 0.2)');
    }
  }
}

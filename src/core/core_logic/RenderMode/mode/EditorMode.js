import { BaseMode } from '../BaseMode.js';
import { Highlighter } from '../../../core_logic/utils/Highlighter.js';

export class EditorMode extends BaseMode {
  constructor(core) {
    super(core);
    this.selectedObject = null;
  }

  start() {
    super.start();
    this.setupEventListeners();
  }

  stop() {
    this.removeEventListeners();
    super.stop();
  }

  setupEventListeners() {
    const canvas = this.core.graphicalContext.canvas;

    this.onClick = (event) => {
      const { offsetX, offsetY } = event;
      this.selectObjectAt(offsetX, offsetY);
    };

    canvas.addEventListener('click', this.onClick);
  }

  removeEventListeners() {
    const canvas = this.core.graphicalContext.canvas;
    canvas.removeEventListener('click', this.onClick);
  }

  selectObjectAt(x, y) {
    const objects = this.sceneManager.getGameObjectsFromCurrentScene();
    this.selectedObject = objects.find(obj => obj.containsPoint?.(x, y));
    console.log('Selected object:', this.selectedObject);
  }

  render() {
    super.render();

    if (this.selectedObject) {
      Highlighter.highlightObject(this.renderer.context, this.selectedObject, 'blue');
    }
  }
}

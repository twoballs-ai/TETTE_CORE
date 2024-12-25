import { GraphicalContext } from './GraphicalContext.js';
import { GameTypeFactory } from './GameTypeFactory.js';
import { ColorMixin } from './ColorMixin.js';
import { GameRenderMode } from './RenderMode/mode/GameRenderMode.js';
import { ScenePreviewMode } from './RenderMode/mode/ScenePreviewMode.js';
import { PlayFullGameMode } from './RenderMode/mode/PlayFullGameMode.js';
import { EditMode } from './RenderMode/mode/EditMode.js';
export class Core {
  constructor({ canvasId, renderType = '2d', backgroundColor = 'black', sceneManager, width = 900, height = 600 }) {
    this.renderType = renderType;
    const normalizedBackgroundColor = ColorMixin(backgroundColor, renderType);

    this.graphicalContext = new GraphicalContext(canvasId, renderType, normalizedBackgroundColor, width, height);
    this.renderer = this.graphicalContext.getRenderer();
    this.sceneManager = sceneManager;

    this.gameTypeInstance = null;
    this.selectedObject = null;

    this.currentMode = null;
  }

  resize(width, height) {
    this.graphicalContext.resize(width, height);
    this.renderer.clear();
    this.sceneManager.render(this.renderer.context);
    console.log(`Core resized to: ${width}x${height}`);
  }

  highlightObject(object, color = 'purple', fillColor = 'rgba(200, 100, 255, 0.2)', borderWidth = 0.2, padding = 10) {
    if (!object || !this.renderer) return;

    const ctx = this.renderer.context;
    const { x, y, width, height } = object.getBoundingBox ? object.getBoundingBox() : object;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = fillColor;
    ctx.fillRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding);

    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding);
    ctx.restore();
  }

  setSelectedObject(object) {
    this.selectedObject = object;
    this.currentMode?.render();
  }

  setGameType(gameType) {
    this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType);
    if (!this.gameTypeInstance) {
      console.error(`Error: game type ${gameType} not loaded.`);
    }
  }

  switchMode(modeInstance) {
    if (this.currentMode) {
      this.currentMode.stop();
    }
    this.currentMode = modeInstance;
    this.currentMode.start();
  }

  startGameRenderMode() {
    const mode = new GameRenderMode(this);
    this.switchMode(mode);
  }

  startScenePreviewMode(sceneName) {
    const mode = new ScenePreviewMode(this, sceneName);
    this.switchMode(mode);
  }

  playFullGame() {
    const mode = new PlayFullGameMode(this);
    this.switchMode(mode);
  }
  startEditMode() {
    const mode = new EditMode(this);
    this.switchMode(mode);
  }
}

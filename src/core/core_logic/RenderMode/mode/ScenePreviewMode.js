import { BaseMode } from '../BaseMode';


export class ScenePreviewMode extends BaseMode {
  constructor(core, sceneName) {
    super(core);
    this.sceneName = sceneName;
  }

  start() {
    console.log(`Starting Scene Preview Mode for scene: ${this.sceneName}`);
    this.core.sceneManager.changeScene(this.sceneName);
    super.start();
  }
}

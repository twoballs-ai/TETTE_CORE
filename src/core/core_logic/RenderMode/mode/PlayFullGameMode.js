import { BaseMode } from '../BaseMode';


export class PlayFullGameMode extends BaseMode {
  constructor(core) {
    super(core);
  }

  start() {
    console.log('Starting Full Game Mode.');
    this.core.sceneManager.changeToFirstScene();
    super.start();
  }
}

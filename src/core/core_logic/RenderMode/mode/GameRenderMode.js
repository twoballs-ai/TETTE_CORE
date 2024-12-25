import { BaseMode } from '../BaseMode';


export class GameRenderMode extends BaseMode {
  constructor(core) {
    super(core);
  }

  start() {
    console.log('Starting Game Render Mode.');
    super.start();
  }
}

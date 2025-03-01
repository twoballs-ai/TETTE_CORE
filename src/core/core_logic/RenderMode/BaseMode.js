export class BaseMode {
  constructor(core) {
    this.core = core; // Ссылка на ядро
    this.sceneManager = core.sceneManager;
    this.renderer = core.renderer;
  }

  start() {
    // console.log(`${this.constructor.name} started.`);
  }

  stop() {
    // console.log(`${this.constructor.name} stopped.`);
  }

  update(deltaTime) {
    // Общая логика обновления, если требуется
    this.sceneManager.update(deltaTime);
  }

  render() {
    // Общая логика рендеринга
    this.renderer.clear();
    this.sceneManager.render(this.renderer.context);
  }
}

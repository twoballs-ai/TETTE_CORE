export class BaseMode {
    constructor(core) {
      this.core = core;
      this.animationFrameId = null;
      this.lastTime = 0;
    }
  
    start() {
      console.log(`${this.constructor.name} started.`);
      this.lastTime = performance.now();
      this.loop = this.loop.bind(this);
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  
    stop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      console.log(`${this.constructor.name} stopped.`);
    }
  
    loop(timestamp) {
      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;
  
      this.update(deltaTime);
      this.render();
  
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  
    update(deltaTime) {
      if (this.core.logicSystem) {
        this.core.logicSystem.update(deltaTime);
      }
      this.core.sceneManager.update(deltaTime);
    }
  
    render() {
      const context = this.core.renderer.context;
      this.core.renderer.clear();
      this.core.sceneManager.render(context);
  
      if (this.core.selectedObject) {
        this.core.highlightObject(this.core.selectedObject, 'purple');
      }
    }
  }
  
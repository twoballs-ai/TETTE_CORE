// GameType.js
import { PhysicsEngine } from '../core/physics/PhysicsEngine.js';

export class GameType {
  constructor(core) {
    this.core = core;
    this.sceneManager = core.sceneManager;
    this.physicsEngine = new PhysicsEngine();
  }

  start() {
    // Метод, вызываемый при старте игры
  }

  update(deltaTime) {
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) return;

    // Обновляем физику
    this.physicsEngine.updatePhysics(currentScene.gameObjects, deltaTime);

    // Обработка специфичной логики для типа игры
    this.handleGameTypeSpecificLogic(deltaTime);
  }

  handleGameTypeSpecificLogic(deltaTime) {
    // Этот метод должен быть переопределен в подклассах
  }
}

// PlatformerGameType.js
import { GameType } from './GameType.js';
import { PlatformerPlayerCharacter } from '../gameObjects/characters/PlatformerPlayerCharacter.js';
import { KeyboardControl } from '../core/controls/keyboardControl.js';
import { Enemy } from '../gameObjects/characters/Enemy.js';
export class PlatformerGameType extends GameType {
  constructor(core) {
    super(core);
    this.player = this.getPlayerFromCurrentScene();
    this.keyboardControl = new KeyboardControl();
  }

  getPlayerFromCurrentScene() {
    const currentScene = this.sceneManager.getCurrentScene();
    if (!currentScene) {
      console.error("No current scene found.");
      return null;
    }
    return currentScene.gameObjects.find(obj => obj instanceof PlatformerPlayerCharacter);
  }

  handleGameTypeSpecificLogic(deltaTime) {
    // Обработка ввода для игрока
    if (this.player && this.player.rigidBody) {
      this.handleInput(deltaTime);
    }
  }

  handleInput(deltaTime) {
    const rigidBody = this.player.rigidBody;
    const SPEED_SCALE = 6000;
    const deltaSeconds = deltaTime / 1000;
    const moveSpeed = this.player.speed * SPEED_SCALE * deltaSeconds;

    if (this.keyboardControl.isKeyPressed('ArrowLeft')) {
      rigidBody.velocityX = -moveSpeed;
    } else if (this.keyboardControl.isKeyPressed('ArrowRight')) {
      rigidBody.velocityX = moveSpeed;
    } else {
      rigidBody.velocityX = 0;
    }

    if (this.keyboardControl.isKeyPressed(' ') && rigidBody.onGround) {
      rigidBody.velocityY = -1200; // Скорость прыжка
      rigidBody.onGround = false;
    }
  }
  checkPlayerEnemyCollisions() {
    const currentScene = this.sceneManager.getCurrentScene();
    const enemies = currentScene.gameObjects.filter(obj => obj instanceof Enemy);
  
    enemies.forEach(enemy => {
      if (this.isColliding(this.player, enemy)) {
        this.resolvePlayerEnemyCollision(this.player, enemy);
      }
    });
  }
  resolvePlayerEnemyCollision(player, enemy) {
    // Проверяем, прыгает ли игрок на врага
    if (player.rigidBody.velocityY > 0 && player.y + player.height <= enemy.y + enemy.height / 2) {
      // Враг побежден
      enemy.setAnimation('die');

      // Удаляем врага после окончания анимации
      setTimeout(() => {
        const currentScene = this.sceneManager.getCurrentScene();
        this.sceneManager.removeGameObjectFromScene(currentScene.name, enemy);
      }, enemy.frameDuration * enemy.animations.die.length);

      // Увеличиваем счет игрока
      this.score += 100;

      // Отталкиваем игрока вверх
      player.rigidBody.velocityY = -600;
    } else {
      // Игрок получает урон
      player.health -= 1;

      if (player.health <= 0) {
        // Обрабатываем смерть игрока
        console.log("Игрок погиб!");
        // Здесь можно перезапустить игру или уровень
      }
    }
  }
}

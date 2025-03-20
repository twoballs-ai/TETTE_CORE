// SceneManager.js
export class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
  }

  createScene(...names) {
    names.forEach((name) => {
      if (!this.scenes[name]) {
        this.scenes[name] = { name, gameObjects: [] };
        console.log(`Сцена "${name}" создана.`);
      } else {
        console.warn(`Сцена "${name}" уже существует.`);
      }
    });
  }

  changeScene(name) {
    if (this.scenes[name]) {
      this.currentScene = this.scenes[name];
      console.log(`Переключено на сцену "${name}".`);
    } else {
      console.error(`Сцена "${name}" не существует.`);
    }
  }

  addGameObjectToScene(sceneName, ...gameObjects) {
    const scene = this.scenes[sceneName];
    if (!scene) {
      console.error(`Невозможно добавить объект в несуществующую сцену: "${sceneName}".`);
      return;
    }

    gameObjects.forEach((obj) => {
      if (!scene.gameObjects.includes(obj)) {
        scene.gameObjects.push(obj);
      } else {
        console.warn(`Объект уже добавлен в сцену "${sceneName}".`);
      }
    });
  }

  update(deltaTime) {
    if (!this.currentScene) return;

    this.currentScene.gameObjects.forEach((object) => {
      if (typeof object.update === "function") {
        object.update(deltaTime);
      }
    });
  }

  render(context) {
    if (!this.currentScene) return;

    const sortedGameObjects = this.currentScene.gameObjects.sort((a, b) => a.layer - b.layer);
    console.log(`Рендеринг сцены "${this.currentScene.name}" с объектами:`, sortedGameObjects);

    sortedGameObjects.forEach((object) => {
      if (typeof object.render === "function") {
        object.render(context);
      }
    });
  }

  getCurrentScene() {
    return this.currentScene;
  }

  getGameObjectsFromCurrentScene() {
    return this.currentScene ? this.currentScene.gameObjects : [];
  }

  getGameObjectsByType(type) {
    if (!this.currentScene) return [];
    return this.currentScene.gameObjects.filter((obj) => obj instanceof type);
  }

  getGameObjectById(id) {
    if (!this.currentScene) return null;
    return this.currentScene.gameObjects.find((obj) => obj.id === id) || null;
  }

  removeGameObjectFromScene(sceneName, gameObject) {
    const scene = this.scenes[sceneName];
    if (!scene) {
      console.error(`Сцена "${sceneName}" не существует.`);
      return;
    }
    const index = scene.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      scene.gameObjects.splice(index, 1);
      console.log(`Объект удален из сцены "${sceneName}".`);
    } else {
      console.warn(`Объект не найден в сцене "${sceneName}".`);
    }
  }

  clearScene(sceneName) {
    if (!this.scenes[sceneName]) {
      console.error(`Сцена "${sceneName}" не существует.`);
      return;
    }
    this.scenes[sceneName].gameObjects = [];
    console.log(`Сцена "${sceneName}" очищена.`);
  }

  changeToNextScene() {
    const sceneNames = Object.keys(this.scenes);
    const currentIndex = sceneNames.indexOf(this.currentScene?.name);
    if (currentIndex !== -1 && currentIndex < sceneNames.length - 1) {
      this.changeScene(sceneNames[currentIndex + 1]);
    } else {
      console.warn("Следующая сцена не найдена или вы находитесь в последней сцене.");
    }
  }
}

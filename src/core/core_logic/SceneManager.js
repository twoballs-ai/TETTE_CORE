/**
 * Менеджер сцен: отвечает за хранение, переключение и рендеринг сцен,
 * а также теперь — за загрузку сцен из файлов.
 */
export class SceneManager {
  constructor(logicSystem = null) {
    this.scenes = {};
    this.currentScene = null;
    // Логика может потребоваться для загрузки logicFile,
    // поэтому передаём её в SceneManager, если нужно
    this.logicSystem = logicSystem;
  }

  createScene(...names) {
    console.log(...names)
    const createdScenes = [];
    const existingScenes = [];
  
    names.forEach((name) => {
      if (!this.scenes[name]) {
        this.scenes[name] = { name, gameObjects: [] };
        createdScenes.push(name);
      } else {
        existingScenes.push(name);
      }
    });
  
    if (createdScenes.length > 0) {
      console.log(`Созданы сцены: ${createdScenes.join(', ')}.`);
    }
  
    if (existingScenes.length > 0) {
      console.warn(`Сцены уже существуют: ${existingScenes.join(', ')}.`);
    }
  }
  

  changeScene(name) {
    if (this.scenes[name]) {
      this.currentScene = this.scenes[name];
      console.log(`Переключено на сцену "${name}".`);
    } else {
      console.error(`Сцена "${name}" не существует.`);
    }
  }

  /**
   * Локальная логика загрузки объектов сцены из JSON-файла
   */
  async loadSceneObjectsFromFile(filePath) {
    try {
      const response = await fetch(filePath);
      const sceneData = await response.json();
      this.createScene(sceneData.name);
      sceneData.gameObjects.forEach(obj => {
        this.addGameObjectToScene(sceneData.name, obj);
      });
      console.log(`Сцена "${sceneData.name}" загружена из файла "${filePath}".`);
      return sceneData;
    } catch (error) {
      console.error(`Ошибка загрузки объектов сцены из файла "${filePath}":`, error);
      return null;
    }
  }

loadSceneFromObjects(sceneName, sceneObjects) {
  this.createScene(sceneName);
  console.log("Загружаемые объекты:", sceneObjects);
  sceneObjects.forEach((obj) => {
    this.addGameObjectToScene(sceneName, obj);
  });
  console.log(`Сцена "${sceneName}" загружена из объектов.`);
}

  /**
   * Добавляем объект(ы) в указанную сцену
   */
  addGameObjectToScene(sceneName, ...gameObjects) {
    const scene = this.scenes[sceneName];
    if (scene) {
      gameObjects.forEach((obj) => {
        // Преобразуем объект через фабрику
        const gameObject = getShapes('2d')[obj.type](obj); // Используйте renderType вашего проекта
        if (!scene.gameObjects.includes(gameObject)) {
          scene.gameObjects.push(gameObject);
          console.log(`Объект добавлен в сцену "${sceneName}":`, gameObject);
        } else {
          console.warn(`Объект уже добавлен в сцену "${sceneName}":`, gameObject);
        }
      });
    } else {
      console.error(`Сцена "${sceneName}" не существует.`);
    }
  }

  /**
   * Изначально этот метод был в Core. Перенесём его сюда.
   * Загружает сцену из файлов (объекты + логика) и переключается на неё.
   */
  async initializeScene(sceneName, objectsFilePath, logicFilePath) {
    try {
      // Загружаем объекты сцены
      const sceneData = await this.loadSceneObjectsFromFile(objectsFilePath);
      // Загружаем логику (если есть logicSystem)
      if (this.logicSystem && logicFilePath) {
        await this.logicSystem.loadLogicFromFile(logicFilePath);
      }
      // Переключаемся на сцену
      this.changeScene(sceneName);
      console.log(`Scene "${sceneName}" successfully initialized.`);
    } catch (error) {
      console.error("Error initializing scene:", error);
    }
  }

  /**
   * Ещё один метод из Core. Теперь сцены будут грузиться через SceneManager.
   */
  async loadLevelFromFile(objectsFilePath, logicFilePath) {
    try {
      const sceneData = await this.loadSceneObjectsFromFile(objectsFilePath);
      if (!sceneData) {
        console.error("Scene data could not be loaded.");
        return;
      }
      if (this.logicSystem && logicFilePath) {
        await this.logicSystem.loadLogicFromFile(logicFilePath);
      }
      console.log(`Level "${sceneData.name}" loaded successfully.`);
    } catch (error) {
      console.error("Error loading level from file:", error);
    }
  }

  update(deltaTime) {
    if (this.currentScene) {
      this.currentScene.gameObjects.forEach((object) => {
        if (typeof object.update === "function") {
          object.update(deltaTime);
        }
      });
    }
  }

  render(context) {
    if (this.currentScene) {
        console.log(`Рендеринг сцены "${this.currentScene.name}" с объектами:`, this.currentScene.gameObjects);

        this.currentScene.gameObjects.forEach((object, index) => {
            console.log(`Попытка рендеринга объекта ${index}:`, object);
            if (typeof object.render === "function") {
                object.render(context);
                console.log(`Объект ${index} успешно отрисован.`);
            } else {
                console.warn(`Объект ${index} не имеет метода render:`, object);
            }
        });
    }
}

  getCurrentScene() {
    return this.currentScene;
  }

  removeGameObjectFromScene(sceneName, gameObject) {
    const scene = this.scenes[sceneName];
    if (scene) {
      const index = scene.gameObjects.indexOf(gameObject);
      if (index !== -1) {
        scene.gameObjects.splice(index, 1);
        console.log(`Объект удален из сцены "${sceneName}".`);
      } else {
        console.warn(`Объект не найден в сцене "${sceneName}".`);
      }
    } else {
      console.error(`Сцена "${sceneName}" не существует.`);
    }
  }

  getGameObjectsFromCurrentScene() {
    return this.currentScene ? this.currentScene.gameObjects : [];
  }

  getGameObjectsByType(type) {
    if (!this.currentScene) {
      console.error("Текущая сцена не установлена.");
      return [];
    }
    return this.currentScene.gameObjects.filter((obj) => obj instanceof type);
  }

  getGameObjectById(id) {
    if (!this.currentScene) {
      console.error("Текущая сцена не установлена.");
      return null;
    }
    return this.currentScene.gameObjects.find((obj) => obj.id === id) || null;
  }

  clearScene(sceneName) {
    if (this.scenes[sceneName]) {
      this.scenes[sceneName].gameObjects = [];
      console.log(`Сцена "${sceneName}" очищена.`);
    } else {
      console.error(`Сцена "${sceneName}" не существует.`);
    }
  }

  /**
   * Пример использования logicSystem внутри SceneManager.
   * Нужно заранее убедиться, что logicSystem != null.
   */
  async changeSceneWithFiles(sceneName, objectsFilePath, logicFilePath) {
    await this.loadSceneObjectsFromFile(objectsFilePath);
    if (this.logicSystem) {
      await this.logicSystem.loadLogicFromFile(logicFilePath);
    }
    this.changeScene(sceneName);
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

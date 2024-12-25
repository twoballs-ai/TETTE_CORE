import { GraphicalContext } from './GraphicalContext.js';
import { GameTypeFactory } from './GameTypeFactory.js';
import { ColorMixin } from './ColorMixin.js';

/**
 * Класс Core отвечает за запуск/остановку игрового цикла, 
 * переключение режимов (production, gui), выбор типа игры,
 * а также организацию рендеринга через GraphicalContext.
 */
export class Core {
  constructor({
    canvasId,
    renderType = '2d',
    backgroundColor = 'black',
    sceneManager,
    width = 900,
    height = 600,
    mode = 'production',
    logicSystem = null, // Если нужно явно передать логику
  }) {
    this.renderType = renderType;
    const normalizedBackgroundColor = ColorMixin(backgroundColor, renderType);
    this.mode = mode; // Режим работы: 'gui' или 'production'

    this.graphicalContext = new GraphicalContext(
      canvasId,
      renderType,
      normalizedBackgroundColor,
      width,
      height
    );
    this.renderer = this.graphicalContext.getRenderer();

    this.sceneManager = sceneManager;
    this.logicSystem = logicSystem;

    this.lastTime = 0;
    this.loop = this.loop.bind(this);
    this.gameTypeInstance = null;
    this.isGuiMode = this.mode === 'gui';
    this.animationFrameId = null;
    this.selectedObject = null;
  }

  setMode(mode) {
    this.mode = mode;
    this.isGuiMode = mode === 'gui';
  }

  resize(width, height) {
    if (this.graphicalContext) {
      this.graphicalContext.resize(width, height);
      this.renderer.clear();
      this.sceneManager.render(this.renderer.context);
    }
  }

  highlightObject(
    object,
    color = 'purple',
    fillColor = 'rgba(200, 100, 255, 0.2)',
    borderWidth = 0.2,
    padding = 10
  ) {
    if (!object || !this.renderer) return;

    const ctx = this.renderer.context;
    const { x, y, width, height } = object.getBoundingBox
      ? object.getBoundingBox()
      : object;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = fillColor;
    ctx.fillRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding);
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      x - padding,
      y - padding,
      width + 2 * padding,
      height + 2 * padding
    );
    ctx.restore();
  }

  setSelectedObject(object) {
    this.selectedObject = object;
    this.renderScene();
  }

  setGameType(gameType) {
    if (gameType) {
      this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType);
      if (!this.gameTypeInstance) {
        console.error(`Error: game type ${gameType} not loaded.`);
      }
    }
  }

  renderScene() {
    console.log('Ручной рендеринг сцены.');
    this.renderer.clear();
    this.sceneManager.render(this.renderer.context);

    if (this.selectedObject) {
      this.highlightObject(this.selectedObject, 'purple');
    }
  }

  startPreview(sceneName, sceneObjects, sceneLogic = null) {
    if (this.mode !== 'gui') {
      console.error('Предпросмотр доступен только в режиме GUI.');
      return;
    }

    console.log(`Запуск предпросмотра для сцены: ${sceneName}`);
    this.loadSceneFromGuiForEdit(sceneName, sceneObjects, sceneLogic);
    this.startGameLoop();
  }

  stopPreview() {
    console.log('Остановка предпросмотра.');
    this.stop();
    this.renderScene(); // После остановки игрового цикла сделаем статический рендер
  }

  loadSceneFromGuiForEdit(sceneName, sceneObjects, sceneLogic = null) {
    if (this.mode !== 'gui') {
      console.error("loadSceneFromGuiForEdit can only be called in GUI mode.");
      return;
    }

    this.sceneManager.loadSceneFromObjects(sceneName, sceneObjects);

    if (sceneLogic && this.logicSystem) {
      this.logicSystem.loadLogic(sceneLogic);
    }

    this.sceneManager.changeScene(sceneName);
  }

  loop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    console.log(`Game loop tick. Delta time: ${deltaTime} ms`);

    if (this.logicSystem) {
      console.log('Updating logic system.');
      this.logicSystem.update(deltaTime);
    }

    console.log('Updating scene manager.');
    this.sceneManager.update(deltaTime);

    console.log('Clearing renderer.');
    this.renderer.clear();

    console.log('Rendering scene.');
    this.sceneManager.render(this.renderer.context);

    if (this.selectedObject) {
      console.log(`Highlighting selected object: ${this.selectedObject.id}`);
      this.highlightObject(this.selectedObject, 'purple');
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  startGameLoop() {
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      console.log('Game loop stopped.');
    }
  }
}

/**
 * Менеджер сцен: отвечает за хранение, переключение и рендеринг сцен,
 * а также теперь — за загрузку сцен из файлов.
 */
export class SceneManager {
  constructor(logicSystem = null) {
    this.scenes = {};
    this.currentScene = null;
    this.logicSystem = logicSystem;
  }

  createScene(...names) {
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

  loadSceneFromObjects(sceneName, sceneObjects) {
    this.createScene(sceneName);
    sceneObjects.forEach((obj) => this.addGameObjectToScene(sceneName, obj));
    console.log(`Сцена "${sceneName}" загружена из объектов.`);
  }

  addGameObjectToScene(sceneName, ...gameObjects) {
    const scene = this.scenes[sceneName];
    if (scene) {
      gameObjects.forEach((obj) => {
        const existingObject = scene.gameObjects.find((o) => o.id === obj.id);
        if (!existingObject) {
          scene.gameObjects.push(obj);
          console.log(`Объект добавлен в сцену "${sceneName}":`, obj);
        } else {
          console.warn(`Объект с id "${obj.id}" уже существует в сцене "${sceneName}".`);
        }
      });
    } else {
      console.error(`Невозможно добавить объект в несуществующую сцену: "${sceneName}".`);
    }
  }

  render(context) {
    if (this.currentScene) {
      const sortedGameObjects = this.currentScene.gameObjects.sort((a, b) => a.layer - b.layer);

      console.log(`Рендеринг сцены "${this.currentScene.name}" с объектами:`, sortedGameObjects);

      sortedGameObjects.forEach((object) => {
        if (typeof object.render === 'function') {
          console.log(`Рендеринг объекта с ID: ${object.id}`);
          object.render(context);
        } else {
          console.warn(`Объект с ID ${object.id} не имеет метода render.`);
        }
      });
    } else {
      console.warn('Нет активной сцены для рендеринга.');
    }
  }

  update(deltaTime) {
    if (this.currentScene) {
      this.currentScene.gameObjects.forEach((object) => {
        if (typeof object.update === 'function') {
          object.update(deltaTime);
        }
      });
    }
  }
}

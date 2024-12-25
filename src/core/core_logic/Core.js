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
    // // console.log(`Режим работы: ${this.mode}`);

    this.graphicalContext = new GraphicalContext(
      canvasId,
      renderType,
      normalizedBackgroundColor,
      width,
      height
    );
    this.renderer = this.graphicalContext.getRenderer();

    // Сюда мы передаём готовый sceneManager, в который уже
    // встроен функционал загрузки сцен, файлов и т.п.
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
    // // console.log(`Mode set to: ${this.mode}`);
  }

  resize(width, height) {
    if (this.graphicalContext) {
      this.graphicalContext.resize(width, height);
      this.renderer.clear();
      this.sceneManager.render(this.renderer.context);
      // // console.log(`Core resized to: ${width}x${height}`);
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
    this.render();
  }

  setGameType(gameType) {
    if (gameType) {
      // console.log(`Setting game type: ${gameType}`);
      this.gameTypeInstance = new GameTypeFactory(this).loadGameType(gameType);
      if (!this.gameTypeInstance) {
        // // console.error(`Error: game type ${gameType} not loaded.`);
      }
    }
  }

  /**
   * Запуск игры:
   * - В режиме production загружает уровень через initializeScene,
   *   если переданы пути к файлам.
   * - В режиме gui просто не загружает сцену автоматически.
   */
  async start(initialScene = null, objectsFilePath = null, logicFilePath = null) {
    if (
      this.mode === 'production' &&
      initialScene &&
      objectsFilePath &&
      logicFilePath
    ) {
      // Вместо прямого вызова initializeScene переносим его в SceneManager
      await this.sceneManager.initializeScene(initialScene, objectsFilePath, logicFilePath);
    }

    if (typeof this.renderer.init === 'function') {
      await this.renderer.init();
    }

    if (this.gameTypeInstance && typeof this.gameTypeInstance.start === 'function') {
      this.gameTypeInstance.start();
    }

    this.startGameLoop();
  }

  /**
   * Режим готовой игры (production).
   * Здесь мы загружаем несколько уровней по очереди
   * и запускаем игровой цикл.
   */
  async startProduction(levels) {
    // // console.log("Starting production mode.");

    // Загружаем каждый уровень последовательно
    for (const { objectsFilePath, logicFilePath } of levels) {
      // Вместо Core.loadLevelFromFile используем sceneManager.loadLevelFromFile
      await this.sceneManager.loadLevelFromFile(objectsFilePath, logicFilePath);
      this.startGameLoop();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // console.log("Production mode finished.");
  }

  /**
   * Загрузка сцены в режиме GUI (редактирование)
   */
  loadSceneFromGuiForEdit(sceneName, sceneObjects, sceneLogic = null) {
    if (this.mode !== 'gui') {
      // console.error("loadSceneFromGuiForEdit can only be called in GUI mode.");
      return;
    }

    // Используем sceneManager для загрузки сцены из готовых данных
    this.sceneManager.loadSceneFromObjects(sceneName, sceneObjects);

    if (sceneLogic && this.logicSystem) {
      this.logicSystem.loadLogic(sceneLogic);
    }

    this.sceneManager.changeScene(sceneName);
    // console.log(`Scene "${sceneName}" loaded in GUI mode.`);
  }

  /**
   * Предпросмотр уровня: загружаем сцену, запускаем цикл,
   * потом можем его остановить.
   */
  previewLevelFromGui(sceneName, sceneObjects, sceneLogic) {
    if (this.mode !== 'gui') {
      // console.error("previewLevelFromGui can only be used in GUI mode.");
      return;
    }

    this.loadSceneFromGuiForEdit(sceneName, sceneObjects, sceneLogic);
    // console.log(`Previewing level "${sceneName}" in GUI mode.`);
    this.startGameLoop();
  }

  /**
   * Полный тест в GUI: прогоняем несколько уровней
   * по очереди с предпросмотром.
   */
  async fullTestFromGui(levels) {
    if (this.mode !== 'gui') {
      // console.error("fullTestFromGui can only be used in GUI mode.");
      return;
    }

    // console.log("Starting full test in GUI mode.");
    for (const { name, objects, logic } of levels) {
      this.previewLevelFromGui(name, objects, logic);
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Останавливаем цикл, чтобы не мешал при переключении следующего
      this.stop();
    }
    // console.log("Full test completed.");
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
      // console.log('Game loop stopped.');
    }
  }

  render() {
    this.renderer.clear();
    this.sceneManager.render(this.renderer.context);
    
    if (this.selectedObject) {
      this.highlightObject(this.selectedObject, 'purple');
    }
  }

  getSceneManager() {
    return this.sceneManager;
  }
}

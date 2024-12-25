/**
 * LogicSystem отвечает за "логику" игры:
 * - загрузку правил (триггеры + действия) из JSON
 * - обработку этих правил на каждом кадре (update)
 */
export class LogicSystem {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.rules = []; 
    // Здесь будем хранить список "правил" из JSON (триггер + действия)
  }

  /**
   * Считывание логики из файла
   */
  async loadLogicFromFile(filePath) {
    try {
      const response = await fetch(filePath);
      const logicData = await response.json();
      this.rules = logicData.logic || [];
      console.log(`Логика сцены загружена из файла "${filePath}".`);
    } catch (error) {
      console.error(`Ошибка загрузки логики из файла "${filePath}":`, error);
    }
  }

  loadLogicFromObjects(logic) {
    this.rules = logic || [];
    console.log("Логика загружена из объектов.");
  }

  loadLogic(logicJson) {
    if (!logicJson || !Array.isArray(logicJson.logic)) {
      console.warn("LogicSystem: Неверный формат логики (ожидаем { logic: [...] }).");
      return;
    }
    this.rules = logicJson.logic;
  }

  /**
   * Метод update вызывается на каждом кадре (или раз в тик).
   * Здесь мы обрабатываем/выполняем правила логики.
   */
  update(deltaTime) {
    // Пример простой обработки
    for (const rule of this.rules) {
      if (this.checkTrigger(rule.trigger)) {
        this.processActions(rule.actions, deltaTime);
      }
    }
  }

  checkTrigger(trigger) {
    if (!trigger || !trigger.type) return false;

    switch (trigger.type) {
      case 'Always':
        return true;

      // Пример триггера OnSceneStart
      // Нужно хранить, когда мы последний раз переключили сцену, и срабатывать один раз.
      case 'OnSceneStart':
        // Здесь может быть логика, которая проверяет, 
        // что мы только что переключились на нужную сцену
        // или сработал флаг "sceneJustChanged".
        return false; // пока заглушка

      default:
        console.warn(`LogicSystem: Неизвестный тип триггера "${trigger.type}".`);
        return false;
    }
  }

  processActions(actions, deltaTime) {
    if (!Array.isArray(actions)) return;
    for (const action of actions) {
      this.executeAction(action, deltaTime);
    }
  }

  executeAction(action, deltaTime) {
    if (!action || !action.type) return;

    switch (action.type) {
      case 'Move':
        this.doMove(action, deltaTime);
        break;

      case 'ChangeScene':
        this.doChangeScene(action);
        break;

      default:
        console.warn(`LogicSystem: Неизвестный тип действия "${action.type}".`);
        break;
    }
  }

  doMove(action, deltaTime) {
    const { objectId, speedX = 0, speedY = 0, boundaryX, boundaryY, nextScene } = action;
    const obj = this.sceneManager.getGameObjectById(objectId);
    if (!obj) return;

    // Смещаем объект
    obj.x += speedX * deltaTime;
    obj.y += speedY * deltaTime;

    // Если есть boundaryX/boundaryY, проверяем
    if (typeof boundaryX === 'number' && obj.x > boundaryX) {
      if (nextScene) {
        this.sceneManager.changeScene(nextScene);
      }
    }
    if (typeof boundaryY === 'number' && obj.y > boundaryY) {
      if (nextScene) {
        this.sceneManager.changeScene(nextScene);
      }
    }
  }

  doChangeScene(action) {
    if (!action.sceneName) {
      console.warn(`LogicSystem: ChangeScene без указанного sceneName`);
      return;
    }
    this.sceneManager.changeScene(action.sceneName);
  }
}

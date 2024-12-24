// LogicSystem.js
export class LogicSystem {
    constructor(sceneManager) {
      this.sceneManager = sceneManager;
      this.rules = []; 
      // Здесь будем хранить список "правил" из JSON (триггер + действия)
    }
  
    /**
     * Загружаем логику из JSON-данных
     * Ожидаем структуру вида:
     * {
     *   "logic": [
     *     {
     *       "trigger": { "type": "OnSceneStart" },
     *       "actions": [
     *         { "type": "Move", "objectId": "player", "speedX": 0.1, ... },
     *         { "type": "ChangeScene", "sceneName": "level2" }
     *       ]
     *     },
     *     ...
     *   ]
     * }
     */
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
      // Пример: пока у нас нет сложных событий/триггеров (OnSceneStart, OnCollision и т.п.),
      // мы просто перебираем все rules и смотрим, есть ли у них trigger === "Always".
      // Или вы можете реализовать здесь "OnSceneStart", если нужно.
      
      for (const rule of this.rules) {
        // 1) Проверяем триггер
        if (this.checkTrigger(rule.trigger)) {
          // 2) Если триггер сработал, выполняем actions
          this.processActions(rule.actions, deltaTime);
        }
      }
    }
  
    /**
     * checkTrigger(trigger) — проверяем, сработал ли триггер.
     * Для простоты сделаем:
     *  - { type: "Always" } → всегда true
     *  - { type: "OnSceneStart" } → срабатывает один раз, когда сцена изменилась (понадобится хранить state)
     *  
     * Вы сможете добавлять новые триггеры: "OnTimer", "OnKeyPress", "OnCollision", и т.д.
     */
    checkTrigger(trigger) {
      if (!trigger || !trigger.type) return false;
  
      switch (trigger.type) {
        case 'Always':
          return true;
  
        // Пример триггера OnSceneStart
        // Нужно хранить, когда мы последний раз переключили сцену, и срабатывать один раз.
        case 'OnSceneStart':
          // Здесь может быть логика, которая проверяет, что мы только что переключились на нужную сцену
          // или сработали флаг "sceneJustChanged".
          return false; // пока заглушка
  
        default:
          console.warn(`LogicSystem: Неизвестный тип триггера "${trigger.type}".`);
          return false;
      }
    }
  
    /**
     * Выполнение массива actions
     */
    processActions(actions, deltaTime) {
      if (!Array.isArray(actions)) return;
  
      for (const action of actions) {
        this.executeAction(action, deltaTime);
      }
    }
  
    /**
     * Выполняем конкретное действие
     * 
     * Пример минимальных типов:
     * - Move
     * - ChangeScene
     */
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
  
    /**
     * Пример реализации "Move"
     */
    doMove(action, deltaTime) {
      const { objectId, speedX = 0, speedY = 0, boundaryX, boundaryY, nextScene } = action;
      // Получаем объект по ID
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
  
    /**
     * Пример реализации "ChangeScene"
     */
    doChangeScene(action) {
      if (!action.sceneName) {
        console.warn(`LogicSystem: ChangeScene без указанного sceneName`);
        return;
      }
      this.sceneManager.changeScene(action.sceneName);
    }
  }
  
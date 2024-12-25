export class Highlighter {
    /**
     * Подсвечивает объект на канвасе.
     * @param {Object} context - Контекст канваса для рендеринга.
     * @param {Object} object - Объект, который нужно подсветить.
     * @param {string} color - Цвет рамки объекта.
     * @param {string} fillColor - Цвет заливки объекта.
     * @param {number} borderWidth - Толщина рамки.
     * @param {number} padding - Отступ вокруг объекта.
     */
    static highlightObject(context, object, color = 'purple', fillColor = 'rgba(200, 100, 255, 0.2)', borderWidth = 0.2, padding = 10) {
      if (!object || !context) return;
  
      const { x, y, width, height } = object.getBoundingBox ? object.getBoundingBox() : object;
  
      context.save();
  
      // Добавляем тень
      context.shadowColor = 'rgba(0, 0, 0, 0.3)';
      context.shadowBlur = 10;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
  
      // Рисуем полупрозрачную заливку с отступом
      context.fillStyle = fillColor;
      context.fillRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding);
  
      // Рисуем тонкую рамку с отступом
      context.strokeStyle = color;
      context.lineWidth = borderWidth;
      context.strokeRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding);
  
      // Рисуем resize handles (угловые точки)
      const handleSize = 6;
      const handleColor = color;
  
      const handles = [
        { x: x - padding - handleSize / 2, y: y - padding - handleSize / 2, cursor: 'nwse-resize', direction: 'nw' },
        { x: x + width + padding - handleSize / 2, y: y - padding - handleSize / 2, cursor: 'nesw-resize', direction: 'ne' },
        { x: x - padding - handleSize / 2, y: y + height + padding - handleSize / 2, cursor: 'nesw-resize', direction: 'sw' },
        { x: x + width + padding - handleSize / 2, y: y + height + padding - handleSize / 2, cursor: 'nwse-resize', direction: 'se' },
      ];
  
      context.fillStyle = 'white';
      context.strokeStyle = handleColor;
      context.lineWidth = 1;
  
      handles.forEach(handle => {
        context.fillRect(handle.x, handle.y, handleSize, handleSize);
        context.strokeRect(handle.x, handle.y, handleSize, handleSize);
      });
  
      context.restore();
    }
  }
  
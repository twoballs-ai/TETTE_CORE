export function ColorMixin(color, renderType) {
    // Обработка для 2D Canvas
    if (renderType === '2d') {
      if (typeof color === 'string') {
        if (color in colorNames) {
          return colorNames[color];  // Преобразуем название цвета в HEX, если оно присутствует в словаре
        }
        return color;  // Если это строка HEX или RGB, возвращаем её без изменений
      }
      throw new Error('Unsupported color format for Canvas: ' + color);
    }
  
    // Обработка для WebGL и WebGPU (нормализованные RGB значения)
    if (renderType === 'webgl' || renderType === 'webgpu') {
      // Если это строка в формате 'rgb(51, 51, 51)'
      if (typeof color === 'string' && color.startsWith('rgb(')) {
        return parseRgbString(color);
      }
  
      // Если это строка с именем цвета или HEX
      if (typeof color === 'string') {
        if (color in colorNames) {
          color = colorNames[color];  // Преобразуем словесное имя цвета в HEX
        }
  
        // Если это HEX (#333 или #333333)
        if (color[0] === '#') {
          return hexToRgb(color);
        }
      }
  
      // Если это массив RGB [r, g, b], нормализуем его для WebGL/WebGPU
      if (Array.isArray(color)) {
        return color.map(c => c / 255);
      }
  
      throw new Error('Unsupported color format for WebGL/WebGPU: ' + color);
    }
  
    throw new Error('Unsupported render type: ' + renderType);
  }
  
  // Конвертация строки 'rgb(51, 51, 51)' в массив нормализованных RGB (0-1)
  function parseRgbString(rgbString) {
    const rgbValues = rgbString.match(/\d+/g).map(Number);
    return rgbValues.map(value => value / 255);  // Нормализуем значения
  }
  
  // Конвертация HEX-цвета в нормализованный RGB (0-1)
  function hexToRgb(hex) {
    if (hex.length === 4) {
      // Преобразуем короткий HEX формат (#333) в длинный формат (#333333)
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
  
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
  }
  
  // Словесные названия цветов
  const colorNames = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    gray: '#808080',
    yellow: '#FFFF00',
    // Можно добавить дополнительные цвета по мере необходимости
  };
  
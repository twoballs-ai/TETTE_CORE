const path = require('path');

module.exports = {
  entry: './TETTE_CORE/index.js', // Точка входа в сборку
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tette.bundle.js', // Имя файла, который будет использовать пользователь
    library: 'TETTE', // Экспортируемое имя глобальной переменной
    libraryTarget: 'umd', // Universal Module Definition для использования в разных окружениях
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Обрабатываем все JS-файлы
        exclude: /node_modules/, // Не включаем node_modules
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

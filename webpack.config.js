const path = require("path");

module.exports = {
  entry: "./packages/core/src/index.ts", // Входной файл для сборки
  output: {
    path: path.resolve(__dirname, "packages/core/dist"), // Путь до папки сборки
    filename: "index.js", // Имя собранного JS файла
    library: "LexicalToolkit", // Название библиотеки для экспорта
    libraryTarget: "umd", // Универсальный модуль для использования в разных средах
    globalObject: "this", // Правильное определение глобального объекта для использования в браузере и Node.js
  },
  resolve: {
    alias: {
      images: path.resolve(__dirname, 'packages/core/src/images/'), // Настройка алиаса для изображений
    },
    extensions: [".tsx", ".ts", ".js"], // Учитываем расширения при импорте модулей
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Обработка TypeScript файлов
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i, // Обработка CSS файлов
        use: ["style-loader", "css-loader", "postcss-loader"], // Объединили правила для CSS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Обработка изображений
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'packages/core/src', // Указываем контекст для корректной работы путей
            },
          },
        ],
      },
    ],
  },
  mode: "development", // Используем development для более понятной сборки
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};

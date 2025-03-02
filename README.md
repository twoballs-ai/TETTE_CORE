Вот обновленная верcия документации, где указано, что TETTE Core — это ядро движка для создания игр на JavaScript, а фронтенд находится в отдельном репозитории.

---

# TETTE Core

TETTE Core is the core part of a game engine for creating games and interactive applications in JavaScript. It provides powerful tools and flexibility for development and supports both WebGL and WebGPU, making it suitable for a wide range of gaming projects. TETTE Core can be used independently or integrated with a graphical user interface (GUI). For the full GUI experience, please check out our frontend at [TETTE_GUI](https://github.com/twoballs-ai/TETTE_GUI).

> **Note**: The project is at an early stage of development and may currently contain significant shortcomings. We recommend waiting for a more stable release to avoid possible disappointment.

## Contents
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Development and Build](#development-and-build)
- [License](#license)

## Installation

To install the package via npm, run the command:

```bash
npm install tette-core
```

## Usage

To use TETTE Core in your project, import it as follows:

```javascript
import TetteCore from 'tette-core';

// Usage example
const game = new TetteCore.Game();
game.start();
```

## Scripts

### Building the Project
To build the project, use Webpack. Run the following command to create a build:

```bash
npm run build
```

### Additional Scripts
- **Build**: `npm run build` — compiles the project and creates a minified bundle in the `dist` folder.
- **Testing**: Testing can be added as needed.

## Project Structure

```
/dist                     # Compiled files
/examples                 # Usage examples
/src                      # Source code
  /core                   # Core modules
  /gameObjects            # Game objects and components
  /gameTypePresets        # Game type presets
  index.js                # Entry point
/.babelrc                 # Babel configuration
/webpack.config.js        # Webpack configuration
```

## Development and Build

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tette-core.git
cd tette-core
```

2. Install dependencies:

```bash
npm install
```

3. Run the build:

```bash
npm run build
```

4. If necessary, start the development server (e.g., using `webpack-dev-server` or `live-server` for examples).

## License

This project is distributed under the MIT License. You can find the full text of the license in the [LICENSE](LICENSE) file.

---

This documentation now clearly states that TETTE Core is the core of a JavaScript game engine, and it points to the separate frontend repository at [TETTE_GUI](https://github.com/twoballs-ai/TETTE_GUI).
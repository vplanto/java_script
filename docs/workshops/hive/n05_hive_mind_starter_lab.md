# Лабораторна: Hive Mind Starter (вставка коду + мінімальні правки)

> **Контекст:** Ви вже зробили fork `hive-mind-starter`, клонували репозиторій і переконалися, що `npm install` та `npm run dev` працюють. У цьому завданні ви **замінюєте вміст** кількох файлів у `src/` на код з цього документа, потім **дописуєте місця з позначками** `/* ВАШ КОД */` та `___` — цього достатньо, щоб на екрані з’явилися карта, мурахи та простий рух.

**Не змінюйте** `main.js`, `controllers/GameLoop.js` та `vite.config.js`, якщо викладач не просить інакше: вони вже зшивають `State`, `Renderer` і цикл кадрів.

---

## 1. Що зробити (коротко)

1. Відкрити проєкт форку `hive-mind-starter` у VS Code.
2. Для кожного файлу з розділу 3 — **повністю замінити** його вміст на наведений код (скопіювати з блоків нижче).
3. Знайти всі **`/* ВАШ КОД: ... */`** та **`___`** — замінити на коректний JavaScript (числа, умови, вирази для `dx`/`dy`, рядок кольору).
4. Запустити `npm run dev` і перевірити, що вкладка з `localhost` «жива», мурахи рухаються.

---

## 2. Що саме дописати (чеклист)

| Файл | Що потрібно від вас |
| :--- | :--- |
| `src/models/Grid.js` | Два числа: `wallChance`, `foodChance` (від 0 до 1); умова в `decay`: коли обнулювати феромон після множення на `PHEROMONE_DECAY`. |
| `src/models/State.js` | Значення `blueCount` (наприклад, половина від `ANT_COUNT`). |
| `src/algorithms/BlueAlgorithm.js` | Вираз для випадкового `dy` у діапазоні −1…1 (аналогічно до `dx`). |
| `src/algorithms/RedAlgorithm.js` | Свої `dx` та `dy` (наприклад, теж випадкові, але логіка може відрізнятися від синіх). |
| `src/views/Renderer.js` | Рядок `fillStyle` для червоної команди у форматі `rgb(r, g, b)`. |

Файл `src/entities/Ant.js` у шаблоні нижче вже узгоджений (поле `alive`, методи `isAlive()` / `kill()`), додаткових пропусків там немає.

---

## 3. Код по файлах

### 3.1. `src/models/Grid.js`

```javascript
/**
 * Сітка: статичний шар (порожньо / стіна / їжа) + один шар феромонів.
 * Індекс клітини: cellIndex = y * this.width + x
 */
import { PHEROMONE_DECAY, MAX_PHEROMONE } from '../config.js';

const CELL_EMPTY = 0;
const CELL_WALL = 1;
const CELL_FOOD = 2;

export class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    const cellCount = width * height;
    this.staticGrid = new Uint8Array(cellCount);
    this.pheromoneLayer = new Uint8Array(cellCount);
  }

  _cellIndex(x, y) {
    return y * this.width + x;
  }

  generateLevel() {
    const cellCount = this.width * this.height;
    this.staticGrid.fill(CELL_EMPTY);

    /* ВАШ КОД: ймовірність стіни всередині карти (число від 0 до 1), наприклад 0.08 */
    const wallChance = ___;

    /* ВАШ КОД: ймовірність їжі на порожній клітині (від 0 до 1), наприклад 0.02 */
    const foodChance = ___;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const isBorder = x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1;
        const cellIndex = this._cellIndex(x, y);
        if (isBorder) {
          this.staticGrid[cellIndex] = CELL_WALL;
          continue;
        }
        if (Math.random() < wallChance) {
          this.staticGrid[cellIndex] = CELL_WALL;
        } else if (Math.random() < foodChance) {
          this.staticGrid[cellIndex] = CELL_FOOD;
        }
      }
    }
  }

  get(x, y) {
    if (!this.isValidPosition(x, y)) {
      return CELL_WALL;
    }
    return this.staticGrid[this._cellIndex(x, y)];
  }

  set(x, y, value) {
    if (!this.isValidPosition(x, y)) {
      return;
    }
    this.staticGrid[this._cellIndex(x, y)] = value;
  }

  getPheromone(x, y) {
    if (!this.isValidPosition(x, y)) {
      return 0;
    }
    return this.pheromoneLayer[this._cellIndex(x, y)];
  }

  setPheromone(x, y, value) {
    if (!this.isValidPosition(x, y)) {
      return;
    }
    if (this.get(x, y) === CELL_WALL) {
      return;
    }
    const clamped = Math.max(0, Math.min(MAX_PHEROMONE, Math.floor(value)));
    this.pheromoneLayer[this._cellIndex(x, y)] = clamped;
  }

  decay() {
    for (let cellIndex = 0; cellIndex < this.pheromoneLayer.length; cellIndex++) {
      let value = this.pheromoneLayer[cellIndex];
      value = value * PHEROMONE_DECAY;
      /* ВАШ КОД: якщо value менше 1 — записати 0, інакше записати округлене value */
      if (___) {
        this.pheromoneLayer[cellIndex] = 0;
      } else {
        this.pheromoneLayer[cellIndex] = Math.floor(value);
      }
    }
  }

  isValidPosition(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  clear(defaultValue = CELL_EMPTY) {
    this.staticGrid.fill(defaultValue);
    this.pheromoneLayer.fill(0);
  }

  getCell(x, y) {
    return this.get(x, y);
  }

  setCell(x, y, value) {
    this.set(x, y, value);
  }
}
```

### 3.2. `src/entities/Ant.js`

```javascript
import { update as blueAlgo } from '../algorithms/BlueAlgorithm.js';
import { update as redAlgo } from '../algorithms/RedAlgorithm.js';
import { MAX_PHEROMONE } from '../config.js';

const CELL_WALL = 1;
const CELL_FOOD = 2;

export class Ant {
  constructor(x, y, id, teamId) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.teamId = teamId;
    this.alive = true;
  }

  update(view, grid) {
    if (!this.alive) {
      return null;
    }

    const action = this.teamId === 0 ? blueAlgo(this, grid) : redAlgo(this, grid);
    if (!action) {
      return null;
    }

    const newX = this.x + action.dx;
    const newY = this.y + action.dy;

    if (!grid.isValidPosition(newX, newY)) {
      return null;
    }
    if (grid.get(newX, newY) === CELL_WALL) {
      return null;
    }

    this.x = newX;
    this.y = newY;

    /* БОНУС (не обов’язково для мінімального заліку): їжа під мурахою — прибрати їжу й поставити феромон */
    if (grid.get(this.x, this.y) === CELL_FOOD) {
      grid.set(this.x, this.y, 0);
      grid.setPheromone(this.x, this.y, MAX_PHEROMONE);
    }

    return null;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getId() {
    return this.id;
  }

  getTeamId() {
    return this.teamId;
  }

  moveTo(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  isAlive() {
    return this.alive;
  }

  kill() {
    this.alive = false;
  }
}
```

### 3.3. `src/models/State.js`

```javascript
import { Grid } from './Grid.js';
import { Ant } from '../entities/Ant.js';
import { WORLD_SIZE, ANT_COUNT } from '../config.js';

export class State {
  constructor() {
    this.grid = new Grid(WORLD_SIZE, WORLD_SIZE);
    this.ants = [];
  }

  init() {
    this.grid.generateLevel();

    this.ants.length = 0;
    let nextId = 0;

    /* ВАШ КОД: скільки мурах синьої команди (teamId = 0). Решта — червона (teamId = 1). Підказка: половина від ANT_COUNT */
    const blueCount = ___;

    for (let i = 0; i < blueCount; i++) {
      const x = 1 + Math.floor(Math.random() * (WORLD_SIZE - 2));
      const y = 1 + Math.floor(Math.random() * (WORLD_SIZE - 2));
      this.ants.push(new Ant(x, y, nextId++, 0));
    }

    for (let i = this.ants.length; i < ANT_COUNT; i++) {
      const x = 1 + Math.floor(Math.random() * (WORLD_SIZE - 2));
      const y = 1 + Math.floor(Math.random() * (WORLD_SIZE - 2));
      this.ants.push(new Ant(x, y, nextId++, 1));
    }
  }

  update() {
    this.grid.decay();

    for (const ant of this.ants) {
      ant.update(null, this.grid);
    }

    this.ants = this.ants.filter((ant) => ant.isAlive());
  }

  getGrid() {
    return this.grid;
  }

  getAnts() {
    return this.ants;
  }

  addAnt(ant) {
    this.ants.push(ant);
  }

  removeAnt(antId) {
    this.ants = this.ants.filter((ant) => ant.getId() !== antId);
  }

  save() {
    return false;
  }

  load() {
    return false;
  }

  reset() {
    this.ants = [];
    this.grid.clear(0);
    this.init();
  }
}
```

### 3.4. `src/algorithms/BlueAlgorithm.js`

```javascript
/**
 * Повертає крок руху: dx, dy кожен з множини {-1, 0, 1}
 */
export function update(ant, grid) {
  const dx = Math.floor(Math.random() * 3) - 1;
  /* ВАШ КОД: так само випадково оберіть dy від -1 до 1 */
  const dy = ___;
  return { dx, dy };
}
```

### 3.5. `src/algorithms/RedAlgorithm.js`

```javascript
export function update(ant, grid) {
  /* ВАШ КОД: зробіть інший випадковий крок, ніж у синіх (достатньо змінити порядок або формулу) */
  const dx = ___;
  const dy = ___;
  return { dx, dy };
}
```

### 3.6. `src/views/Renderer.js`

```javascript
import { WORLD_SIZE } from '../config.js';

const CELL_WALL = 1;
const CELL_FOOD = 2;

export class Renderer {
  constructor(canvas, cellSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cellSize = cellSize;
    this.canvas.width = WORLD_SIZE * cellSize;
    this.canvas.height = WORLD_SIZE * cellSize;
  }

  drawToolbar() {
    const toolbarHeight = 60;
    const toolbarY = this.canvas.height - toolbarHeight;
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(0, toolbarY, this.canvas.width, toolbarHeight);
    this.ctx.strokeStyle = '#444';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, toolbarY, this.canvas.width, toolbarHeight);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Hive Mind (lab)', 10, toolbarY + toolbarHeight / 2);
  }

  render(grid, ants) {
    const w = grid.getWidth();
    const h = grid.getHeight();

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 60);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cellType = grid.get(x, y);
        const ph = grid.getPheromone(x, y);

        let fillR = 0;
        let fillG = 0;
        let fillB = 0;

        if (cellType === CELL_WALL) {
          fillR = 40;
          fillG = 40;
          fillB = 60;
        } else if (cellType === CELL_FOOD) {
          fillR = 220;
          fillG = 160;
          fillB = 40;
        } else {
          fillB = Math.min(255, ph);
          fillG = Math.min(255, Math.floor(ph * 0.4));
        }

        this.ctx.fillStyle = `rgb(${fillR},${fillG},${fillB})`;
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }

    const dot = Math.max(2, Math.floor(this.cellSize / 3));
    for (const ant of ants) {
      if (!ant.isAlive()) {
        continue;
      }
      const px = ant.getX() * this.cellSize;
      const py = ant.getY() * this.cellSize;

      if (ant.getTeamId() === 0) {
        this.ctx.fillStyle = 'rgb(80, 160, 255)';
      } else {
        /* ВАШ КОД: колір червоної команди у форматі rgb(..., ..., ...) */
        this.ctx.fillStyle = ___;
      }

      this.ctx.fillRect(px + dot, py + dot, dot, dot);
    }

    this.drawToolbar();
  }

  clear(color = '#000000') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderCell(x, y, value) {}

  renderAnt(ant) {}

  resize(width, height) {
    this.canvas.width = width * this.cellSize;
    this.canvas.height = height * this.cellSize;
  }

  getContext() {
    return this.ctx;
  }
}
```

---

## 4. Що здати в Classroom

- Скріншот браузера з `localhost` (адресний рядок видно).
- Коротко: які значення ви поставили для `wallChance`, `foodChance`, `blueCount` (або формула для `blueCount`).

Якщо проєкт не збирається — текст помилки з терміналу та перелік уже зроблених кроків.

---

## 5. Підказка для `decay`

Після `value = value * PHEROMONE_DECAY` логіка з брифу курсу: якщо рівень став «занадто малим», клітина вважається порожньою для феромону. Поріг у шаблоні залишено для вас як умова в `if (___)`.

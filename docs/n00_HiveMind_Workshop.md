# Workshop: Hive Mind Architecture (Technical Brief)

> **Context:** Цей документ описує архітектуру Reference-імплементації, яку ми демонструємо на воркшопі. Ваша задача — відтворити цю логіку у Starter Kit.

## 1. Core Concept: Data-Oriented Design

Ми відмовляємось від класичного OOP (де клітинка — це об'єкт) на користь **Structure of Arrays (SoA)**. Це необхідно для продуктивності JS-двигуна (V8) при 10,000+ агентів.

### The Grid (Пам'ять)

Світ — це набір пласких масивів `Uint8Array` розміром `WIDTH * HEIGHT`.

* **Static Layer:** `staticGrid[i]` — зберігає незмінні дані (0=Empty, 1=Wall, 2=Food).
* **Dynamic Layer:** `pheromones[teamId][i]` — два окремі буфери для теплових карт (Heatmaps) феромонів.
* **Access:** Доступ через індекс `y * width + x`. Це гарантує Cache Locality.

## 2. Agent Logic (Finite State Machine)

Мураха — це не "штучний інтелект", а простий автомат станів.

### States

1. **FORAGING (Пошук):**
* Рух: Random Walk + зважений вибір напрямку за градієнтом феромону *своєї* команди (якщо реалізовано).
* Дія: Якщо `grid.hasFood(x,y)` → `pickFood()` → перехід у стан **RETURNING**.
* Маркер: Залишає феромон "TO HOME" (максимальна інтенсивність).


2. **RETURNING (Повернення):**
* Рух: Векторна навігація до `homeX, homeY` (база).
* Дія: Якщо дистанція до бази < 5px → скинути їжу → перехід у стан **FORAGING**.
* Маркер: Залишає феромон "TO FOOD".

### Sensing (Sensors)

Агент "сліпий". Він читає лише:

* Свою позицію `(x, y)`.
* Значення клітинки під собою та 8 сусідів.
* Вектор до ворога (тільки для Combat Phase).

## 3. The Rules of War (Combat System)

Бойова система детермінована і базується на **Lanchester's Laws** (Focus Fire).

**Алгоритм (виконується кожен тік після руху):**

1. **O(N^2) Detection:** Кожен агент сканує радіус атаки (`r^2 = 60`).
2. **Focus Calculation:** Для кожного агента `A` рахуємо `EnemiesTargeting(A)`.
3. **Resolution:** Агент `A` помирає, якщо існує ворог `E`, такий що:



> **Наслідок:** 2 слабких агенти, що атакують одного сильного, вбивають його і виживають. Одинак завжди програє групі.

## 4. Simulation Loop (Game Tick)

Порядок виконання критичний для детермінізму:

1. **Pheromone Decay:** `grid *= 0.99` (Global Compute Step).
2. **Agent Update:**
* Think (Algorithm: Blue/Red).
* Move (Physics & Collision).
* Action (Pick/Drop/Spray).


3. **Combat Resolution:** Видалення мертвих агентів.
4. **Spawn Phase:** Якщо агент повернув їжу → `new Ant()`.
5. **Render:** Малювання (не впливає на логіку).

## 5. Your Task (The Workshop)

Ви отримуєте **Starter Kit**, де:

* `Renderer` — готовий.
* `Config` — готовий.
* **Grid / Ant / State / Algorithms** — пусті заглушки.

**Ціль:** Реалізувати механіку Reference-демо, дотримуючись обмежень пам'яті та швидкодії. Перемагає алгоритм, який краще балансує між експансією (Movement) та війною (Combat).
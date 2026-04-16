# Основи Інтернет-технологій: Web Engineering

> **Статус:** Активна розробка / 2025
> **Університет:** ОНУ ім. І. І. Мечникова
> **Лектор:** vplanto (Senior Teacher, SRE)
> **Контекст:** Перехід з C++ на Web Development

## ⚡ Про курс: The "C++" Approach to JavaScript

Це не типовий курс "HTML/CSS для новачків". Це курс **Reverse Engineering** вебу для студентів, які вже розуміють, що таке пам'ять, вказівники та алгоритмічна складність.

Ми не вчимо "магію" фреймворків. Ми розбираємо браузер як операційну систему, написану на C++, і вчимося керувати нею за допомогою JavaScript.

### Чому це важливо?
* **Браузер — це C++:** Рушій V8 (Chrome) написаний на C++. Розуміючи Stack vs Heap, ви зрозумієте, чому ваш JS-код гальмує.
* **Безпека — це не опція:** Ми вивчаємо XSS, CSRF та CORS не як абревіатури, а як реальні вектори атак.
* **AI-Ready:** Ми інтегруємо Generative AI у workflow, але не як "автопілот", а як "екзоскелет" для інженера.

---

## 🐜 Головний проєкт: Hive Mind

Замість банальних To-Do списків ми будуємо **високонавантажену симуляцію мурашиної колонії**.

**Технічні виклики:**
* **Rendering:** Відмалювати 1000+ агентів при 60 FPS (Canvas API vs DOM).
* **Memory:** Оптимізація структур даних (TypedArrays замість Objects) для економії RAM.
* **Architecture:** MVC / ECS патерни без використання React/Vue.

🔴 **Увага:** Код проєкту винесено в окремий репозиторій для симуляції реального робочого процесу (Fork & Pull Request).

👉 **[Перейти до репозиторію Hive Mind Starter](https://github.com/vplanto/hive-mind-starter)**

---

## 🛠 Технічний стек

Ми використовуємо принцип **"Zero Magic"**. Жодних фреймворків, поки ми не навчимося писати їх самі.

* **Runtime:** Google Chrome (V8 Engine) / Firefox (SpiderMonkey).
* **Language:** Vanilla JavaScript (ES6+), JSDoc (для типізації).
* **Build System:** Node.js + Vite.
* **Version Control:** Git + GitHub Flow.

---

## 📂 Структура цього репозиторію

Цей репозиторій є вашим "Підручником".

* **`docs/`** — Тексти лекцій, лабораторні роботи та методичні вказівки.
    * [`00_manifesto.md`](docs/00_manifesto.md) — Філософія курсу.
    * [`n01_setup.md`](docs/n01_setup.md) — Налаштування середовища (VS Code, Git).
    * `workshops/` — Покрокові інструкції до практик.
* **`examples/`** — Приклади коду з лекцій (Live Coding demos).

---

## 📚 Програма курсу

### Модуль 0: Підготовка
- [00. Маніфест: Інженер vs Кодер](docs/00_manifesto.md) — Філософія курсу в епоху AI
- [Setup: Налаштування середовища](docs/n01_setup.md) — VS Code, Node.js, Git
- [Git Basics](docs/n03_git_basics.md) — Контроль версій та GitHub Flow
- [Markdown](docs/n02_markdown.md) — Документація як код

### Модуль 1: Browser Internals
- [01. HTML & DOM](docs/01_html_dom.md) — Браузер як C++ програма, DOM Tree, Forms
- [02. CSS Layout](docs/02_css_layout.md) — Box Model, Positioning, Flexbox/Grid
- [03. JavaScript Runtime](docs/03_js_core.md) — V8 Engine, Stack vs Heap, References
- [03a. OS Basics](docs/03a_os_basics.md) — Процеси, Потоки, Web Workers
- [04. Browser Internals](docs/04_browser_internals.md) — Main Thread, Event Loop, Rendering Pipeline

### Модуль 2: Data & Networking
- [05. JSON & LocalStorage](docs/05_json_data.md) — Серіалізація, Persistence
- [06. Networking (OSI Model)](docs/06_networking_osi.md) — TCP/IP, DNS, HTTPS
- [07. HTTP & REST](docs/07_http_rest.md) — API Design, Status Codes, Fetch
- [08. Security](docs/08_security.md) — XSS, CSRF, CORS, Content Security Policy

### Воркшопи (Практичні завдання)
1. [Bad UI Battle](docs/workshops/ws01_bad_ui.md) — DOM Events та хакерство з UX
2. [Monte Carlo & Web Workers](docs/workshops/ws02_monte_carlo.md) — Багатопотоковість
3. [DOM Optimization](docs/workshops/ws03_dom_optimization.md) — Virtual DOM підхід
4. [Game Loop (Pong)](docs/workshops/ws04_game_loop.md) — 60 FPS фізика
5. [Minesweeper](docs/workshops/ws05_minesweeper.md) — Рекурсія та розумний UI
6. [Data Analytics](docs/workshops/ws06_data_analytics.md) — JSON/XML Експорт
7. [Weather API](docs/workshops/ws07_weather_api.md) — Fetch та REST
8. [Auth & Security](docs/workshops/ws08_auth_security.md) — Хешування (SHA-256)
9. [Game Logic (AI)](docs/workshops/ws09_game_logic.md) — Алгоритми рішень

### Довідкові матеріали
- [FAQ & Troubleshooting](docs/faq_troubleshooting.md) — Типові проблеми та рішення

---

## 🚀 Як проходити цей курс

1.  **Почніть з теорії:** Прочитайте [Маніфест](docs/00_manifesto.md).
2.  **Підготуйте інструменти:** Виконайте інструкцію [Setup Guide](docs/n01_setup.md).
3.  **Почніть проєкт:**
    * Перейдіть до [hive-mind-starter](https://github.com/vplanto/hive-mind-starter).
    * Зробіть **Fork**.
    * Виконуйте завдання з папки `docs/workshops/` у цьому репозиторії, застосовуючи знання у своєму форку гри.

### Політика щодо AI
Ми використовуємо **Side-by-Side Engineering**.
* ✅ **Можна:** Просити AI пояснити код, знайти помилку, згенерувати бойлерплейт.
* ❌ **Заборонено:** Копіювати рішення, яке ви не можете пояснити.

---

## Ліцензія

* **Вихідний код прикладів (`/examples`):** MIT License.
* **Навчальні матеріали (`/docs`):** CC-BY-4.0 (із зазначенням авторства).

> *If you want to master the craft, you must understand the machine.*

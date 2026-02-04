# TODO: Course Modernization Plan (Web Engineering)

## Meta Goals
- [ ] **Enforce Modern Syntax:** Заборонити `var` на рівні правил прийому робіт. Тільки `const` / `let`.
- [ ] **Shift to Modules:** Відмовитися від глобального Scope у браузері. Всі скрипти мають бути `<script type="module">`.

---

## 🎨 Module 1: HTML/CSS (DOM)
### Воркшоп 1: "Bad UI Battle"
- [ ] **Додати Task: Event Delegation.**
    - *Суть:* Замість вішання 100 лісенерів на 100 кнопок, повісити 1 на контейнер.
    - *Мета:* Показати Memory Footprint різницю (O(N) vs O(1) для лісенерів).
    - *Tech:* `e.target.closest('.btn')`.

---

## 🧠 Module 2: JS Core
### Лекція 3: JS Runtime & Syntax
- [ ] **Update Content: ES6+ Essentials.**
    - Впровадити як стандарт:
        - Destructuring (для конфігів).
        - Arrow Functions (пояснити лексичний контекст `this` vs dynamic `this`).
        - Template Literals (замість конкатенації `+`).

### Воркшоп 4: Game Loop (Pong)
- [ ] **Refactor: Implement ES Modules.**
    - Розбити моноліт `game.js` на:
        - `InputHandler.js` (Class export)
        - `Physics.js` (Pure functions export)
        - `Renderer.js` (DOM manipulation)
    - *Мета:* Навчити ізоляції коду та `import / export`.

---

## 🌐 Module 4: Networking
### Лекція 7: HTTP & REST
- [ ] **Add Section: Async Patterns Evolution.**
    - Чітка еволюція: Callback Hell -> Promises -> Async/Await.
    - Показати *чому* ми використовуємо `await` (читабельність, flow control).

### Воркшоп 9: Weather API
- [ ] **Додати Task: Promise Orchestration.**
    - Завдання: Отримати погоду для 3-х столиць *одночасно* (не послідовно).
    - *Tech:* `Promise.all()`.
- [ ] **Додати Task: Robust Error Handling.**
    - Реалізувати блок `try/catch` з обробкою мережевих помилок vs помилок API (404/500).

---

## Module 5: Security & Final Project
### Воркшоп 7: Auth & Security
- [ ] **Додати Task: Client-Side Form Validation.**
    - Валідація *до* відправки запиту (UX + Security layer 1).
    - *Tech:* HTML5 Constraint Validation API (`checkValidity()`, `setCustomValidity`) або RegEx вручну.
    - *Anti-pattern:* Не відправляти запит на сервер, якщо пароль коротший за 8 символів.

### Final Project: Rock-Paper-Scissors AI
- [ ] **Додати Requirement: Deployment.**
    - Код не має "жити" тільки на localhost.
    - *Task:* Задеплоїти гру на GitHub Pages або Vercel.
    - *Check:* Посилання має відкриватися з телефону.

---

## 📚 Resources (Setup)
- [ ] **Update: N01 Setup.**
    - Додати налаштування Prettier/ESLint з базовим конфігом (AirBnB style або спрощений), щоб привчити до культури коду автоматично.
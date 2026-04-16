# Workshop: Оптимізація DOM та State Management (Memory Game)

Ми отримали код гри "Memory" від попереднього розробника. Гра працює, але код написаний "в лоб".
Ваше завдання — провести **Code Review** та **Рефакторинг**, перетворивши його на професійний продукт.

## 1. Аналіз "Legacy" коду

Запустіть гру з папки `examples/module_02_dom/memory_game_legacy`.
Відкрийте `memory.js`. Знайдіть функцію `drawBoard()`:

```javascript
function drawBoard() {
    gameBoard.innerHTML = ''; // ❌ ВИДАЛЯЄМО ВСЕ
    cards.forEach((card, i) => drawCard(i, card)); // ❌ СТВОРЮЄМО ЗАНОВО
}
```

**Проблема:** Це називається **DOM Thrashing**. При кожному кліку ми знищуємо всі елементи і створюємо нові.

1.  Це навантажує браузер (Layout/Paint).
2.  Ми втрачаємо анімації (неможливо зробити плавний переворот через CSS `transition`, бо елемент знищується).

## 2\. Челендж 1: CSS Grid замість JS-математики

Подивіться на цей код:

```javascript
div.style.left = `${(i % 4) * 100}px`;
div.style.top = `${Math.floor(i / 4) * 100}px`;
div.style.position = 'absolute';
```

Це "милиці". Ми обчислюємо координати вручну.

**Завдання:**

1.  Видаліть цей JS-код.
2.  Перепишіть `style.css`, використовуючи **CSS Grid**.
    ```css
    #game-board {
        display: grid;
        grid-template-columns: repeat(4, 100px);
        gap: 10px;
    }
    .card {
        position: static; /* Повертаємо у потік */
        /* ... */
    }
    ```

## 3\. Челендж 2: Розумний рендеринг (Virtual DOM approach)

Замість того, щоб перемальовувати все поле, ми повинні змінювати стан конкретного елемента.

**Алгоритм:**

1.  Створіть HTML-елементи **один раз** при старті гри.
2.  Збережіть посилання на ці DOM-елементи в масив `cards`.
3.  При кліку додавайте/прибирайте клас `.flipped` конкретному елементу.

```javascript
// Підказка для реалізації
function initGame() {
    // 1. Створити DOM один раз
    cards.forEach((card, index) => {
        const el = document.createElement('div');
        el.classList.add('card');
        el.dataset.index = index; // Зберігаємо ID
        el.addEventListener('click', onCardClick);
        gameBoard.appendChild(el);
        
        // Зберігаємо посилання на DOM-елемент прямо в об'єкті картки (або в окремому масиві)
        card.element = el; 
    });
}

function updateView() {
    // 2. Оновлюємо тільки класи
    cards.forEach(card => {
        if (card.flipped) {
            card.element.classList.add('flipped');
            card.element.style.backgroundColor = card.color;
        } else {
            card.element.classList.remove('flipped');
            card.element.style.backgroundColor = 'grey';
        }
    });
}
```

## 4\. Висновок

Ви перейшли від **Imperative UI** (наказуємо браузеру малювати кожен піксель) до **Declarative UI** (описуємо стан, а браузер оновлює тільки те, що змінилося). Це принцип, на якому працюють React, Vue та Angular.

---

## Контрольні питання

1. Що таке DOM Thrashing і чому він повільний?

<details markdown="1">
<summary>Відповідь</summary>

DOM Thrashing — коли ви чергуєте запис і читання DOM без «батчинга». Браузер змушений робити **reflow** (перерахунок геометрії) при кожному читанні, якщо перед цим був запис. Наприклад: `element.style.width = '100px'; el2.offsetWidth; element.style.height = '50px'; el3.offsetWidth` — 2 reflow замість одного.

</details>

2. Яку проблему вирішує збереження посилань на DOM-елементи в масиві, замість пошуку через `querySelector`?

<details markdown="1">
<summary>Відповідь</summary>

`querySelector` проходить по всьому DOM-дереву щоразу — O(N) для кожного виклику. Якщо у вас 100 карток, це 100 обходів DOM при кожному оновленні. Збережені посилання — O(1) доступ, що у 100 разів швидше для великих списків.

</details>

3. Чому `element.classList.add('flipped')` є кращим підходом, ніж `element.style.backgroundColor = 'red'`?

<details markdown="1">
<summary>Відповідь</summary>

Inline стилі мають специфічність 1000 і складно перевизначаються. Зміна через класи дозволяє: (1) описувати всі стани у CSS (legible), (2) використовувати CSS transitions/animations автоматично, (3) не змішувати JS-логіку з візуальними деталями (separation of concerns).

</details>

4. Як цей воркшоп ілюструє принцип «Model-View» розмежування?

<details markdown="1">
<summary>Відповідь</summary>

Model — масив `cards[]` із станом кожної картки (`flipped: boolean, color: string`). View — DOM-елементи. Функція `updateView()` читає Model і синхронізує DOM. Жодна логіка гри не торкається DOM напряму — тільки через `updateView()`. Це і є MVC без фреймворку.

</details>
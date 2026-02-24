# Лекція 01: HTML як Дерево (DOM), Browser Internals та Форми

**Тип заняття:** Лекція / Deep Dive
**Необхідний бекграунд:** C++ (Memory, Pointers, Threads)
**Мета:** Зрозуміти, як текст перетворюється на пікселі, чому `<div>` коштує дорого, і як працює передача даних.

---

## Експрес-опитування: Перформанс

**Питання:** Що браузер малює швидше?

A) `opacity: 0.5` (елемент напівпрозорий)  
B) `display: none` (елемент прихований)

<details markdown="1">
<summary>Відповідь</summary>

**A**. `opacity` змінює тільки Paint Layer (піксельне забарвлення). `display: none` видаляє елемент з Layout Tree → браузер перераховує розташування всіх інших елементів (Reflow/Relayout). Це дорого.

> Запам'ятайте правило: **Layout > Paint > Composite**. Чим пізніше в пайплайні змінюється властивість, тим швидше.

</details>

---

## 1. Ментальна модель: DOM як Структура Даних

Ми не "верстаємо сторінки". Ми проектуємо граф об'єктів у пам'яті.

### 1.1. Природа мови: Declarative vs Imperative
HTML — це **декларативна мова (Declarative Language)**. Це важливо розуміти після C++.

* **Імперативний підхід (C++, Assembly):** Ви описуєте *як* досягти результату. Ви керуєте пам'яттю, циклами та інструкціями CPU.
* **Декларативний підхід (HTML, SQL):** Ви описуєте *що* має бути результатом. Ви визначаєте ієрархію елементів ("тут має бути кнопка"), а браузер сам вирішує, *як* це намалювати, скільки пам'яті виділити та як обробити клік.

> **🤓 Geek Note: HTML + CSS is Turing Complete**
> Існує міф, що HTML/CSS — це "не програмування", бо там немає логіки.
> Проте, математично доведено, що **HTML + CSS є повними за Тюрінгом (Turing Complete)**. Це означає, що будь-який алгоритм, який може виконати машина Тюрінга, теоретично можна реалізувати на чистому HTML+CSS (наприклад, використовуючи складні селектори та чекбокси як стан пам'яті).
> *На практиці ми це не використовуємо, але це демонструє потужність CSS-движка.*

### Давайте поміркуємо: Локальність та Пам'ять
Уявіть ситуацію: ви зайшли на сайт банку, відкрили DevTools (`F12`), знайшли свій баланс і змінили HTML з `100 грн` на `1,000,000 грн`.
**Питання:** Чи стали ви мільйонером? Чому?

<details markdown="1">
<summary>Інженерна відповідь</summary>

1.  **Ні.** Браузер — це "товстий клієнт".
2.  Сервер віддав вам **копію** даних (HTML String).
3.  Браузер розпарсив цей рядок і створив **DOM Tree** (дерево об'єктів) у вашій локальній RAM.
4.  Змінюючи HTML, ви змінюєте лише стан локальної пам'яті (Heap вашого процесу). База даних на сервері про це навіть не знає.

**Аналогія з C++:**
Це як отримати `struct UserData` по мережі, змінити в ній поле `balance` локально, але не відправити зміни назад.
</details>

---

## 2. Еволюція та Стандарти (History & Standards)

Чому ваш браузер досі підтримує код з 1995 року і хто насправді керує вебом?

### 2.1. XHTML: Спроба навести порядок (The Strict Era)
На початку 2000-х W3C (World Wide Web Consortium) хотіли зробити HTML строгим, як XML. Так з'явився **XHTML**.
* **Філософія:** "Syntax Error = Stop Rendering". Це була спроба нав'язати інженерну дисципліну.
* **Аналог в C++:** Це компіляція з прапором `-Werror`. Якщо ви забули закрити дужку `/>` або використали неканонічний атрибут — сторінка не рендериться взагалі (Yellow Screen of Death).
* **Чому провалився:** Web — це "брудне" середовище. Бізнес не міг дозволити, щоб сайт не працював через одну помилку в розмітці. Браузери обрали шлях **"Fault Tolerance"** (виправляти помилки за розробника), що вбило ідею XHTML.

### 2.2. HTML4 vs HTML5: Зміна парадигми
**HTML4 (1997)** був мовою розмітки *текстових документів*.
**HTML5 (2014)** став платформою для *застосунків*.

| Характеристика | HTML4 / XHTML | HTML5 |
| :--- | :--- | :--- |
| **Мультимедіа** | Потрібен плагін (Flash, Silverlight) | Нативні `<video>`, `<audio>`, `<canvas>` |
| **Зберігання даних** | Тільки Cookies (4KB, летять з кожним запитом) | LocalStorage (5MB+), IndexedDB (NoSQL база в браузері) |
| **Комунікація** | `XMLHttpRequest` (Short polling) | `WebSockets` (Full-duplex TCP), Server-Sent Events |
| **Семантика** | `<div id="header">`, `<div class="nav">` | `<header>`, `<nav>`, `<article>`, `<section>` |
| **Parsing** | Невизначений для помилок | Чітко описано, як браузер має "лагодити" битий HTML |

### 2.3. WHATWG та Living Standard
Сьогодні поняття "HTML5" технічно застаріло. Існує просто **HTML Living Standard**.

* **Конфлікт:** W3C хотів академічної чистоти (XHTML 2.0). Виробники браузерів (Apple, Mozilla, Opera) хотіли прагматизму і зворотної сумісності.
* **WHATWG:** У 2004 році ці компанії створили власну групу — **W**eb **H**ypertext **A**pplication **T**echnology **W**orking **G**roup.
* **Результат:** WHATWG перемогла. Зараз HTML не має версій (6, 7, 8). Це **Rolling Release** — стандарт оновлюється постійно. Браузери (Chrome, Safari, Firefox) імплементують саме специфікацію WHATWG, а не W3C.

---

## 3. Анатомія Браузера: Процеси та Потоки

Сучасний Chrome — це не одна програма, це міні-ОС.

### Архітектура: Багатопроцесна модель Chrome
**Джерело:** [Inside look at modern web browser (Part 1)](https://developer.chrome.com/blog/inside-browser-part1)

[Локальна демо-версія: Як працює браузер](how_do_browsers_work/index.html)

**Ключова концепція:** Браузер діє як міні-операційна система, керуючи набором ізольованих процесів, що спілкуються через IPC (Inter-Process Communication).

**Основні процеси:**
1. **Browser Process ("Керівник"):**
   - Координація стану застосунку (UI вікна, адресний рядок, кнопки).
   - Управління привілейованими операціями: мережеві запити (Network) та доступ до файлів (Storage).
2. **Renderer Process ("Робочий"):**
   - Відповідає за перетворення HTML/CSS/JS у візуальну сторінку.
   - Містить двигун Blink (Layout) та V8 (JS).
   - **Scope:** Зазвичай один процес на вкладку (Site Isolation).
   - **Безпека:** Працює в пісочниці (Sandbox), не має прямого доступу до ОС.
3. **GPU Process:**
   - Обробляє задачі растеризації та композитингу сторінок.
   - Ізольований в окремий процес для захисту браузера від падінь відеодрайверів.

**Trade-off (Компроміс архітектури):**
- **Переваги:** Висока стабільність (краш однієї вкладки не вбиває браузер), безпека, паралельне виконання.
- **Недоліки:** Підвищене споживання оперативної пам'яті (RAM) через дублювання базових структур у кожному процесі.

### 3.1. Threading Model (Хто виконує ваш код?)

| Процес / Потік | Аналог у C++ GameDev | За що відповідає |
| :--- | :--- | :--- |
| **Browser Process** | `Kernel / OS` | Рамка вікна, доступ до файлів, мережеві запити. |
| **Renderer Process** | `Game Engine` | Ізольований процес для кожної вкладки. Тут живе ваш сайт. |
| **Main Thread** | `Game Logic Thread` | **Вузьке місце.** Парсинг HTML, виконання JS, розрахунок стилів (CSS), Layout. |
| **Compositor Thread** | `Render Thread` | Отримує готові шари і каже GPU, як їх малювати. Обробляє скрол. |

### 🤔 Давайте поміркуємо: Чому зависає сторінка?

Ви написали такий код. Сторінка "померла": кнопки не натискаються, текст не виділяється. Але скрол працює. Чому?

```javascript
// WARNING: Deadlock для Main Thread
while(true) {
    console.log("I am blocking the Event Loop");
}

```

<details markdown="1">
<summary>Архітектурне рішення</summary>

1. **Main Thread заблокований** нескінченним циклом. Він не може обробити подію `click` або перерахувати `hover` ефекти.
2. **Compositor Thread вільний.** Скрол — це часто просто зміщення вже намальованих шарів (Layers). Композитор може рухати картинку вгору-вниз без участі Main Thread.

**Висновок:** Важкі обчислення (Pathfinding мурах) не можна робити в Main Thread. Треба використовувати **Web Workers** (аналог `std::thread`).

</details>

---

## 4. Critical Rendering Path: Ціна одного тегу

Як `<div style="width: 50%">` перетворюється на пікселі?

### Етап 1: DOM & CSSOM Construction

Браузер парсить HTML у **DOM Tree**, а CSS у **CSSOM Tree** (CSS Object Model).

**Приклад коду:**

```html
<div class="box">Text</div>

```

```css
/* CSS */
.box { color: red; }

```

**Структура DOM дерева (візуалізація):**

```
Document
  └── <html>
      ├── <head>
      │   └── <style> (CSSOM)
      │       └── .box { color: red; }
      └── <body>
          └── <div class="box">
              └── TextNode: "Text"
```

**Що в пам'яті (псевдокод C++):**

```cpp
struct Element {
    string tagName = "div";
    map<string, string> computedStyles = { {"color", "rgb(255,0,0)"} };
    vector<Node*> children;
};

```

### Етап 2: Render Tree

Браузер об'єднує DOM і CSSOM.

* **Важливо:** Елементи з `display: none` **не потрапляють** у Render Tree. Вони не існують для рендера.
* Елементи з `visibility: hidden` **потрапляють** (вони прозорі, але займають місце).

### Етап 3: Layout (Reflow) — Найдорожча операція

Браузер рахує геометрію: `x, y, width, height` для кожного прямокутника.

**Приклад (Layout Thrashing):**

```javascript
// ПОГАНО: Читання і запис у циклі викликає постійний перерахунок Layout
for (let i = 0; i < 100; i++) {
    div.style.width = (div.offsetWidth + 1) + 'px'; 
}

```

### Етап 4: Paint & Stacking Contexts (Малювання)

Браузер заповнює пікселі: кольори, тіні, картинки. Тут вступає в гру **Stacking Order**.

**Як браузер вирішує, хто зверху? (Painter's Algorithm)**
Він малює елементи в такій послідовності (спрощено):

1. Background та Borders.
2. Block-level елементи (звичайний потік).
3. Float елементи.
4. **Content** (текст, inline елементи).
5. **Positioned Elements** (де працює `z-index`).

#### Z-Index та Позиціонування

**Призначення:** Властивість `z-index` визначає порядок накладання елементів (вісь Z) у Render Tree.

**1. Природний порядок (Natural Stacking Order)**
Якщо `z-index` та `position` не задані, діють прості правила:

* Порядок відповідає черговості в HTML-коді.
* Елемент, оголошений нижче в коді, відображається поверх попередніх.

**2. Вплив властивості Position**

* **Пріоритет:** Будь-які позиційовані елементи (`relative`, `absolute`, `fixed`, `sticky`) та їхні діти відображаються **поверх** непозиційованих (`static`) елементів.

**3. Правила роботи Z-Index**

* **Вимога:** `z-index` працює **ТІЛЬКИ** на позиційованих елементах.
* *Якщо елемент `static`, `z-index` буде проігноровано.*


* **Виняток (Flexbox):** Flex-дочірні елементи можуть використовувати `z-index`, навіть якщо вони не позиційовані (`position: static`).

**4. Контекст накладання (Stacking Context)**
Додавання `z-index` до позиційованого елемента створює новий *Stacking Context*.

* Це група елементів, що мають спільного батька і рухаються по осі Z як єдине ціле.
* *Правило:* Елементи всередині різних контекстів не можуть перекривати один одного незалежно від значення їхнього z-index (порівнюються "батьки", а не "діти").

> **🏢 Аналогія: Багатоповерховий будинок**
> Уявіть, що **Stacking Context** — це поверх будинку.
> * Ваш `z-index` — це висота меблів **всередині** квартири на цьому поверсі.
> * **Правило:** Навіть якщо ви поставите найвищу шафу (`z-index: 999`) на першому поверсі, вона ніколи не буде вищою за маленьку табуретку (`z-index: 1`), яка стоїть на другому поверсі.
> 
> 
> **Висновок:** Стеля батьківського контексту — це ваша межа. Ви не можете "пробити" поверх і перекрити елементи з вищого контексту.

---

### Етап 5: Composite (Склейка шарів)

**Єдиний етап, що виконується на GPU.**
Браузер бере намальовані шари (Bitmaps) і накладає їх один на одного.

🚀 **High-Performance Tip:**
Зміна властивостей `width`, `height`, `margin`, `left` викликає **Layout** (CPU, дорого).
Зміна `transform` та `opacity` викликає тільки **Composite** (GPU, дуже дешево).
*Хочете 60 FPS анімацію мурахи? Використовуйте `transform: translate(x, y)`, а не `top/left`.*

---

## 5. HTML Engineering: Синтаксис, Семантика та Структура

Ми розглядаємо HTML не просто як текст, а як інструкцію для парсера та базу для Accessibility Tree.

### 5.1. Анатомія, Коментарі та Порожні Елементи

**HTML Element** — це абстракція, що складається з трьох частин:
1. **Start Tag:** `<tagname>`
2. **Content:** Текст або вкладені елементи.
3. **End Tag:** `</tagname>`

**Коментарі (Comments):**
Як і в C++, код потребує пояснень або тимчасового відключення блоків. Коментарі не рендеряться в DOM.
```html

```

**Void Elements (Порожні елементи):**
Деякі теги технічно не можуть мати контенту, тому їм не потрібен закриваючий тег.

* `<img>` — зображення.
* `<input>` — поле вводу.
* `<br>` — розрив рядка.
* `<hr>` — тематичний розділювач.
* `<meta>` — метадані.

> **Що буде, якщо між тегами немає тексту?**
> Якщо це контейнер (наприклад, `<div></div>` або `<span></span>`) без контенту і без заданих розмірів у CSS — він **схлопнеться** в 0x0 пікселів і нічого не відобразиться на екрані.

### 5.2. HTML Entities (Escaping)

У C++ ми використовуємо `\` для екранування спецсимволів. У HTML для цього існують **Entities**.
Оскільки символи `<` та `>` зарезервовані для синтаксису тегів, ми не можемо просто написати `if (x < y)`.

**Основні сутності:**

* `<` (Less Than) → `&lt;` або `&#60;`
* `>` (Greater Than) → `&gt;` або `&#62;`
* `&` (Ampersand) → `&amp;` або `&#38;`
* `"` (Double Quote) → `&quot;`
* `'` (Single Quote) → `&apos;`

### 5.3. Collapsing White Space (Згортання пробілів)

Парсер обробляє **White Space** (пробіли, таби, `\n`) за специфічним алгоритмом:

1. **Sequences:** Послідовність пробілів/ентерів згортається в **ОДИН** пробіл.
2. **Trimming:** Пробіли на початку і в кінці елемента ігноруються.

```html
<p>
   Hello       World
</p>

```

### 5.4. Структурні Компоненти: Списки, Таблиці, Посилання

**Списки (Lists):**

* `<ul>` (Unordered): Маркований список.
* `<ol>` (Ordered): Нумерований список.
* `<dl>` (Definition): Словник "Термін (`<dt>`) — Визначення (`<dd>`)".

**Таблиці (Tables):**
Використовуються **тільки для табличних даних**, а не для верстки макету сторінки (як це робили у 90-х).

* `<table>` — контейнер.
* `<tr>` (Table Row) — рядок.
* `<th>` (Table Header) — заголовок стовпця (жирний шрифт, центрування).
* `<td>` (Table Data) — комірка даних.

**Гіперпосилання (Anchors):**
Тег `<a>` (Anchor) створює зв'язки між документами.

```html
<a href="[https://google.com](https://google.com)" target="_blank">Google</a>

<a href="/home"><img src="logo.png"></a>

```

### 5.5. Блокові vs Рядкові (Block vs Inline)

**Block Level (`<div>`, `<p>`, `<section>`)**

* **Поведінка:** Займає всю доступну ширину (width: 100%), починається з нового рядка.

**Inline Level (`<span>`, `<a>`, `<b>`)**

* **Поведінка:** Займає тільки ширину контенту, тече як текст.

### 5.6. Semantic HTML vs Non-Semantic (Div Soup)

**Non-Semantic (`<div>`, `<span>`):**
Історично розробники використовували `<div>` для всього, додаючи сенс через `id` або `class`. Це називається "Div Soup".

```html
<div id="header">...</div>
<div id="nav">...</div>
<div id="article">...</div>

```

`<div>` нічого не говорить браузеру про вміст. Це просто "мішок" для групування елементів та стилізації через CSS.

**Semantic HTML (HTML5):**
Використання тегів, які передають **зміст та призначення** контенту.

```html
<header>...</header>
<nav>...</nav>
<article>...</article>
<footer>...</footer>

```

**Чому це критично (Engineering Perspective):**

1. **SEO (Search Engine Optimization):** Google-бот розуміє, що текст у `<article>` важливіший за текст у `<footer>`.
2. **Accessibility (A11y):** Скрінрідери для незрячих використовують ці теги для навігації ("Перейти до меню", "Пропустити шапку").
3. **Visual vs Logical:**
* `<b>` (Bold) — просто жирний текст (Visual).
* `<strong>` — логічно важливий текст (Semantic). Скрінрідер змінить інтонацію.
* `<i>` (Italic) — просто курсив.
* `<em>` (Emphasis) — логічний акцент.



### 5.7. Anti-Pattern: Кнопка чи Div?

Ми часто бачимо такий код:

```html
<div onclick="login()" class="btn">Login</div>

```

**Чому це погано:**

1. **Keyboard Control:** Ви не натиснете цей `div` через `Enter` або `Space`. `Tab` пропустить його.
2. **Semantic Void:** Браузер бачить тут "текстовий контейнер", а не інтерактивний елемент.

**Правильний код:**

```html
<button type="button" onclick="login()">Login</button>

```

---

## 6. Форми та Передача Даних (Data Transport)

Хоча Hive Mind — це гра, будь-який веб-додаток має **авторизацію** та **налаштування**. Для цього існують форми.

### 6.1. Анатомія Форми

Форма — це контейнер, який збирає дані з `input`-ів і відправляє HTTP-запит.

```html
<form action="/api/login" method="POST">
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="user_email" required>

    <label for="pass">Password:</label>
    <input type="password" id="pass" name="user_pass" required minlength="8">

    <button type="submit">Увійти</button>
</form>

```

### 6.2. GET vs POST (В чому різниця?)

| Метод | Що відбувається | Де дані? | Приклад |
| --- | --- | --- | --- |
| **GET** | "Дай мені дані" | В URL (видно всім) | Пошук Google: `google.com/search?q=cats` |
| **POST** | "Візьми мої дані" | В тілі запиту (Body) | Логін, завантаження файлу |

### Давайте поміркуємо: Безпека паролів

Чому не можна відправляти пароль через метод **GET**?

<details markdown="1">
<summary>Відповідь з точки зору безпеки</summary>

1. **URL зберігається в історії браузера.** Хтось відкриє історію і побачить: `/login?pass=superSecret123`.
2. **URL логується на серверах.** Адмін проксі-сервера або провайдер побачить ваш пароль у логах трафіку.
3. **POST** ховає дані всередину HTTP-пакету (Body). При використанні HTTPS шифрується все (і URL, і Body), але Body не осідає в логах серверів та історії браузера, на відміну від URL.

</details>

---

## 7. Застосування в курсовому проєкті

Ми робимо гру на 10,000 агентів.

### Чому не DOM? (Performance Case)

Якби кожна мураха була `<div>`:

```javascript
// 10,000 разів на кадр (60 FPS)
antDiv.style.left = x + 'px'; 
antDiv.style.top = y + 'px';

```

Це викликало б **10,000 операцій Recalculate Style** і потенційний **Layout Thrashing**. Браузер просто не встигне це порахувати за 16 мс (бюджет часу на один кадр).

### Рішення: Canvas

Ми використовуємо тег `<canvas>`. Це "вікно" у бітовий масив.
Ми малюємо не об'єктами, а кольорами пікселів. Це розвантажує Main Thread від роботи з DOM-деревом.

---

## Контрольні питання

1. Який потік (Thread) відповідає за виконання вашого JS? Що станеться, якщо він зависне?
2. Ви змінили `width` елемента. Які етапи Rendering Path запустить браузер? (Style -> Layout -> Paint -> Composite).
3. Чому паролі передають через `POST`, а пошукові запити через `GET`?
4. Навіщо потрібен тег `<label>` і як він пов'язаний з `<input>`?

<details markdown="1">
<summary>🔑 Відповіді до контрольних питань</summary>

**1. Який потік (Thread) відповідає за виконання вашого JS? Що станеться, якщо він зависне?**

* **Відповідь:** За виконання JavaScript відповідає **Main Thread** (Головний потік).
* **Наслідки зависання:** Якщо Main Thread заблокований (наприклад, нескінченним циклом `while(true)`), браузер перестає реагувати на дії користувача (кліки, введення тексту), зупиняється Layout та Paint. Сторінка стає "мертвою", хоча скрол може продовжувати працювати (оскільки він часто обробляється окремим Compositor Thread).

**2. Ви змінили `width` елемента. Які етапи Rendering Path запустить браузер?**

* **Відповідь:** Браузер запустить повний цикл оновлення:

1. **Recalculate Style:** Застосування нового значення ширини.
2. **Layout (Reflow):** Перерахунок геометрії цього елемента та всіх, на які він впливає (сусіди, діти).
3. **Paint:** Перемальовування пікселів (бо змінився розмір області малювання).
4. **Composite:** Оновлення шарів.
*Це одна з найдорожчих операцій. Для порівняння: зміна `transform` або `opacity` пропускає етап Layout.*

**3. Чому паролі передають через `POST`, а пошукові запити через `GET`?**

* **GET:** Параметри передаються в **URL** (`site.com/search?q=cats`). Це зручно для пошуку, бо посиланням можна поділитися, і сторінка кешується. Але це фатально для паролів, бо URL зберігається в історії браузера та логах серверів/провайдерів.
* **POST:** Дані передаються в **тілі запиту (Body)**. Вони не видно в адресному рядку, не кешуються і при використанні HTTPS шифруються разом з тілом пакету, не залишаючи слідів у access-логах.

**4. Навіщо потрібен тег `<label>` і як він пов'язаний з `<input>`?**

* **Зв'язок:** Тег `<label>` зв'язується з `<input>` через атрибут `for="id_інпута"` (або вкладенням інпута всередину лейбла).
* **Навіщо:**

1. **UX (User Experience):** Дозволяє клікнути по тексту (наприклад, "Я погоджуюсь"), щоб активувати маленький чекбокс. Збільшує клікабельную область.
2. **A11y (Accessibility):** Скрінрідери зачитують цей текст, коли фокус потрапляє на поле вводу. Без лейбла незрячий користувач почує просто "Input text" і не зрозуміє, що туди вводити.

</details>

---

## Слайди: HTML Q&A (Лекція 5)

![Слайд 1](attachments/html_qa/slide-01.png)
![Слайд 2](attachments/html_qa/slide-02.png)
![Слайд 3](attachments/html_qa/slide-03.png)
![Слайд 4](attachments/html_qa/slide-04.png)
![Слайд 5](attachments/html_qa/slide-05.png)
![Слайд 6](attachments/html_qa/slide-06.png)
![Слайд 7](attachments/html_qa/slide-07.png)
![Слайд 8](attachments/html_qa/slide-08.png)
![Слайд 9](attachments/html_qa/slide-09.png)
![Слайд 10](attachments/html_qa/slide-10.png)
![Слайд 11](attachments/html_qa/slide-11.png)
![Слайд 12](attachments/html_qa/slide-12.png)
![Слайд 13](attachments/html_qa/slide-13.png)
![Слайд 14](attachments/html_qa/slide-14.png)
![Слайд 15](attachments/html_qa/slide-15.png)
![Слайд 16](attachments/html_qa/slide-16.png)
![Слайд 17](attachments/html_qa/slide-17.png)
![Слайд 18](attachments/html_qa/slide-18.png)
![Слайд 19](attachments/html_qa/slide-19.png)
![Слайд 20](attachments/html_qa/slide-20.png)
![Слайд 21](attachments/html_qa/slide-21.png)
![Слайд 22](attachments/html_qa/slide-22.png)
![Слайд 23](attachments/html_qa/slide-23.png)
![Слайд 24](attachments/html_qa/slide-24.png)
![Слайд 25](attachments/html_qa/slide-25.png)
![Слайд 26](attachments/html_qa/slide-26.png)
![Слайд 27](attachments/html_qa/slide-27.png)
![Слайд 28](attachments/html_qa/slide-28.png)
![Слайд 29](attachments/html_qa/slide-29.png)
![Слайд 30](attachments/html_qa/slide-30.png)
![Слайд 31](attachments/html_qa/slide-31.png)
![Слайд 32](attachments/html_qa/slide-32.png)
![Слайд 33](attachments/html_qa/slide-33.png)
![Слайд 34](attachments/html_qa/slide-34.png)
![Слайд 35](attachments/html_qa/slide-35.png)
![Слайд 36](attachments/html_qa/slide-36.png)
![Слайд 37](attachments/html_qa/slide-37.png)
![Слайд 38](attachments/html_qa/slide-38.png)
![Слайд 39](attachments/html_qa/slide-39.png)
![Слайд 40](attachments/html_qa/slide-40.png)
![Слайд 41](attachments/html_qa/slide-41.png)
![Слайд 42](attachments/html_qa/slide-42.png)
![Слайд 43](attachments/html_qa/slide-43.png)
![Слайд 44](attachments/html_qa/slide-44.png)
![Слайд 45](attachments/html_qa/slide-45.png)
![Слайд 46](attachments/html_qa/slide-46.png)
![Слайд 47](attachments/html_qa/slide-47.png)
![Слайд 48](attachments/html_qa/slide-48.png)
![Слайд 49](attachments/html_qa/slide-49.png)
![Слайд 50](attachments/html_qa/slide-50.png)
![Слайд 51](attachments/html_qa/slide-51.png)
![Слайд 52](attachments/html_qa/slide-52.png)
![Слайд 53](attachments/html_qa/slide-53.png)
![Слайд 54](attachments/html_qa/slide-54.png)
![Слайд 55](attachments/html_qa/slide-55.png)
![Слайд 56](attachments/html_qa/slide-56.png)
![Слайд 57](attachments/html_qa/slide-57.png)
![Слайд 58](attachments/html_qa/slide-58.png)
![Слайд 59](attachments/html_qa/slide-59.png)
![Слайд 60](attachments/html_qa/slide-60.png)
![Слайд 61](attachments/html_qa/slide-61.png)
![Слайд 62](attachments/html_qa/slide-62.png)
![Слайд 63](attachments/html_qa/slide-63.png)
![Слайд 64](attachments/html_qa/slide-64.png)
![Слайд 65](attachments/html_qa/slide-65.png)
![Слайд 66](attachments/html_qa/slide-66.png)
![Слайд 67](attachments/html_qa/slide-67.png)
![Слайд 68](attachments/html_qa/slide-68.png)
![Слайд 69](attachments/html_qa/slide-69.png)
![Слайд 70](attachments/html_qa/slide-70.png)
![Слайд 71](attachments/html_qa/slide-71.png)
![Слайд 72](attachments/html_qa/slide-72.png)
![Слайд 73](attachments/html_qa/slide-73.png)
![Слайд 74](attachments/html_qa/slide-74.png)
![Слайд 75](attachments/html_qa/slide-75.png)
![Слайд 76](attachments/html_qa/slide-76.png)
![Слайд 77](attachments/html_qa/slide-77.png)
![Слайд 78](attachments/html_qa/slide-78.png)
![Слайд 79](attachments/html_qa/slide-79.png)
![Слайд 80](attachments/html_qa/slide-80.png)
![Слайд 81](attachments/html_qa/slide-81.png)
![Слайд 82](attachments/html_qa/slide-82.png)

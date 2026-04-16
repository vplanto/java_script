# Workshop 2: Monte Carlo & Main Thread. Як "покласти" браузер (і як його врятувати)

У цьому воркшопі ми поєднаємо математику, графіку та розуміння того, як працює процесор. Ми пройдемо шлях від "зависання" сторінки до справжньої багатопотоковості.

## 1. Задача: Число $\pi$ методом Монте-Карло

**Метод Монте-Карло** — це клас обчислювальних алгоритмів, які використовують випадкові числа для вирішення складних математичних та інженерних задач.

Уявіть квадрат зі стороною $2r$, в який вписано коло радіусом $r$.
Якщо ми будемо "кидати" випадкові точки в квадрат, то відношення точок, що потрапили в коло, до загальної кількості точок дасть нам наближене значення $\pi$.

$$\pi \approx 4 \times \frac{\text{Точки в колі}}{\text{Всього точок}}$$

### 🔬 Історична довідка: Манхеттенський проєкт та MCMC

*   **Манхеттенський проєкт:** Метод отримав свою сучасну форму і назву в 1940-х роках у Лос-Аламосі під час розробки атомної бомби. Вченим (С. Улам, Дж. фон Нейман, Н. Метрополіс) було необхідно змоделювати поведінку нейтронів. Аналітичні обчислення були неможливі через величезну кількість змінних, тому вони використали статистичні ймовірності та симуляції за допомогою перших комп'ютерів (ENIAC). Кодову назву «Монте-Карло» запропонували на честь казино в Монако.
*   **Ланцюги Маркова (Markov Chains):** Звичайний метод навмання кидати точки (як ми зараз робитимемо для $\pi$) неефективний у складних багатовимірних системах. Щоб вирішити цю проблему, пізніше додали Ланцюги Маркова, створивши **Markov Chain Monte Carlo (MCMC)**. У MCMC кожна наступна випадкова генерація *залежить від поточної* (головна умова ланцюга Маркова), змушуючи алгоритм розумно "блукати" та концентрувати зусилля в найбільш вірогідних зонах простору. Це лежить в основі сучасного Machine Learning.

В цьому ж воркшопі ми сфокусуємось на базовій симуляції Монте-Карло.

---

## Частина 1: Синхронний підхід (The Freeze)

Створіть `index.html` та `script.js`.

### `index.html`
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Calculate PI</title>
  <style>
      body { font-family: system-ui; text-align: center; padding: 20px; }
      canvas { border: 1px solid #333; margin: 20px auto; display: block; }
      button { padding: 10px 20px; font-size: 1rem; cursor: pointer; }
      .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid #ccc; border-top-color: #007bff; border-radius: 50%; animation: spin 1s linear infinite; visibility: hidden; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .loading .spinner { visibility: visible; }
  </style>
</head>
<body>
  <h1>Monte Carlo Simulation</h1>
  <p>Спробуйте виділити цей текст під час обчислень.</p>
  
  <input type="number" id="pointsInput" value="10000000">
  <button id="startBtn">Start Calculation</button>
  <div id="status" class="">Calculating... <div class="spinner"></div></div>
  
  <div id="result">Result: -</div>
  <canvas id="canvas" width="300" height="300"></canvas>

  <script src="script.js"></script>
</body>
</html>
```

### `script.js` (Bad Practice)

```javascript
const startBtn = document.getElementById("startBtn");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function calculatePiSync(iterations) {
    let inside = 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо полотно
    const drawRate = Math.max(1, Math.floor(iterations / 20000)); // Малюємо частину точок для оптимізації рендеру

    // Цей цикл блокує Main Thread
    for (let i = 0; i < iterations; i++) {
        // Генеруємо координати від -1 до 1, щоб коло було по центру
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const isInside = (x * x + y * y <= 1);
        
        if (isInside) inside++;
        
        if (i % drawRate === 0) {
            ctx.fillStyle = isInside ? "#3b82f6" : "#ef4444"; // Синє в колі, червоне поза ним
            // Переводимо координати [-1, 1] у координати канвасу [0, width]
            const canvasX = (x + 1) / 2 * canvas.width;
            const canvasY = (y + 1) / 2 * canvas.height;
            ctx.fillRect(canvasX, canvasY, 1, 1);
        }
    }
    return (inside / iterations) * 4;
}

startBtn.addEventListener("click", () => {
    const iterations = Number(document.getElementById("pointsInput").value);
    
    statusDiv.style.visibility = 'visible'; // Спробуємо показати спінер
    
    // HACK: setTimeout, щоб дати браузеру шанс перемалювати UI перед зависанням
    setTimeout(() => {
        const start = performance.now();
        
        const pi = calculatePiSync(iterations); // <--- ТУТ БРАУЗЕР ПОМРЕ
        
        const time = performance.now() - start;
        resultDiv.innerText = `Pi ≈ ${pi.toFixed(6)} (Time: ${time.toFixed(0)}ms)`;
        statusDiv.style.visibility = 'hidden';
    }, 10);
});
```

### 🧪 Експеримент 1:

1.  Введіть `10000000` (10 млн). Натисніть Start.
2.  Спробуйте виділити текст на сторінці або натиснути кнопку ще раз.
3.  **Результат:** Інтерфейс мертвий. Спінер завмер.

**Діагноз:** JavaScript однопотоковий. Поки процесор зайнятий циклом `for`, він не може обробляти події миші чи перемальовувати анімацію спінера.

-----

## Частина 2: Web Workers (Порятунок)

Ми винесемо важкі обчислення в окремий потік (Thread). У браузері це називається **Web Worker**.
Він не має доступу до DOM (не може малювати), але може рахувати і спілкуватися з головним потоком через повідомлення.

[Image of Web Worker architecture diagram]

### ⚙️ Детальний механізм роботи: крок за кроком

1. **Ініціалізація (`new Worker`)**: Головний потік (Main Thread) наказує браузеру створити окремий, ізольований потік виконання на рівні ОС, передаючи йому файл `worker.js`. 
2. **Передача даних (`postMessage` \-\> V8 \-\> Worker)**: Головний потік пакує потрібні дані (у нашому випадку кількість ітерацій) і відправляє їх у воркер. Важливо: об'єкти не передаються по посиланню, браузер їх *копіює* (Structured Clone Algorithm), щоб два потоки не могли випадково змінити одні й ті самі дані одночасно.
3. **Фонове виконання**: Воркер має свій власний Event Loop. Він "ловить" повідомлення (через функцію `self.onmessage`) і починає важкі математичні обчислення (цикл `for`). Оскільки він використовує інше ядро процесора, користувацький інтерфейс сторінки на 100% вільний (можна скролити, виділяти текст, бачити CSS-анімації).
4. **Повернення результату**: Коли математика завершена, воркер відправляє фінальні розрахунки назад тим самим механізмом `postMessage`. Його місія виконана (але він чекає на нові задачі, поки ми його не вб'ємо через `worker.terminate()`).
5. **Обробка в UI (`worker.onmessage`)**: Головний потік отримує повідомлення-відповідь. От саме тепер, маючи готове значення $\pi$, головний потік повертається до своєї звичної роботи — безпечно оновлює елементи DOM (вставляє текст, прибирає спінер), оскільки тільки він має на це ексклюзивне право.

### 1\. Створіть файл `worker.js`

Це код, який буде виконуватися паралельно.

```javascript
// worker.js
self.onmessage = function(e) {
    const iterations = e.data;
    console.log(`Worker started: ${iterations} iterations`);
    
    // Фіксуємо точний час старту (використовуємо мікросекундний таймер performance замість Date)
    const start = performance.now();
    let inside = 0;

    for (let i = 0; i < iterations; i++) {
        const x = Math.random();
        const y = Math.random();
        if (x * x + y * y <= 1) inside++;
    }

    const pi = (inside / iterations) * 4;
    const time = performance.now() - start;

    // Відправляємо результат назад головному потоку
    self.postMessage({ pi, time });
};
```

### 2\. Оновіть `script.js`

Тепер ми не рахуємо самі, ми "наймаємо підрядника".

```javascript
const startBtn = document.getElementById("startBtn");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");

// Створюємо воркера
const worker = new Worker("worker.js");

// Призначаємо анонімну функцію-обробник, яка буде прослуховувати відповіді від воркера
// Вона автоматично викличеться та обробить дані (через об'єкт події 'e'), щойно вони надійдуть
worker.onmessage = function(e) {
    const { pi, time } = e.data;
    resultDiv.innerText = `Pi ≈ ${pi.toFixed(6)} (Time: ${time.toFixed(0)}ms)`;
    statusDiv.classList.remove("loading"); // Ховаємо спінер
    startBtn.disabled = false; // Розблокуємо кнопку
};

startBtn.addEventListener("click", () => {
    const iterations = Number(document.getElementById("pointsInput").value);
    
    statusDiv.classList.add("loading"); // Показуємо спінер
    startBtn.disabled = true;
    
    // Відправляємо задачу воркеру через механізм браузерних подій
    // Важливо: це не прямий виклик функції! Ми просто створюємо подію,
    // яку браузер асинхронно передасть в інший системний потік (Worker)
    worker.postMessage(iterations);
    
    console.log("Message sent to worker. UI remains responsive!");
});
```

### 🧪 Експеримент 2:

1.  Запустіть код (через Live Server, бо Workers не працюють просто через відкриття файлу `file://`).
2.  Введіть `50000000` (50 млн). Натисніть Start.
3.  Спінер крутиться\! Текст виділяється\! Кнопка реагує на наведення\!

> [!WARNING]
> **Усунення помилки CORS (Security Error)**
> Якщо ви просто відкрили HTML-файл у браузері (адреса починається з `file:///`), браузер заблокує `worker.js` з міркувань безпеки. Щоб це виправити, запустіть код через локальний веб-сервер:
> *   **У VS Code:** Встановіть розширення *Live Server*, натисніть правою кнопкою по `index.html` $\rightarrow$ *Open with Live Server*.
> *   **Через Python:** Відкрийте термінал у папці з файлами та виконайте: `python3 -m http.server 8000` (потім відкрийте http://localhost:8000)
> *   **Через Node.js:** Виконайте у терміналі `npx serve .`

**Висновок:** Головний потік (UI) вільний. Важка робота йде у фоні.

> [!NOTE]
> **Чому зараз нічого не малюється на Canvas?**
> Ви могли помітити, що на відміну від першого прикладу (Синхронного підходу), тут `canvas` залишається пустим. Це очікувано! Web Workers працюють в ізольованому середовищі і **не мають доступу до DOM-дерева** (вони не можуть керувати HTML-елементами). Щоб відмалювати розрахунки воркера, нам доведеться порціями передавати координати назад у головний потік через `postMessage` — саме це вам потрібно буде реалізувати в наступному практичному завданні (Challenge 3).

### 📚 Корисна документація (MDN)

*   [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) — загальний посібник з використання.
*   [self.onmessage (message_event)](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/message_event) — як воркер "слухає" вхідні дані. `self` у контексті воркера вказує на його власний глобальний простір (DedicatedWorkerGlobalScope).
*   [postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) — метод обміну даними (відправка повідомлень).
*   [performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) — мілісекундний таймер високої роздільної здатності для замірів швидкості.

-----

## 3\. Challenge: Візуалізація

Воркер не може малювати на Canvas. Але він може надсилати дані частинами.

**Завдання:**

1.  Змініть `worker.js`, щоб він не рахував все одразу, а рахував пачками по 1000 точок.
2.  Після кожної пачки відправляйте координати точок (`postMessage`) у головний потік.
3.  У `script.js` приймайте ці точки і малюйте їх на Canvas.

*Результат: Ви побачите, як заповнюється коло в реальному часі, не блокуючи інтерфейс.*

### Референсне рішення (Challenge 3)

<details markdown="1">
<summary>Чому код тепер завжди на сторінці, а не лише всередині згорнутого блоку</summary>

Деякі переглядачі та експорт PDF не показують вміст `<details>` — тому повний приклад винесено сюди. Нижче — ті самі файли `worker.js` і `script.js`.

</details>

**`worker.js` (візуалізація пачками)**

```javascript
self.onmessage = function(e) {
    const iterations = e.data;
    const batchSize = 1000; // 🟢 ДОДАНО: ліміт пачки точок
    let inside = 0;
    const start = performance.now();

    let pointsBatch = []; // 🟢 ДОДАНО: масив для накопичення точок

    for (let i = 0; i < iterations; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const isInside = (x * x + y * y <= 1);
        
        if (isInside) inside++;
        
        // 🟢 ДОДАНО: зберігаємо кожну розраховану точку
        pointsBatch.push({ x, y, isInside });

        // 🟢 ДОДАНО: відправляємо готовий батч і очищаємо масив
        if (pointsBatch.length >= batchSize) {
            self.postMessage({ type: 'progress', points: pointsBatch });
            pointsBatch = [];
        }
    }
    
    // 🟢 ДОДАНО: Відправляємо залишок (якщо ітерації не кратні batchSize)
    if (pointsBatch.length > 0) {
        self.postMessage({ type: 'progress', points: pointsBatch });
    }

    const pi = (inside / iterations) * 4;
    const time = performance.now() - start;
    self.postMessage({ type: 'done', pi, time }); // 🟢 ЗМІНЕНО: відправка з типом повідомлення
};
```

**`script.js` (візуалізація пачками)**

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");

const worker = new Worker("worker.js");

worker.onmessage = function(e) {
    const data = e.data;
    
    // 🟢 ДОДАНО: логіка обробки різних типів повідомлень
    if (data.type === 'progress') {
        // 🟢 ДОДАНО: Відмальовуємо отриману пачку точок
        data.points.forEach(p => {
            ctx.fillStyle = p.isInside ? "#3b82f6" : "#ef4444";
            const canvasX = (p.x + 1) / 2 * canvas.width;
            const canvasY = (p.y + 1) / 2 * canvas.height;
            ctx.fillRect(canvasX, canvasY, 1, 1);
        });
    } else if (data.type === 'done') {
        // Завершення роботи
        const { pi, time } = data;
        resultDiv.innerText = `Pi ≈ ${pi.toFixed(6)} (Time: ${time.toFixed(0)}ms)`;
        statusDiv.classList.remove("loading");
        startBtn.disabled = false;
    }
};

startBtn.addEventListener("click", () => {
    const iterations = Number(document.getElementById("pointsInput").value);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо канвас
    statusDiv.classList.add("loading");
    startBtn.disabled = true;
    
    worker.postMessage(iterations);
});
```

---

## Контрольні питання

1. Чому спінер завмирає під час синхронного обчислення `calculatePiSync`, хоча CSS-анімація — це робота браузера?

<details markdown="1">
<summary>Відповідь</summary>

JavaScript однопоточний. Поки Main Thread виконує цикл `for`, **жоден** наступний крок Event Loop не запускається — ні обробка подій, ні перемальовування. Браузер просто не отримує «вікна» для рендеру, тому анімація замерзає.

</details>

2. Web Worker не має доступу до DOM. Навіщо тоді він корисний?

<details markdown="1">
<summary>Відповідь</summary>

Важкі обчислення (математика, парсинг, крипто) не потребують DOM — вони просто займають процесор. Виконуючи їх у Worker, ми звільняємо Main Thread для рендеру та обробки подій. Worker повертає результат через `postMessage`, головний потік отримує його і оновлює UI.

</details>

3. Чому `performance.now()` є кращим для вимірювання продуктивності, ніж `Date.now()`?

<details markdown="1">
<summary>Відповідь</summary>

`performance.now()` повертає мілісекунди з мікросекундною точністю відносно старту сторінки — точне для коротких операцій. `Date.now()` — мілісекунди Unix epoch, з точністю 1–15мс (в залежності від ОС), і може стрибати при зміні системного часу.

</details>

4. Чому Web Workers не можна запустити, відкривши `index.html` як `file://`?

<details markdown="1">
<summary>Відповідь</summary>

Браузери мають CORS-обмеження для `file://`. Worker завантажується як окремий скрипт, і браузер вважає це cross-origin запитом, який блокується. Рішення: використовувати локальний HTTP-сервер (Live Server, `python -m http.server` тощо).

</details>
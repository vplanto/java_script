# Workshop 2: Monte Carlo & Main Thread. Як "покласти" браузер (і як його врятувати)

У цьому воркшопі ми поєднаємо математику, графіку та розуміння того, як працює процесор. Ми пройдемо шлях від "зависання" сторінки до справжньої багатопотоковості.

## 1. Задача: Число $\pi$ методом Монте-Карло
Уявіть квадрат зі стороною $2r$, в який вписано коло радіусом $r$.
Якщо ми будемо "кидати" випадкові точки в квадрат, то відношення точок, що потрапили в коло, до загальної кількості точок дасть нам наближене значення $\pi$.

$$\pi \approx 4 \times \frac{\text{Точки в колі}}{\text{Всього точок}}$$

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

function calculatePiSync(iterations) {
    let inside = 0;
    // Цей цикл блокує Main Thread
    for (let i = 0; i < iterations; i++) {
        const x = Math.random();
        const y = Math.random();
        if (x * x + y * y <= 1) inside++;
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

### 1\. Створіть файл `worker.js`

Це код, який буде виконуватися паралельно.

```javascript
// worker.js
self.onmessage = function(e) {
    const iterations = e.data;
    console.log(`Worker started: ${iterations} iterations`);
    
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

// Слухаємо відповідь від воркера
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
    
    // Відправляємо задачу воркеру
    worker.postMessage(iterations);
    
    console.log("Message sent to worker. UI remains responsive!");
});
```

### 🧪 Експеримент 2:

1.  Запустіть код (через Live Server, бо Workers не працюють просто через відкриття файлу `file://`).
2.  Введіть `50000000` (50 млн). Натисніть Start.
3.  Спінер крутиться\! Текст виділяється\! Кнопка реагує на наведення\!

**Висновок:** Головний потік (UI) вільний. Важка робота йде у фоні.

-----

## 3\. Challenge: Візуалізація

Воркер не може малювати на Canvas. Але він може надсилати дані частинами.

**Завдання:**

1.  Змініть `worker.js`, щоб він не рахував все одразу, а рахував пачками по 1000 точок.
2.  Після кожної пачки відправляйте координати точок (`postMessage`) у головний потік.
3.  У `script.js` приймайте ці точки і малюйте їх на Canvas.

*Результат: Ви побачите, як заповнюється коло в реальному часі, не блокуючи інтерфейс.*
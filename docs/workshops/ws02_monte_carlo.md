# Workshop: Обчислення Pi методом Монте-Карло (та як не "повісити" браузер)

У цьому воркшопі ми поєднаємо математику, графіку (Canvas API) та розуміння того, як працює процесор.

## 1. Задача
Ми хочемо обчислити число $\pi$ (Pi), використовуючи випадкові числа.
Уявіть квадрат зі стороною $2r$, в який вписано коло радіусом $r$.
* Площа квадрата: $S_{sq} = (2r)^2 = 4r^2$
* Площа кола: $S_{circ} = \pi r^2$
* Відношення площ: $\frac{S_{circ}}{S_{sq}} = \frac{\pi r^2}{4r^2} = \frac{\pi}{4}$

Отже, $\pi = 4 \times \frac{S_{circ}}{S_{sq}}$.

Якщо ми будемо "кидати" випадкові точки в квадрат, то відношення точок, що потрапили в коло, до загальної кількості точок дасть нам наближене значення $\pi$.

## 2. Реалізація v1.0 (Синхронна)

Створіть файл `index.html` та `script.js` з наступним кодом.

### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Calculate PI</title>
  <style>
      body { display: flex; flex-direction: column; align-items: center; font-family: sans-serif; }
      canvas { border: 1px solid #333; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Monte Carlo Pi Simulation</h1>
  <canvas id="canvas" width="400" height="400"></canvas>
  <div id="result">Calculating...</div>
  <script src="script.js"></script>
</body>
</html>
````

### JavaScript (`script.js`)

```javascript
const radius = 200; // Збільшили для кращої візуалізації
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Малюємо рамку
ctx.beginPath();
ctx.rect(0, 0, 2 * radius, 2 * radius);
ctx.stroke();

function calcPI(totalPoints) {
  let circlePoints = 0;

  for (let i = 0; i < totalPoints; i++) {
    // 1. Генеруємо випадкову точку
    let x = Math.random() * (radius * 2);
    let y = Math.random() * (radius * 2);

    // 2. Рахуємо відстань до центру (теорема Піфагора)
    let d = Math.sqrt((x - radius) ** 2 + (y - radius) ** 2);

    // 3. Малюємо точку
    if (d <= radius) {
      circlePoints++;
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(x, y, 1, 1); // Малюємо піксель
  }

  return (4 * circlePoints) / totalPoints;
}

// ЗАПУСК
const POINTS = 5000;
const pi = calcPI(POINTS);

// Вивід результату
ctx.font = '30px Arial';
ctx.fillStyle = 'black';
ctx.fillText("π ≈ " + pi.toFixed(4), 20, 50);
document.getElementById("result").innerText = `Points: ${POINTS}, Pi: ${pi}`;
```

## 3\. Проблема продуктивності (The Freeze)

Спробуйте змінити константу `POINTS` з `5000` на `10,000,000`.

**Що сталося?**
Браузер "завис" на кілька секунд. Ви не можете виділити текст, натиснути кнопки.

**Чому?**
JavaScript працює в **одному потоці (Main Thread)**. Цей потік відповідає і за виконання вашого циклу `for`, і за малювання інтерфейсу (UI Rendering). Поки цикл не закінчиться, браузер не може оновити екран.

## 4\. Завдання (Challenge)

Ваше завдання — переписати цей код так, щоб ми могли обробити 10 мільйонів точок, але інтерфейс **не зависав**, і ми бачили процес малювання в реальному часі (анімацію).

**Підказка:** Використовуйте `requestAnimationFrame` або розбийте цикл на менші шматки (Batching).
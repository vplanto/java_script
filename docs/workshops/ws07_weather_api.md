# Воркшоп 7: Робота з реальними API (Weather Dashboard)

Ми виходимо за межі "пісочниці". Ваш браузер починає спілкуватися з серверами на іншому кінці світу.
Ми створимо погодний дашборд, використовуючи **OpenWeatherMap API**.

У прикладі нижче вже є **`try/catch`**, перевірка `response.ok` і повідомлення про помилки (у т.ч. неіснуюче місто → 404). Додаткові вправи з `Promise.all` для кількох міст — у [TODO курсу](todo.md) як розширення.

## 1. Підготовка (Setup)

1.  Зареєструйтеся на [OpenWeatherMap](https://openweathermap.org/api) (це безкоштовно).
2.  Отримайте свій **API Key**.
    > **Увага:** Активація ключа може зайняти від 10 хвилин до 2 годин. Якщо не працює одразу — це нормально.

## 2. Реалізація (The Code)

Створіть у одній папці два файли: **weather.html** і **weather.js** (підключення вже є в розмітці нижче).

### HTML — файл `weather.html`

Мінімальний дашборд: поле міста, кнопка, область для результату й базові стилі картки.

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Dashboard</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
      margin: 0;
      background: #f4f6f8;
    }
    .card {
      width: min(360px, 100%);
      border: 1px solid #ddd;
      padding: 1.5rem;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    h2 { margin-top: 0; }
    label { display: block; font-size: 0.85rem; margin-bottom: 0.35rem; color: #444; }
    input, button {
      padding: 10px;
      width: 100%;
      margin-bottom: 10px;
      box-sizing: border-box;
      border-radius: 8px;
      border: 1px solid #ccc;
    }
    button {
      background: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover { background: #0056b3; }
    button:disabled { opacity: 0.6; cursor: wait; }
    .error { color: #c00; font-size: 0.9rem; }
    #weatherDisplay { margin-top: 0.5rem; min-height: 4rem; }
    .weather-head { display: flex; align-items: center; gap: 0.75rem; }
    .weather-head img { width: 64px; height: 64px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Погода</h2>
    <label for="cityInput">Місто</label>
    <input type="text" id="cityInput" placeholder="Наприклад: Odesa" autocomplete="off">
    <button type="button" id="getWeatherBtn">Отримати погоду</button>
    <div id="weatherDisplay" aria-live="polite"></div>
  </div>
  <script src="weather.js"></script>
</body>
</html>
```

### JavaScript — файл `weather.js`

Логіка: `fetch` до OpenWeatherMap 2.5, перевірка `response.ok`, парсинг JSON, вивід полів відповіді (температура, вологість, опис, вітер, іконка).

```javascript
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const cityInput = document.getElementById("cityInput");

// Навчальний приклад: ключ у коді (чому це погано — у розділі 4)
const API_KEY = "ВАШ_КЛЮЧ_ТУТ";

function setLoading(isLoading) {
  getWeatherBtn.disabled = isLoading;
  if (isLoading) {
    weatherDisplay.innerHTML = "<p>Завантаження…</p>";
  }
}

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeatherBtn.click();
  }
});

async function getWeather(city) {
  const params = new URLSearchParams({
    q: city,
    appid: API_KEY,
    units: "metric",
    lang: "uk",
  });
  const url = `https://api.openweathermap.org/data/2.5/weather?${params}`;

  setLoading(true);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const hint = response.status === 404 ? " Місто не знайдено." : "";
      throw new Error(`HTTP ${response.status}${hint}`);
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Fetch error:", error);
    weatherDisplay.innerHTML = `<p class="error">Помилка: ${error.message}</p>`;
  } finally {
    setLoading(false);
  }
}

function displayWeather(data) {
  const { name, main, weather, sys, wind } = data;
  const w = weather[0];
  const iconUrl = w?.icon
    ? `https://openweathermap.org/img/wn/${w.icon}@2x.png`
    : "";

  weatherDisplay.innerHTML = `
    <div class="weather-head">
      ${iconUrl ? `<img src="${iconUrl}" alt="" width="64" height="64">` : ""}
      <h3 style="margin:0;">${name}, ${sys.country}</h3>
    </div>
    <p>🌡️ Температура: <b>${main.temp}°C</b> (відчувається як ${main.feels_like}°C)</p>
    <p>💧 Вологість: <b>${main.humidity}%</b></p>
    <p>💨 Вітер: <b>${wind?.speed ?? "—"} м/с</b></p>
    <p>☁️ Умови: <b>${w.description}</b></p>
  `;
}
```

## 3\. Інженерний аналіз (DevTools)

Запустіть код. Введіть "London". Натисніть кнопку.
Тепер найцікавіше. Відкрийте **DevTools (F12) -\> Network**.

1.  Знайдіть запит `weather?q=London...`.
2.  **Headers:** Подивіться, куди пішов запит (`Request URL`) і який метод (`GET`).
3.  **Preview:** Подивіться на "сирий" JSON, який повернув сервер. Порівняйте його з тим, що ви вивели на екран.
4.  **Timing:** Скільки часу зайняв запит? (Наприклад, 50ms). Це час, який ваш користувач чекав.

### Експеримент "Злам системи"

Введіть неіснуюче місто, наприклад "Narnia".

1.  Подивіться в Network Tab.
2.  Який статус коду? (Має бути `404`).
3.  Чи спрацював наш блок `catch`?

## 4\. Критична вразливість (Security Warning)

Подивіться на рядок:
`const API_KEY = "..."`

**Питання на мільйон:**
Якщо ви викладете цей код на GitHub Pages, чи зможу я вкрасти ваш ключ?

1.  Відкрийте ваш сайт.
2.  Натисніть `Ctrl+U` (View Source).
3.  Ось він, ваш ключ.

**Висновок інженера:**
Ніколи не зберігайте секретні ключі у фронтенд-коді в реальних проєктах. Будь-який користувач може їх побачити.
У реальному світі ви б створили свій маленький сервер (Proxy), який би зберігав ключ, а фронтенд звертався б до вашого сервера, а не до OpenWeatherMap напряму.

---

## Контрольні питання

1. Навіщо перевіряти `response.ok` після `await fetch(...)`? Хіба `fetch` не кидає помилку при HTTP 404?

<details markdown="1">
<summary>Відповідь</summary>

`fetch` не кидає помилку при HTTP-помилках (4xx, 5xx) — він вважає їх «успішними з мережевої точки зору». `Promise` відхиляється тільки при мережевих помилках (немає з'єднання, таймаут). Тому `response.ok` (або `response.status`) треба перевіряти явно.

</details>

2. Поясніть різницю між `await fetch()` і `await response.json()`. Навіщо два `await`?

<details markdown="1">
<summary>Відповідь</summary>

Перший `await` чекає HTTP-відповідь (заголовки) — тіло ще не завантажене. Другий `await response.json()` стримить і парсить тіло. Це два окремих асинхронних кроки: (1) TCP-з'єднання і заголовки, (2) потокове завантаження і десеріалізація JSON.

</details>

3. Чому API-ключ, захардкоджений у JS-файлі, небезпечний навіть якщо сайт на HTTPS?

<details markdown="1">
<summary>Відповідь</summary>

HTTPS шифрує трафік між клієнтом і сервером. Але JS-файл — це публічний ресурс: браузер його завантажує і виконує. `Ctrl+U` або DevTools → Sources дозволяють побачити всі JS-файли в plaintext. Ключ у коді = ключ у публічному домені.

</details>

4. Ваш `fetch` упав, і в `catch` є `error.message`. Як розрізнити «сервер повернув 404» від «немає інтернету»?

<details markdown="1">
<summary>Відповідь</summary>

При відсутності мережі `fetch` відхиляється з `TypeError: Failed to fetch`. При 404 — `fetch` успішний, але `response.ok === false` і `response.status === 404`. Тому check треба до блоку `catch`: спочатку `if (!response.ok) throw new Error(...)`, і тоді в `catch` обидві ситуації зрозумілі з повідомлення.

</details>
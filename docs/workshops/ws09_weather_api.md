# Воркшоп 7: Робота з реальними API (Weather Dashboard)

Ми виходимо за межі "пісочниці". Ваш браузер починає спілкуватися з серверами на іншому кінці світу.
Ми створимо погодний дашборд, використовуючи **OpenWeatherMap API**.

## 1. Підготовка (Setup)

1.  Зареєструйтеся на [OpenWeatherMap](https://openweathermap.org/api) (це безкоштовно).
2.  Отримайте свій **API Key**.
    > **Увага:** Активація ключа може зайняти від 10 хвилин до 2 годин. Якщо не працює одразу — це нормально.

## 2. Реалізація (The Code)

Створіть `weather.html` та `weather.js`.

### HTML (`weather.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Dashboard</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; padding-top: 50px; }
        .card { border: 1px solid #ddd; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 300px; }
        input, button { padding: 10px; width: 100%; margin-bottom: 10px; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
        .error { color: red; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Weather 🌤️</h2>
        <input type="text" id="cityInput" placeholder="Enter city (e.g. Odesa)">
        <button id="getWeatherBtn">Get Weather</button>
        <div id="weatherDisplay"></div>
    </div>
    <script src="weather.js"></script>
</body>
</html>
```

### JavaScript (`weather.js`)

```javascript
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const cityInput = document.getElementById("cityInput");

// Ваш ключ (Тимчасово хардкодимо, про ризики нижче)
const API_KEY = "ВАШ_КЛЮЧ_ТУТ"; 

getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

async function getWeather(city) {
    // Формуємо URL запиту
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        // 1. Відправляємо запит (Network Request)
        const response = await fetch(url);

        // 2. Перевіряємо статус HTTP (404, 500 тощо)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // 3. Парсимо JSON (тіло відповіді)
        const data = await response.json();
        
        // 4. Відображаємо
        displayWeather(data);
        
    } catch (error) {
        console.error("Fetch error:", error);
        weatherDisplay.innerHTML = `<p class="error">Помилка: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather, sys } = data;
    weatherDisplay.innerHTML = `
        <h3>${name}, ${sys.country}</h3>
        <p>🌡️ Температура: <b>${main.temp}°C</b></p>
        <p>💧 Вологість: <b>${main.humidity}%</b></p>
        <p>☁️ Стан: <b>${weather[0].description}</b></p>
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

<details>
<summary>Відповідь</summary>

`fetch` не кидає помилку при HTTP-помилках (4xx, 5xx) — він вважає їх «успішними з мережевої точки зору». `Promise` відхиляється тільки при мережевих помилках (немає з'єднання, таймаут). Тому `response.ok` (або `response.status`) треба перевіряти явно.

</details>

2. Поясніть різницю між `await fetch()` і `await response.json()`. Навіщо два `await`?

<details>
<summary>Відповідь</summary>

Перший `await` чекає HTTP-відповідь (заголовки) — тіло ще не завантажене. Другий `await response.json()` стримить і парсить тіло. Це два окремих асинхронних кроки: (1) TCP-з'єднання і заголовки, (2) потокове завантаження і десеріалізація JSON.

</details>

3. Чому API-ключ, захардкоджений у JS-файлі, небезпечний навіть якщо сайт на HTTPS?

<details>
<summary>Відповідь</summary>

HTTPS шифрує трафік між клієнтом і сервером. Але JS-файл — це публічний ресурс: браузер його завантажує і виконує. `Ctrl+U` або DevTools → Sources дозволяють побачити всі JS-файли в plaintext. Ключ у коді = ключ у публічному домені.

</details>

4. Ваш `fetch` упав, і в `catch` є `error.message`. Як розрізнити «сервер повернув 404» від «немає інтернету»?

<details>
<summary>Відповідь</summary>

При відсутності мережі `fetch` відхиляється з `TypeError: Failed to fetch`. При 404 — `fetch` успішний, але `response.ok === false` і `response.status === 404`. Тому check треба до блоку `catch`: спочатку `if (!response.ok) throw new Error(...)`, і тоді в `catch` обидві ситуації зрозумілі з повідомлення.

</details>
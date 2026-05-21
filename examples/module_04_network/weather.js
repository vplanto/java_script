const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const cityInput = document.getElementById("cityInput");

// Навчальний приклад: ключ у коді (чому це погано — у розділі 4)
const API_KEY = "7b930bfec9e8c4b0749cbd695ca56aa6";

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

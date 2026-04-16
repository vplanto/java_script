# Лекція 7: HTTP/S та REST. Анатомія запиту

## Експрес-опитування

1.  Який статус код ви отримаєте, якщо спробуєте зайти на неіснуючу сторінку?
2.  Чим `http://` відрізняється від `https://`?
3.  Який метод HTTP використовується, коли ви заповнюєте форму реєстрації?

<details markdown="1">
<summary>Відповіді</summary>

1.  **404 Not Found.**
2.  **Шифруванням (S = Secure).** У HTTPS трафік шифрується TLS/SSL. Ваш провайдер бачить, що ви зайшли на `google.com`, але не бачить, *що саме* ви шукаєте .
3.  **POST.** Бо ви *відправляєте* дані на сервер для створення ресурсу .

</details>

---

## 1. HTTP Request (Запит)

Кожен клік по посиланню — це текстовий документ, який летить на сервер .

**Структура:**
1.  **Line:** `GET /index.html HTTP/1.1` (Метод, Шлях, Версія).
2.  **Headers:** Метадані.
    * `Host: google.com`
    * `User-Agent: Chrome...` (хто я?)
    * `Accept: text/html` (що я хочу отримати?)
3.  **Body:** (Тільки для POST/PUT) Самі дані (JSON, Form Data).

## 2. HTTP Response (Відповідь)

Сервер відповідає теж текстом .

**Структура:**
1.  **Status Line:** `HTTP/1.1 200 OK`.
2.  **Headers:**
    * `Content-Type: application/json` (що я тобі прислав?)
    * `Set-Cookie: session_id=123` (запам'ятай мене).
3.  **Body:** HTML-код, JSON або картинка.

---

## 3. Status Codes: Мова сервера

Інженер має знати їх напам'ять :

* **2xx (Success):** Все добре. (`200 OK`, `201 Created`).
* **3xx (Redirect):** Шукай в іншому місці. (`301 Moved Permanently`).
* **4xx (Client Error):** Ти помилився.
    * `400 Bad Request` (криві дані).
    * `401 Unauthorized` (хто ти?).
    * `403 Forbidden` (я знаю хто ти, але тобі сюди не можна).
    * `404 Not Found` (немає такого).
* **5xx (Server Error):** Я (сервер) помилився. (`500 Internal Server Error`, `502 Bad Gateway`).

---

## 4. REST API (Архітектурний стиль)

**REST (Representational State Transfer)** — це набір правил, як будувати API .

**Головний принцип:** Ресурс + Дієслово.

| Метод | SQL Аналог | Дія | Приклад |
| :--- | :--- | :--- | :--- |
| **GET** | SELECT | Отримати дані | `GET /users/1` |
| **POST** | INSERT | Створити новий | `POST /users` (body: `{name: "Max"}`) |
| **PUT** | UPDATE | Оновити повністю | `PUT /users/1` |
| **PATCH**| UPDATE | Оновити частково| `PATCH /users/1` (body: `{name: "New"}`) |
| **DELETE**| DELETE | Видалити | `DELETE /users/1` |

---

## Практикум: "Postman у браузері"

Ви вже вмієте користуватися `fetch()`. Це і є ваш інструмент для HTTP запитів.

1.  Відкрийте консоль браузера.
2.  Зробіть **GET** запит:

```javascript
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((res) => res.json())
  .then(console.log);
```

3.  Зробіть **POST** запит (створіть пост):

```javascript
fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  body: JSON.stringify({ title: "foo", body: "bar", userId: 1 }),
  headers: { "Content-type": "application/json; charset=UTF-8" },
})
  .then((res) => res.json())
  .then(console.log);
```

---

## 4a. Асинхронність і `fetch`: від колбеків до `async/await`

У курсі ви вже бачите **сучасний** стиль — `await fetch(...)`. Для контексту (і читання чужого коду) коротко три епохи одного й того самого запиту:

```javascript
// 1) Колбеки (XHR / старий стиль) — вкладеність "pyramid of doom"
// const xhr = new XMLHttpRequest(); xhr.open("GET", url); ...

// 2) Promise — ланцюжок .then(), fetch уже повертає Promise
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// 3) async/await — той самий Promise, але читається як послідовний код
async function loadPost() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

Повний «курс еволюції» (callback hell → Promise → `async/await`) залишаємо як розширення в [TODO курсу](todo.md); для практики достатньо розуміти: **`await` чекає на Promise**, а `fetch` + `response.json()` — це **два** послідовні асинхронні кроки.

## Домашнє завдання

Виконайте **[Воркшоп 7: Weather API](workshops/ws07_weather_api.md)**. Там ви застосуєте ці знання на практиці (у т.ч. обробка `404` і параметри запиту вже показані в прикладі з `try/catch`).

---

## Контрольні питання

1. Яка різниця між методами GET і POST? Коли який використовувати?

<details markdown="1">
<summary>Відповідь</summary>

GET — отримує дані. Параметри в URL. Безпечний (не змінює стан сервера), ідемпотентний. Використання: завантаження сторінок, пошук.

POST — надсилає дані на сервер для створення ресурсу. Тіло запиту (Body) прихований. Не ідемпотентний — повторний запит може створити дублікат. Використання: реєстрація, відправка форми.

</details>

2. Ви отримали статус `401`. Потім `403`. Чим вони відрізняються?

<details markdown="1">
<summary>Відповідь</summary>

`401 Unauthorized` — сервер не знає, хто ви. Потрібна автентифікація (логін/пароль, токен).

`403 Forbidden` — сервер знає, хто ви, але вам сюди не можна. Проблема авторизації (немає прав).

</details>

3. Що таке ідемпотентність? Яке з HTTP-методів є ідемпотентним: PUT чи POST?

<details markdown="1">
<summary>Відповідь</summary>

Ідемпотентність — повторний запит дає той самий результат, що і перший.

PUT ідемпотентний: `PUT /users/1 {name: "Max"}` завжди залишить юзера з ім'ям Max, скільки б разів не виконали.

POST не ідемпотентний: `POST /users` щоразу створює нового юзера.

</details>

4. Ваш провайдер може бачити, що ви заходите на `bank.com`, але не бачить, яку транзакцію ви проводите. Чому?

<details markdown="1">
<summary>Відповідь</summary>

HTTPS шифрує тіло запиту і заголовки через TLS. DNS-запит і SNI (Server Name Indication) — відкриті, тому домен видно. Але сам URL (`/transfer?amount=1000`) і тіло запиту зашифровані.

</details>

5. Опишіть структуру HTTP-запиту та відповіді. Що обов'язково, а що опціонально?

<details markdown="1">
<summary>Відповідь</summary>

Запит: Request Line (метод, шлях, версія) — обов'язково. Headers (Host, Content-Type) — частково обов'язково. Body — тільки для POST/PUT/PATCH.

Відповідь: Status Line (версія, код, текст) — обов'язково. Headers (Content-Type, Set-Cookie) — зазвичай є. Body — HTML/JSON/файл, опціонально.

</details>


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
    fetch('[https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1)')
      .then(res => res.json())
      .then(console.log)
    ```
3.  Зробіть **POST** запит (створіть пост):
    ```javascript
    fetch('[https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)', {
      method: 'POST',
      body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(res => res.json())
      .then(console.log)
    ```

## Домашнє завдання

Виконайте **Workshop 9 (Weather API)**. Там ви використаєте ці знання на практиці, обробляючи помилки `404` та працюючи з параметрами запиту.

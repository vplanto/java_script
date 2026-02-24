# Лекція 5: JSON. Мова, якою спілкується світ

## Експрес-опитування: Чи є це валідним JSON?

1.  `{ name: "Vitaliy" }`
2.  `{ "name": 'Vitaliy' }`
3.  `{ "score": 100, }` (з комою в кінці)
4.  `{ "method": function() { alert(1) } }`

<details markdown="1">
<summary>Відповіді</summary>

1.  **Ні.** Ключі *обов'язково* мають бути в подвійних лапках.
2.  **Ні.** JSON визнає тільки **подвійні** лапки `"`.
3.  **Ні.** Trailing comma (кома в кінці) заборонена в чистому JSON.
4.  **Ні.** JSON — це дані. Функції — це код. JSON не може зберігати код (і це добре для безпеки).

</details>

---

## 1. Що таке JSON?

**JSON (JavaScript Object Notation)** — це текстовий формат обміну даними.
Хоча в назві є слово JavaScript, зараз це стандарт для **всіх** мов програмування (Python, Java, C++, Go).

### Інженерний погляд:
У пам'яті комп'ютера (Heap) об'єкт — це складна структура з посиланнями.
Щоб передати цей об'єкт по мережі або зберегти у файл, нам треба перетворити його на **Рядок (String)**.
Цей процес називається **Серіалізація**.

```mermaid
graph LR;
    Heap[JS Object in Memory] -->|JSON.stringify| String[JSON String];
    String -->|Network / Disk| Storage;
```

-----

## 2\. Синтаксис: Суворість закону

На відміну від JS об'єктів, JSON не пробачає помилок .

  * **Ключі:** Тільки `"key"`.
  * **Значення:**
      * Рядки `"string"`
      * Числа `10`, `3.14`
      * Булеві `true`, `false`
      * `null`
      * Масиви `[]`
      * Об'єкти `{}`
  * **Заборонено:**
      * `undefined`
      * Функції
      * Коментарі `//` (JSON — це дані, а не код) .

-----

## 3\. JSON vs XML: Чому XML програв?

Раніше (у 90-х та 00-х) стандартом був **XML** .

**Порівняння:**

**XML:**

```xml
<user>
  <id>1</id>
  <name>Vitaliy</name>
</user>
```

**JSON:**

```json
{
  "id": 1,
  "name": "Vitaliy"
}
```

**Чому переміг JSON?** 

1.  **Розмір:** Менше символів (немає закриваючих тегів). Економія трафіку.
2.  **Парсинг:** У JavaScript JSON перетворюється на об'єкт однією командою. Для XML потрібен громіздкий `DOMParser` .
3.  **Читабельність:** JSON легше сприймається оком розробника.

> **Де залишився XML?**
>
>   * `sitemap.xml` (для Google).
>   * RSS стрічки.
>   * Старі банківські системи (SOAP).
>   * SVG картинки (це теж XML\!).

-----

## 4\. Робота в JavaScript

У нас є два головні методи :

### `JSON.stringify(obj)`

Перетворює об'єкт на рядок.

```javascript
const user = { name: "Alex", level: 5 };
const data = JSON.stringify(user); 
// Результат: '{"name":"Alex","level":5}'
```

### `JSON.parse(string)`

Перетворює рядок назад на об'єкт.

```javascript
const obj = JSON.parse(data);
console.log(obj.name); // "Alex"
```

### Інженерна небезпека

`JSON.parse()` — це небезпечна операція. Якщо рядок битий, скрипт **впаде** з помилкою (`SyntaxError`), і ваша гра зламається.

**Правильний патерн:**

```javascript
try {
    const data = JSON.parse(serverData);
} catch (e) {
    console.error("Дані пошкоджено!", e);
    // Використати дефолтні налаштування
}
```

-----

## 5\. LocalStorage: Кишеня браузера

Ми хочемо, щоб наша гра пам'ятала прогрес.
Браузер має сховище **LocalStorage**. Воно живе вічно (поки не почистиш кеш) .

**Обмеження:** `localStorage` вміє зберігати **тільки рядки**.
Ви не можете зберегти там об'єкт.

**Як зберегти гру:**

1.  Беремо об'єкт `gameState`.
2.  `JSON.stringify(gameState)`.
3.  `localStorage.setItem('save', string)`.

**Як завантажити гру:**

1.  `localStorage.getItem('save')`.
2.  `JSON.parse(string)`.

-----

## Практикум: "Злам збереження"

1.  Відкрийте будь-який сайт, де у вас є налаштування (наприклад, темна тема).
2.  Відкрийте **DevTools -\> Application -\> Local Storage**.
3.  Ви побачите пари Ключ-Значення.
4.  Спробуйте змінити значення вручну. Оновіть сторінку.
      * *Сайт зламався? Чи прийняв ваші зміни?*

## Домашнє завдання

Реалізуйте **збереження рекорду** у вашій грі (Pong або Bad UI).

1.  При зміні очок зберігайте їх у `localStorage`.
2.  При завантаженні сторінки (`window.onload`) читайте значення і відновлюйте рахунок.
3.  **Бонус:** Зробіть кнопку "Reset Score", яка очищає пам'ять.

---

## Контрольні питання

1. Яке з таких значень є **валідним** JSON: `{ name: "Alice" }`, `{ "name": 'Alice' }`, `{ "name": "Alice" }`? Чому?

<details>
<summary>Відповідь</summary>

Тільки `{ "name": "Alice" }`. JSON вимагає ключі в подвійних лапках і значення-рядки теж тільки в подвійних лапках. Одинарні лапки ('Alice') і ключі без лапок (name) — заборонені.

</details>

2. Яка різниця між **серіалізацією** та **десеріалізацією**? Які методи JS їх виконують?

<details>
<summary>Відповідь</summary>

Серіалізація — перетворення об'єкта з пам'яті на рядок для передачі/зберігання: `JSON.stringify(obj)`.

Десеріалізація — зворотньо, рядок → об'єкт: `JSON.parse(str)`.

</details>

3. Чому `JSON.parse()` треба завжди загортати в `try/catch`?

<details>
<summary>Відповідь</summary>

Якщо рядок битий або не є JSON, `JSON.parse()` кидає `SyntaxError`. У браузері це зупинить виконання скрипту. Дані з localStorage або сервера можуть бути пошкоджені — захист обов'язковий.

</details>

4. LocalStorage може зберігати тільки рядки. Як зберегти і відновити об'єкт `{ score: 150, level: 3 }`?

<details>
<summary>Відповідь</summary>

```javascript
// Збереження
localStorage.setItem('gameState', JSON.stringify({ score: 150, level: 3 }));

// Відновлення
const state = JSON.parse(localStorage.getItem('gameState'));
console.log(state.score); // 150
```

</details>

5. Назвіть три типи даних, які **не можна** серіалізувати в JSON.

<details>
<summary>Відповідь</summary>

`undefined`, функції (`function(){}`), та символи (`Symbol()`). Вони або ігноруються у JSON.stringify, або викликають помилку. Також не серіалізуються кругові посилання (circular references).

</details>
---

## Слайди: JSON та YAML слайди (Лекція 9)

![Слайд 1](attachments/json_yaml_lecture/slide-01.png)
![Слайд 2](attachments/json_yaml_lecture/slide-02.png)
![Слайд 3](attachments/json_yaml_lecture/slide-03.png)
![Слайд 4](attachments/json_yaml_lecture/slide-04.png)
![Слайд 5](attachments/json_yaml_lecture/slide-05.png)
![Слайд 6](attachments/json_yaml_lecture/slide-06.png)
![Слайд 7](attachments/json_yaml_lecture/slide-07.png)
![Слайд 8](attachments/json_yaml_lecture/slide-08.png)
![Слайд 9](attachments/json_yaml_lecture/slide-09.png)
![Слайд 10](attachments/json_yaml_lecture/slide-10.png)
![Слайд 11](attachments/json_yaml_lecture/slide-11.png)
![Слайд 12](attachments/json_yaml_lecture/slide-12.png)
![Слайд 13](attachments/json_yaml_lecture/slide-13.png)
![Слайд 14](attachments/json_yaml_lecture/slide-14.png)
![Слайд 15](attachments/json_yaml_lecture/slide-15.png)
![Слайд 16](attachments/json_yaml_lecture/slide-16.png)
![Слайд 17](attachments/json_yaml_lecture/slide-17.png)
![Слайд 18](attachments/json_yaml_lecture/slide-18.png)
![Слайд 19](attachments/json_yaml_lecture/slide-19.png)
![Слайд 20](attachments/json_yaml_lecture/slide-20.png)
![Слайд 21](attachments/json_yaml_lecture/slide-21.png)
![Слайд 22](attachments/json_yaml_lecture/slide-22.png)
![Слайд 23](attachments/json_yaml_lecture/slide-23.png)
![Слайд 24](attachments/json_yaml_lecture/slide-24.png)
![Слайд 25](attachments/json_yaml_lecture/slide-25.png)
![Слайд 26](attachments/json_yaml_lecture/slide-26.png)
![Слайд 27](attachments/json_yaml_lecture/slide-27.png)
![Слайд 28](attachments/json_yaml_lecture/slide-28.png)
![Слайд 29](attachments/json_yaml_lecture/slide-29.png)
![Слайд 30](attachments/json_yaml_lecture/slide-30.png)
![Слайд 31](attachments/json_yaml_lecture/slide-31.png)
![Слайд 32](attachments/json_yaml_lecture/slide-32.png)
![Слайд 33](attachments/json_yaml_lecture/slide-33.png)
![Слайд 34](attachments/json_yaml_lecture/slide-34.png)
![Слайд 35](attachments/json_yaml_lecture/slide-35.png)

---

## Слайди: XML слайди (Лекція 7)

![Слайд 1](attachments/xml_lecture/slide-01.png)
![Слайд 2](attachments/xml_lecture/slide-02.png)
![Слайд 3](attachments/xml_lecture/slide-03.png)
![Слайд 4](attachments/xml_lecture/slide-04.png)
![Слайд 5](attachments/xml_lecture/slide-05.png)
![Слайд 6](attachments/xml_lecture/slide-06.png)
![Слайд 7](attachments/xml_lecture/slide-07.png)
![Слайд 8](attachments/xml_lecture/slide-08.png)
![Слайд 9](attachments/xml_lecture/slide-09.png)
![Слайд 10](attachments/xml_lecture/slide-10.png)
![Слайд 11](attachments/xml_lecture/slide-11.png)
![Слайд 12](attachments/xml_lecture/slide-12.png)
![Слайд 13](attachments/xml_lecture/slide-13.png)
![Слайд 14](attachments/xml_lecture/slide-14.png)
![Слайд 15](attachments/xml_lecture/slide-15.png)
![Слайд 16](attachments/xml_lecture/slide-16.png)
![Слайд 17](attachments/xml_lecture/slide-17.png)
![Слайд 18](attachments/xml_lecture/slide-18.png)
![Слайд 19](attachments/xml_lecture/slide-19.png)
![Слайд 20](attachments/xml_lecture/slide-20.png)
![Слайд 21](attachments/xml_lecture/slide-21.png)
![Слайд 22](attachments/xml_lecture/slide-22.png)
![Слайд 23](attachments/xml_lecture/slide-23.png)
![Слайд 24](attachments/xml_lecture/slide-24.png)

# Лекція 2: CSS як система координат

## Експрес-опитування: Інтуїція

1.  У вас є `div` шириною `100px`. Ви додали йому `border: 10px`. Яка тепер ширина елемента на екрані?
    * а) 100px
    * б) 110px
    * в) 120px
2.  Ви поставили елементу `z-index: 9999`, але він все одно знаходиться ПІД іншим елементом. Чому?
3.  Чому `margin-top` іноді не працює для першого елемента в блоці?

<details markdown="1">
<summary>Відповіді (для інженера)</summary>

1.  **120px** (за замовчуванням). Стандартна модель (`content-box`) додає рамки та відступи ДО ширини. Це пекло для розрахунків. Інженери використовують `border-box`.
2.  **Stacking Context (Контекст накладання).** `z-index` працює тільки всередині свого контексту. Якщо батько вашого елемента має нижчий `z-index`, ніж сусід, то ніякі `9999` не допоможуть дитині "вистрибнути" вище.
3.  **Margin Collapse.** Вертикальні відступи сусідніх блоків (або батька і першої дитини) "злипаються". Це не баг, це фіча шрифтового дизайну, яка перекочувала у веб.

</details>

---

## 1. Box Model: Математика інтерфейсу

Кожен елемент у DOM — це прямокутник. Навіть якщо він круглий (через `border-radius`), для браузера це прямокутна коробка.

### Інженерна проблема:
У стандартному CSS (`box-sizing: content-box`), якщо ви кажете `width: 100px` і `padding: 20px`, реальна ширина стає **140px**.
Це ламає сітки. Ви розраховуєте на 100, отримуєте 140, верстка "їде".

### Рішення: `border-box`
```css
* {
    box-sizing: border-box;
}
```

Тепер `width: 100px` означає, що весь елемент (разом з рамками і відступами) займе рівно 100px. Браузер сам стисне контент.
**Це перше, що ви пишете в будь-якому CSS файлі.**

-----

## 2\. Positioning: Керування реальністю

За замовчуванням елементи йдуть один за одним (Normal Flow). Щоб створити гру або складний UI, нам треба ламати цей порядок.

### `position: relative`

  * **Суть:** Елемент залишається в потоці (займає своє місце), але ми візуально зсуваємо його.
  * **Метафора:** Привид. Тіло сидить на стільці (місце зайняте), а душа відлетіла трохи вбік.

### `position: absolute`

  * **Суть:** Елемент виривається з потоку. Інші елементи ігнорують його існування і займають його місце.
  * **Координати:** Відносно найближчого батька з `position: relative` (або `absolute`/`fixed`).
  * **Ризик:** Якщо ви забули дати батькові `position: relative`, абсолютний елемент полетить аж до `<body>`.

### `position: fixed`

  * **Суть:** Приклеєний до вікна браузера. Не рухається при скролі.
  * **Кейс:** Хедери, модальні вікна, реклама.

-----

## 3\. Flexbox та Grid: Кінець страждань

Раніше ми використовували `float` і таблиці. Це був милицями. Зараз у нас є системи рівнянь.

  * **Flexbox (1D):** Коли треба розташувати елементи в одну лінію (меню, картки товару).
      * `display: flex; justify-content: center; align-items: center;` — три рядки, які центрують що завгодно.
  * **Grid (2D):** Коли треба побудувати повноцінну сітку сторінки.
      * `display: grid; grid-template-columns: repeat(3, 1fr);` — ідеальні три колонки.

> **Порада:** Не використовуйте JS для розрахунку позицій (`element.style.left = ...`), якщо це можна зробити через CSS Grid. JS — для логіки, CSS — для геометрії.

-----

## 4\. Селектори: Як знайти жертву

CSS — це мова запитів до DOM-дерева.

| Селектор | Приклад | Вага (Specificity) |
| :--- | :--- | :--- |
| Тег | `div` | 1 |
| Клас | `.btn` | 10 |
| ID | `#nav` | 100 |
| Inline | `style="..."` | 1000 |
| Важливо | `!important` | ∞ (Зло) |

**Війна специфічності:**
Якщо ви напишете:

```css
#menu a { color: red; } /* Вага 101 */
.link { color: blue; }  /* Вага 10 */
```

Посилання буде червоним, навіть якщо клас `.link` прописаний нижче. ID "перекрикує" класи.
**Інженерна практика:** Уникайте ID в стилях. Використовуйте класи. ID — для JS-хуків.

-----

## Практикум: "CSS Хірургія"

Відкрийте DevTools на будь-якому сайті.

1.  **Ламаємо Layout:**
      * Виберіть будь-який елемент.
      * Додайте `position: absolute`.
      * Подивіться, як сторінка "схлопнулася" під ним (бо він випав з потоку).
2.  **Debug Mode:**
      * Пропишіть для всіх елементів:

    ```css
    * { outline: 1px solid red; }
    ```
      * Тепер ви бачите справжні межі кожного "Box". Це найкращий спосіб зрозуміти структуру чужого сайту.

-----

## Домашнє завдання: Підготовка до Bad UI

Для виконання наступного воркшопу вам треба вміти рухати елементи.

1.  Створіть файл `index.html` у корені проєкту з таким вмістом:

    ```html
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>

    </body>
    </html>
    ```

2.  Створіть CSS файл.
3.  Зробіть кнопку "Втікач":
      * Дайте їй `position: absolute`.
      * Задайте початкові `top` і `left`.
4.  Спробуйте в браузері (через DevTools) змінювати `top/left` і дивитись, як вона літає по екрану. Це база для нашого наступного заняття.

---

## Контрольні питання

1. У чому різниця між `box-sizing: content-box` і `box-sizing: border-box`? Яке з них є кращою практикою і чому?

<details>
<summary>Відповідь</summary>

`content-box` (стандарт за замовчуванням): `width` враховує тільки контент, тому реальна ширина = `width + padding + border`. Це ламає розрахунки при верстці сіток.

`border-box`: `width` включає padding і border — ширина елемента залишається рівно такою, як ви вказали. Ставте `* { box-sizing: border-box; }` першим рядком у будь-якому CSS файлі.

</details>

2. У вас є два `div` один під одним. У першого `margin-bottom: 20px`, у другого `margin-top: 30px`. Який буде відступ між ними?

<details>
<summary>Відповідь</summary>

**30px**, а не 50px. Це Margin Collapse: вертикальні зовнішні відступи суміжних блоків «зливаються» в один — береться максимальне значення. Це поведінка, успадкована з типографіки.

</details>

3. Елемент має `z-index: 9999`, але він все одно знаходиться під сусіднім елементом. Яка найімовірніша причина?

<details>
<summary>Відповідь</summary>

Batько цього елемента утворює **Stacking Context** з нижчим `z-index`. `z-index` працює лише всередині свого контексту — він не виштовхує елемент «назовні». Якщо батько знаходиться нижче сусіда батьківського рівня, дитина з будь-яким `z-index` не допоможе.

</details>

4. Чому краще використовувати **CSS Grid** для розкладки сторінки, а не обчислювати позиції через JavaScript?

<details>
<summary>Відповідь</summary>

JavaScript-розрахунки позицій (`element.style.left = ...`) викликають **Layout Thrashing** — браузер змушений перераховувати геометрію при кожній зміні. CSS Grid — декларативний: ви описуєте структуру, браузер сам розраховує позиції один раз. Простіший код, краша продуктивність.

</details>

5. Поясніть різницю між `position: absolute` і `position: fixed`. У якому випадку використовуєте кожен?

<details>
<summary>Відповідь</summary>

`absolute` — координати відносно найближчого позиціонованого предка (`relative`/`absolute`/`fixed`). Прокручується разом зі сторінкою. Використання: елементи всередині компонента (tooltip, badge).

`fixed` — координати відносно вікна браузера. Не рухається при прокручуванні. Використання: sticky хедери, модальні вікна, кнопка «нагору».

</details>


---

## Слайди: CSS слайди (Лекція 6)

![Слайд 1](attachments/css_lecture/slide-01.png)
![Слайд 2](attachments/css_lecture/slide-02.png)
![Слайд 3](attachments/css_lecture/slide-03.png)
![Слайд 4](attachments/css_lecture/slide-04.png)
![Слайд 5](attachments/css_lecture/slide-05.png)
![Слайд 6](attachments/css_lecture/slide-06.png)
![Слайд 7](attachments/css_lecture/slide-07.png)
![Слайд 8](attachments/css_lecture/slide-08.png)
![Слайд 9](attachments/css_lecture/slide-09.png)
![Слайд 10](attachments/css_lecture/slide-10.png)
![Слайд 11](attachments/css_lecture/slide-11.png)
![Слайд 12](attachments/css_lecture/slide-12.png)
![Слайд 13](attachments/css_lecture/slide-13.png)
![Слайд 14](attachments/css_lecture/slide-14.png)
![Слайд 15](attachments/css_lecture/slide-15.png)
![Слайд 16](attachments/css_lecture/slide-16.png)
![Слайд 17](attachments/css_lecture/slide-17.png)
![Слайд 18](attachments/css_lecture/slide-18.png)
![Слайд 19](attachments/css_lecture/slide-19.png)
![Слайд 20](attachments/css_lecture/slide-20.png)
![Слайд 21](attachments/css_lecture/slide-21.png)
![Слайд 22](attachments/css_lecture/slide-22.png)
![Слайд 23](attachments/css_lecture/slide-23.png)
![Слайд 24](attachments/css_lecture/slide-24.png)
![Слайд 25](attachments/css_lecture/slide-25.png)
![Слайд 26](attachments/css_lecture/slide-26.png)
![Слайд 27](attachments/css_lecture/slide-27.png)
![Слайд 28](attachments/css_lecture/slide-28.png)
![Слайд 29](attachments/css_lecture/slide-29.png)
![Слайд 30](attachments/css_lecture/slide-30.png)
![Слайд 31](attachments/css_lecture/slide-31.png)
![Слайд 32](attachments/css_lecture/slide-32.png)
![Слайд 33](attachments/css_lecture/slide-33.png)
![Слайд 34](attachments/css_lecture/slide-34.png)
![Слайд 35](attachments/css_lecture/slide-35.png)
![Слайд 36](attachments/css_lecture/slide-36.png)
![Слайд 37](attachments/css_lecture/slide-37.png)
![Слайд 38](attachments/css_lecture/slide-38.png)
![Слайд 39](attachments/css_lecture/slide-39.png)
![Слайд 40](attachments/css_lecture/slide-40.png)
![Слайд 41](attachments/css_lecture/slide-41.png)
![Слайд 42](attachments/css_lecture/slide-42.png)
![Слайд 43](attachments/css_lecture/slide-43.png)
![Слайд 44](attachments/css_lecture/slide-44.png)
![Слайд 45](attachments/css_lecture/slide-45.png)
![Слайд 46](attachments/css_lecture/slide-46.png)
![Слайд 47](attachments/css_lecture/slide-47.png)
![Слайд 48](attachments/css_lecture/slide-48.png)
![Слайд 49](attachments/css_lecture/slide-49.png)
![Слайд 50](attachments/css_lecture/slide-50.png)
![Слайд 51](attachments/css_lecture/slide-51.png)

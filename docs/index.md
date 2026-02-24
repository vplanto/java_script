# Основи Інтернет-технологій
## Web Engineering: від «Hello World» до архітектури

Цей курс для тих, хто хоче розуміти веб-технології на рівні інженера, а не просто знати, як «підключити бібліотеку». Ми будуємо Single Page Application (SPA), розбираючи кожен шар — від пікселя до мережевого пакету.

---

## Вступ та філософія

1. [Лекція 0: Маніфест. Інженер проти кодера. Азімов і ШІ](00_manifesto.md)
2. **[Воркшоп 0: Hive Mind Architecture. Технічний бриф курсового проєкту](n00_HiveMind_Workshop.md)**

---

## Модуль 1: Візуалізація та структура (HTML/CSS)

*Починаємо з того, що бачить користувач. Але дивимось очима браузера.*

3. [Лекція 1: HTML як дерево (DOM). Чому семантика важлива для машин?](01_html_dom.md)
4. [Лекція 2: CSS як система координат. Box Model та Layout](02_css_layout.md)
5. **[Воркшоп 1: «Bad UI Battle». Екстремальне вивчення DOM Events та UX](workshops/ws01_bad_ui.md)**

---

## Модуль 2: Логіка та життя (JavaScript Core)

*Оживляємо статичну картинку. Розбираємося, як працює «мозок» сторінки.*

6. [Лекція 3: JavaScript Runtime. Змінні, типи та об'єкти у пам'яті](03_js_core.md)
7. [Лекція 3.5: Vibe Coding Protocol. Неймінг як техніка безпеки при роботі з AI](n04_vibe_coding_protocol.md)
8. [Лекція 3.6: Лікнеп по ОС. Процеси, потоки та хто виконує код](03a_os_basics.md)
9. [Лекція 4: Браузер зсередини. Event Loop, Rendering та чому JS «зависає»](04_browser_internals.md)
10. [Додатково: How Browsers Work. Детальний розбір (HTML + ілюстрації)](how_do_browsers_work/index.html)

### Практика: Performance & Algorithms

11. **[Воркшоп 2: Monte Carlo & Main Thread. Як «покласти» браузер математикою](workshops/ws02_monte_carlo.md)**
    *(Демонстрація однопоточності JS та оптимізація через Web Workers)*
12. **[Воркшоп 3: Memory Game. Рефакторинг Legacy-коду та DOM Optimization](workshops/ws03_dom_optimization.md)**
    *(Боротьба з DOM Thrashing та перехід до CSS Grid)*
13. **[Воркшоп 4: Game Loop (Pong). Фізика, колізії та архітектура гри](workshops/ws04_game_loop.md)**
    *(Як працює requestAnimationFrame та ігрова логіка)*
14. **[Воркшоп 5: Minesweeper. Ітеративна розробка та рекурсія](workshops/ws05_minesweeper.md)**
    *(Реалізація алгоритму Flood Fill та управління станом)*

---

## Модуль 3: Дані та пам'ять (Data Persistence)

*Робимо так, щоб гра пам'ятала нас після перезавантаження.*

15. [Лекція 5: JSON. Мова, якою спілкується світ](05_json_data.md)
16. **[Воркшоп 6: Data Analytics. Збереження історії та експорт (JSON/XML)](workshops/ws06_data_analytics.md)**
    *(Робота з LocalStorage, серіалізація та генерація файлів)*

---

## Модуль 4: Мережа (Networking)

*Виходимо за межі одного комп'ютера.*

17. [Лекція 6: Архітектура Інтернету. Модель OSI, TCP/IP та DNS](06_networking_osi.md)
18. [Лекція 7: HTTP/S та REST. Анатомія запиту](07_http_rest.md)
19. **[Воркшоп 7: Weather API. Робота з реальними даними та fetch()](workshops/ws09_weather_api.md)**
    *(Асинхронність, HTTP-статуси та небезпека зберігання ключів)*

---

## Модуль 5: Безпека та AI (Фінальний проєкт)

*Фінальний бос: гра «Камінь-Ножиці-Папір» з авторизацією та штучним інтелектом.*

20. [Лекція 8: Темна сторона вебу. XSS, CSRF та SQL Injection](08_security.md)
21. **[Воркшоп 8: Auth & Security. Хешування паролів та захист даних](workshops/ws07_auth_security.md)**
    *(Використання Web Crypto API)*
22. **[Воркшоп 9: Game AI. Створення розумного бота](workshops/ws08_game_logic.md)**
    *(Марковські ланцюги та теорія ймовірностей)*

---

## Інструменти та додаткові матеріали

- [Налаштування середовища (VS Code, Git)](n01_setup.md)
- [Шпаргалка по Markdown](n02_markdown.md)
- [Git Guide: як не втратити код і здати лабу](n03_git_basics.md)
- [FAQ & Troubleshooting: типові помилки](faq_troubleshooting.md)
- [Вкладення та PDF-матеріали курсу](attachments/README.md)
- [TODO: план розробки курсу](todo.md)

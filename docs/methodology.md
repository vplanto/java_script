# Методологія курсу

**Курс:** Основи Інтернет-технологій / Web Engineering  
**Формат:** один семестр, 5 модулів + фінальний курсовий проєкт  
**Аудиторія:** студенти з базовим C++ (пам'ять, вказівники, алгоритми)

---

## Мета

Навчити розуміти веб-стек як інженерну систему — від DOM і CSS до HTTP, безпеки та продуктивності JS у браузері. Курс будує траєкторію до **Single Page Application** (симуляція «Hive Mind»), але не замінює фреймворки: акцент на «Zero Magic» (Vanilla JS, Canvas, Fetch).

---

## Траєкторія модулів

| Модуль | Тема | Лекції | Основні воркшопи |
|--------|------|--------|------------------|
| **Вступ** | Філософія, Hive Mind (бриф) | [00_manifesto](00_manifesto.md) | [n00 Hive Mind Workshop](workshops/hive/n00_HiveMind_Workshop.md) |
| **1** | HTML / CSS / DOM | [01](01_html_dom.md), [01a](01a_html_dom.md), [01b](01b_html_dom.md), [02](02_css_layout.md) | [ws01](workshops/ws01_bad_ui.md), [CSS walkthrough](workshops/ws_practice_css_selectors_walkthrough.md) |
| **2** | JavaScript, браузер, продуктивність | [03](03_js_core.md), [n04 Vibe Coding](n04_vibe_coding_protocol.md), [04](04_browser_internals.md) | [ws02 Monte Carlo](workshops/ws02_monte_carlo.md), [ws04 Game Loop](workshops/ws04_game_loop.md) |
| **3** | Дані та серіалізація | [05](05_json_data.md) | [ws06 Data Analytics](workshops/ws06_data_analytics.md) |
| **4** | Мережа, HTTP, API | [06](06_networking_osi.md), [07](07_http_rest.md) | [ws07 Weather API](workshops/ws07_weather_api.md) |
| **5** | Безпека, алгоритми | [08](08_security.md) | [ws08 Auth](workshops/ws08_auth_security.md), [ws09 Game AI](workshops/ws09_game_logic.md) |
| **Фінал** | Курсовий проєкт | — | [n05 Starter Lab](workshops/hive/n05_hive_mind_starter_lab.md), [Hive Mind](workshops/hive/n00_HiveMind_Workshop.md) |

**Бонус / самостійно:** [ws03 DOM Optimization](workshops/ws03_dom_optimization.md), [ws05 Minesweeper](workshops/ws05_minesweeper.md).

Повний зміст з нумерацією — у [змісті курсу](index.md).

---

## Покриття програми (стисло)

- **Структура та представлення:** HTML Living Standard [1], DOM [13], CSS [4], Critical Rendering Path [10].
- **Виконання коду:** ECMA-262 [3], V8 [11], Event Loop, Web Workers [14].
- **Дані:** JSON [9], localStorage [15], Blob/експорт.
- **Мережа:** OSI/TCP/IP, DNS [16], HTTP [5], Fetch [6], REST.
- **Безпека:** XSS, CSRF, SQLi — OWASP [7]; Web Crypto [8] (контекст клієнта vs сервера).
- **Інженерія з ШІ:** [Vibe Coding Protocol](n04_vibe_coding_protocol.md), [Декларація](DISCLAIMER.md).

Детальні критерії лабораторних **не** дублюються тут — вони в окремих guide-файлах воркшопів і брифі Hive Mind.

---

## Оцінювання

Правила здачі, Anti-Cheat, Prompt Log і саботаж-захист — у **[Маніфесті](00_manifesto.md)**. Цей документ лише посилається на них, не копіює.

| Компонент | Де описано | Примітка |
|-----------|------------|----------|
| Лабораторні / воркшопи | Текст кожного `ws*.md`, Hive labs | Критерії в guide-файлах |
| Курсовий «Hive Mind» | [n00 Workshop](workshops/hive/n00_HiveMind_Workshop.md) | Окремий репозиторій starter |
| Екзамен | [Пул екзаменаційних питань](exam.md) | Питання **без** відповідей для студентів |
| Академічна доброчесність | [DISCLAIMER](DISCLAIMER.md) | Закон [12], політика ШІ |

**Екзамен ≠ курсовий проєкт:** пул питань перевіряє теоретичне володіння матеріалом модулів; курсовий оцінює архітектуру, код і захист реалізації Hive Mind.

---

## Інструменти (поза methodology)

Налаштування середовища, Markdown і Git — окремі файли, **не** дублюються тут:

- [n01_setup.md](n01_setup.md)
- [n02_markdown.md](n02_markdown.md)
- [n03_git_basics.md](n03_git_basics.md)

---

## НМК курсу

- [Джерела](sources.md) · [Декларація](DISCLAIMER.md) · [Пул екзаменаційних питань](exam.md)

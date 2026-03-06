# Лекція 01: HTML як Дерево (DOM), Browser Internals та Форми

**Тип заняття:** Лекція / Deep Dive  
**Необхідний бекграунд:** C++ (Memory, Pointers, Threads)  
**Мета:** Зрозуміти, як текст перетворюється на пікселі, чому `<div>` коштує дорого, і як працює передача даних.

Матеріал розбито на **дві частини**:

---

## Частина 1 — HTML, DOM та Стандарти

**[→ 01a_html_dom.md](01a_html_dom.md)**

- Експрес-опитування: перформанс
- HTML Engineering: синтаксис, семантика, структура (декларативність, контейнери, коментарі, entities, white space, списки, таблиці, посилання, block/inline, semantic HTML, anti-pattern кнопка/div)
- Концепція DOM як структура даних (declarative vs imperative, товстий клієнт, локальність і пам’ять)
- Еволюція та стандарти (історія HTML, W3C, XHTML, HTML4/5, WHATWG, Living Standard)

---

## Частина 2 — Як працюють браузери, Rendering Path та Форми

**[→ 01b_html_dom.md](01b_html_dom.md)**

- Анатомія браузера: процеси та потоки (Chrome, Main Thread, Compositor, демо «Як працює браузер»)
- Critical Rendering Path: DOM → CSSOM → Render Tree → Layout → Paint → Composite (z-index, stacking context)
- Форми та передача даних (GET/POST, безпека паролів)
- Застосування в курсовому проєкті (чому не DOM, рішення Canvas)
- Контрольні питання та відповіді

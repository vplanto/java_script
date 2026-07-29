# Відповіді до пулу екзаменаційних питань

> **Для викладача.** Не публікується студентам (`exclude` у `_config.yml`).  
> Студентський пул без відповідей: [exam.md](exam.md).

---

## Тема 0: Філософія інженерії

1. **Кодер** перетворює ТЗ на синтаксис; **інженер** розуміє *чому* код працює, проводить code review ШІ, знаходить вузькі місця. ШІ автоматизує кодера, підвищує цінність інженера.
2. Браузер і V8 написані на C++; Stack/Heap, процеси — ті самі концепції, що пояснюють `let obj = {}`, layout, GC, блокування main thread.
3. **Міраж хибної майстерності** — плутанина доступу до згенерованого коду з реальним розумінням. **Пастка контекстного вікна** — робота лише з фрагментами в чаті руйнує архітектурне мислення для великих систем.

## Тема 1: HTML, DOM

1. HTML описує *що* має бути (декларативно); C++/JS — *як* виконати кроки (імперативно).
2. **Товстий клієнт** — браузер виконує логіку локально; зміна DOM у DevTools не надсилає запит на сервер і не змінює БД.
3. HTML4/XHTML орієнтувались на строгість; Living Standard [1] — fault tolerance, rolling release, зворотна сумісність.
4. Div soup ламає семантику, доступність, SEO, поведінку клавіатури/скрінрідерів; `<button>` має вбудовану поведінку.

## Тема 2: Архітектура браузера та CRP

1. Browser, Renderer (на вкладку), GPU, Network, Plugin тощо — ізоляція: падіння вкладки не вбиває весь браузер; безпека [10].
2. HTML → DOM; CSS → CSSOM; Render Tree → Layout → Paint → Composite.
3. **Layout** (reflow) дорожчий за **composite**; `transform`/`opacity` часто лише composite layer, без перерахунку геометрії.
4. `display: none` виключає з render tree; `visibility: hidden` залишає в дереві, але невидимим.
5. `z-index` працює лише в межах **stacking context**; новий контекст створюють `position`+`z-index`, `opacity` < 1, `transform` тощо.

## Тема 3: CSS

1. `content-box`: width без padding/border → «математика інтерфейсів» ламається; `border-box` включає padding і border у задану ширину.
2. **Padding** — всередині border; **margin** — зовні, між сусідами; **margin collapse** — вертикальні margin сусідів зливаються.
3. `absolute` — відносно найближчого positioned предка; `fixed` — відносно viewport.
4. Grid — декларативний layout у CSS; JS-координати → layout thrashing, повільні reflow.
5. Каскад: специфічність (inline > id > class > tag), порядок, `!important` перебиває (крім іншого `!important` з вищою специфічністю).

## Тема 4: JavaScript Core

1. Примітиви і посилання на стеку; об'єкти в heap; виклики функцій — frames на стеку.
2. Об'єкти передаються за посиланням; `const` фіксує прив'язку імені, не вміст об'єкта.
3. Spread копіює верхній рівень; вкладені об'єкти — спільні посилання → мутації «з іншої копії».
4. Mark-and-Sweep позначає досяжні об'єкти; витоки — глобальні посилання, забуті listeners, closures.
5. Булеві: `is`/`has`/`can`; числа з одиницями: `timeout_ms`, `price_usd` (Vibe Coding Protocol).

## Тема 5: Event Loop

1. Call stack → microtasks → macrotasks; `setTimeout(fn,0)` виконається після синхронного коду і microtasks.
2. JS на main thread — один потік; `while(true)` не віддає керування → UI не оновлюється.
3. `setInterval` не синхронізований з refresh rate; `requestAnimationFrame` — перед repaint, ~60 FPS.
4. Workers — окремий потік; важкі обчислення (Monte Carlo) не блокують UI.
5. Обмін через `postMessage` (structured clone); немає shared mutable state → немає data races як у C++ threads.

## Тема 6: JSON

1. Текстовий формат: подвійні лапки, без trailing comma; типи: object, array, string, number, bool, null; **не** function, undefined, Date як тип.
2. `JSON.parse` кидає на невалідному JSON → `try/catch`.
3. JSON легший за XML, нативний для JS, швидший парсинг, менше overhead.
4. `localStorage` — лише рядки; `JSON.stringify` / `JSON.parse` для об'єктів.
5. Blob + `URL.createObjectURL` + `<a download>` для файлу в браузері.

## Тема 7: Мережа

1. TCP — надійність, handshake; UDP — швидкість, втрати пакетів допустимі (ігри).
2. Кеш браузера → OS → resolver → recursive DNS → root/TLD/authoritative → IP.
3. HTTP — рівень 7 (додатків); IP — рівень 3; рівні ізольовані абстракціями.
4. Порт ідентифікує **процес/сервіс** на хості (багато сокетів на одному IP).
5. MTU ~1500 байт; фрагментація і збірка пакетів.

## Тема 8: HTTP / REST

1. Request: line, headers, body; Response: status line, headers, body.
2. GET — ідempotent read, параметри в URL; POST — body, не для паролів у URL (логи, історія).
3. **401** — не автентифікований; **403** — автентифікований, але заборонено.
4. Ідемпотентність: PUT/DELETE повторно дають той самий ефект; POST — ні (створення).
5. `fetch` не reject на 404/500 — лише мережеві помилки; потрібна перевірка `response.ok`.

## Тема 9: Безпека

1. **XSS** — виконання чужого JS на сторінці (escape, CSP, textContent). **CSRF** — запит від імені жертви (токени, SameSite cookies).
2. `innerHTML` парсить HTML/скрипти; `textContent` — лише текст.
3. SQL injection — конкатенація рядка запиту; prepared statements — параметри окремо.
4. Клієнтський хеш видно в DevTools → pass-the-hash; хешування лише на сервері з salt.
5. Rainbow tables — словники хешів; salt унікальний на пароль руйнує попередні таблиці.

## Тема 10: Ігрові алгоритми

1. SoA / TypedArrays — cache-friendly, менше GC, масштаб на 10k+ агентів (Hive Mind).
2. AABB — прямокутники по осям; швидко, але хибні спрацьовування для обертів.
3. God Mode — телепорт (непередбачувано для гравця); Predictive — екстраполяція траєкторії м'яча.
4. Рекурсивний flood fill — переповнення стеку; ітеративний BFS/queue або explicit stack.
5. RPS: рандом ≈ Nash (1/3 кожен); адаптивний бот передбачуваний і експлуатується; рандом не мінусує в довгій серії.

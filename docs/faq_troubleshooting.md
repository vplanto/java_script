# FAQ: Швидка допомога інженера

Якщо щось пішло не так — не панікуйте. Це частина роботи.
Ось список типових проблем, з якими ви зіткнетеся в цьому курсі.

---

## 🚨 Проблема 1: "Браузер завис намертво"

**Симптоми:**
* Вкладка не реагує на кліки.
* Неможливо відкрити DevTools (`F12`).
* Спінер загрузки крутиться вічно.

**Причина:**
Ви заблокували **Main Thread**. Найімовірніше, у вас нескінченний цикл (`while(true)`) або дуже важка синхронна операція (як у Monte Carlo v1), яка не дає Event Loop-у перемалювати екран.

**Рішення:**
1.  **Kill it:** Відкрийте Диспетчер завдань браузера (`Shift+Esc` в Chrome) і вбийте процес цієї вкладки.
2.  **Fix it:** Перевірте умови виходу з циклів. Якщо обчислення важкі — розбийте їх на шматки через `setTimeout` або винесіть у **Web Worker**.

---

## 🐛 Проблема 2: "Змінив одне — зламалося все" (Reference Trap)

**Симптоми:**
* Ви змінили `player2.score`, а `player1.score` теж змінився.
* Ви передали масив у функцію, функція його відсортувала, і ваш оригінальний масив теж змінився.

**Причина:**
В JS об'єкти та масиви передаються за **посиланням** (Reference), а не копіюються.

**Рішення:**
Робіть копії перед зміною!
```javascript
// ❌ Погано (mutating original)
const sorted = users.sort(...);

// ✅ Добре (copy first)
const sorted = [...users].sort(...); 
// або
const clone = structuredClone(user);
```

-----

## ⏳ Проблема 3: `[object Promise]` замість даних

**Симптоми:**

  * Ви намагаєтесь вивести результат `fetch` або `hashPassword`, а бачите `Promise { <pending> }`.

**Причина:**
Ви забули `await`. Асинхронна функція повертає "обіцянку" результату, а не сам результат.

**Рішення:** використовуйте `await` усередині `async`-функції **або** ланцюжок `.then()` — інакше в змінній лишається саме `Promise`, а не результат.

```javascript
// ❌ Без await
const hash = hashPassword("123");
console.log(hash); // Promise

// ✅ З await
const hash = await hashPassword("123");
console.log(hash); // "a665..."

// ❌ Fetch без await
const data = fetch('https://api.example.com/users');
console.log(data); // Promise { <pending> }

// ✅ Fetch з await
const response = await fetch('https://api.example.com/users');
const data = await response.json();
console.log(data); // { users: [...] }
```

Стисла «еволюція» від Promise-ланцюжка до `async/await` — у [Лекції 7 (розділ 4a)](07_http_rest.md).

-----

## 🔒 Проблема 4: "Не працює crypto.subtle" (Security Context)

**Симптоми:**

  * Помилка `Uncaught TypeError: Cannot read property 'digest' of undefined`.

**Причина:**
Браузери блокують потужні API (як криптографія) на незахищених сайтах.
Якщо ви відкрили файл як `file:///C:/Users/.../index.html` — це **небезпечний контекст**.

**Рішення:**
Використовуйте локальний сервер.

1.  Встановіть розширення **Live Server** у VS Code.
2.  Клікніть `Go Live` у правому нижньому кутку.
3.  Працюйте через `http://127.0.0.1:5500/...` (це вважається безпечним контекстом).
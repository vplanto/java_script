# Воркшоп 6: Збереження даних і аналітика (Big Data в кишені)

Ваша гра працює. Але дані зникають.
У цьому модулі ми перетворимо гру на систему збору статистики.

## 1. Логування (Logging)

Ми не просто показуємо рахунок. Ми записуємо **кожну подію**.
Створіть масив `gameHistory`. Після кожного раунду додавайте туди об'єкт:

```javascript
const logEntry = {
    timestamp: new Date().toISOString(),
    user: currentUser.nickname,
    aiLevel: "adaptive",
    playerMove: "Rock",
    aiMove: "Paper",
    result: "loss"
};
gameHistory.push(logEntry);
```

## 2\. Збереження (Persistence)

Використайте `localStorage` для збереження масиву `users` та `gameHistory`.

  * **Нюанс:** `localStorage` приймає тільки рядки. Не забудьте про `JSON.stringify()` при записі та `JSON.parse()` при читанні .

## 3\. Експорт даних: JSON vs XML

Уявіть, що ваш замовник — старомодний банк. Вони хочуть звіт у XML. А стартап-партнер хоче JSON. Ви повинні вміти і те, і те.

### JSON Export

Це просто. Ви створюєте `Blob` (Binary Large Object) з типом `application/json` і генеруєте посилання на скачування .

### XML Export (Челендж)

JS не має простого "stringify" для XML. Вам треба написати рекурсивну функцію-конвертер.

**Алгоритм:**

1.  Отримати об'єкт.
2.  Відкрити тег `<key>`.
3.  Якщо значення — об'єкт, викликати функцію знову (рекурсія).
4.  Якщо значення — примітив, записати його.
5.  Закрити тег `</key>`.

Використайте цей код як базу :

```javascript
function jsonToXml(data, root = 'root') {
    let xml = `<${root}>`;
    
    for (const key in data) {
        const value = data[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Рекурсія для вкладених об'єктів
            xml += jsonToXml(value, key);
        } else if (Array.isArray(value)) {
            // Обробка масивів
            value.forEach(item => {
                xml += jsonToXml(item, key);
            });
        } else {
            // Примітивне значення
            xml += `<${key}>${value}</${key}>`;
        }
    }
    
    xml += `</${root}>`;
    return xml;
}
```

## 4\. Фінал: Download Feature

Реалізуйте кнопку "Завантажити історію".
Браузер повинен не відкрити текст, а саме почати скачування файлу `history.json` або `history.xml`.

```javascript
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
```

## 5\. Підсумки курсу

Ви пройшли шлях від порожнього файлу до складної системи з:

1.  Семантичним HTML.
2.  Адаптивним CSS.
3.  Захищеною авторизацією (Hash).
4.  Розумним AI.
5.  Системою аналітики даних.

Ви — інженери.

---

## Контрольні питання

1. Навіщо логувати кожну подію з `timestamp: new Date().toISOString()`? Що дає ISO-формат дати?

<details>
<summary>Відповідь</summary>

ISO 8601 (`2024-01-15T14:30:00.000Z`) — стандартний формат, зрозумілий будь-якій системі. Timestamp дозволяє відтворити хронологію подій, знайти аномалії (дуже короткі ігри, нічні сесії). Без нього дані — купа безпорядкових фактів.

</details>

2. Чому для XML немає вбудованого аналога `JSON.stringify`?

<details>
<summary>Відповідь</summary>

XML — складніша структура з тегами, атрибутами та namespace. Немає єдиного способу відобразити JS-об'єкт у XML: масив — це окремі теги чи атрибути? Тому потрібна ручна або рекурсивна конвертація з явними правилами.

</details>

3. Що таке `Blob` і навіщо він потрібен для скачування файлу?

<details>
<summary>Відповідь</summary>

Blob (Binary Large Object) — об'єкт, що представляє бінарні дані з заданим MIME-типом. `URL.createObjectURL(blob)` створює тимчасовий URL у пам'яті браузера. Встановивши його як `href` тегу `<a>` і натиснувши, браузер починає завантаження файлу, а не відкриває сторінку.

</details>

4. Яка різниця між `localStorage` і `sessionStorage`? Коли краще використовувати другий?

<details>
<summary>Відповідь</summary>

`localStorage` — зберігається вічно між сесіями. `sessionStorage` — очищається при закритті вкладки. Другий підходить для тимчасових даних (кошик без реєстрації, стан форми), де ви не хочете, щоб дані «протікали» в наступну сесію.

</details>
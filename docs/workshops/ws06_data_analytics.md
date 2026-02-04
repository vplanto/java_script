# Workshop 8: Data Persistence & Analytics (Big Data в кишені)

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
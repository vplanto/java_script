# Лекція 6: Архітектура Інтернету. OSI, TCP/IP та DNS

## Експрес-опитування: Як подорожують байти?

1.  Чому онлайн-ігри (CS:GO, Dota) використовують UDP, а банківські додатки — TCP?
2.  Ви ввели в браузері `google.com`. Звідки ваш комп'ютер знає, на яку IP-адресу надсилати запит?
3.  Що таке "пакет" в інтернеті?

<details markdown="1">
<summary>Відповіді інженера</summary>

1.  **Швидкість vs Надійність.** UDP (User Datagram Protocol) "вистрелив і забув" — це швидко, втрата пакету не критична. TCP (Transmission Control Protocol) гарантує доставку, але вимагає підтвердження (Handshake), що повільніше .
2.  **DNS (Domain Name System).** Це "телефонна книга" інтернету. Браузер запитує DNS-сервер: "Хто такий google.com?", а той відповідає: `142.250.185.78` .
3.  **Шматок даних.** Файл не летить цілком. Він розбивається на тисячі маленьких пакетів (MTU ~1500 байт), які летять різними шляхами і збираються докупи на вашому ПК .

</details>

---

## 1. Модель OSI: 7 кіл пекла (спрощено)

Інженери розбили мережу на рівні, щоб не збожеволіти. Це абстракція .

| Рівень | Назва | Що передається | Приклад | Що робить? |
| :--- | :--- | :--- | :--- | :--- |
| **7** | **Application** | Data | HTTP, DNS | Те, що бачить програма (браузер). |
| **4** | **Transport** | Segments | TCP, UDP | Гарантує доставку і порти (кому саме на комп'ютері). |
| **3** | **Network** | Packets | IP | Адресація (куди в світі це відправити). |
| **2** | **Data Link** | Frames | Ethernet, Wi-Fi | Фізична адресація (MAC) всередині кімнати. |
| **1** | **Physical** | Bits | Кабель, Радіо | Нулі та одиниці по дротах. |

> **Інсайт:** Коли ви відправляєте запит, дані проходять шлях 7 -> 1 (Інкапсуляція), летять по дротах, а на сервері йдуть 1 -> 7 (Декапсуляція) .

---

## 2. TCP vs UDP: Гарантія чи Швидкість?

### TCP (Transmission Control Protocol)
* **Принцип:** "Привіт, ти мене чуєш? — Так, чую. — Ок, я відправляю дані." (3-way Handshake) .
* **Фішка:** Якщо пакет загубився, TCP відправить його знову. Порядок гарантований.
* **Використання:** Веб-сайти (HTTP), пошта, файли.

### UDP (User Datagram Protocol)
* **Принцип:** "Лови!" (Кидає дані, не чекаючи відповіді) .
* **Фішка:** Ніяких затримок на рукостискання. Втратив кадр? Ну і грець з ним, малюємо наступний.
* **Використання:** Відеодзвінки, Стрімінг, Ігри.

---

## 3. IP та DNS: Адресація

**IP-адреса** — це як поштова адреса будинку (`192.168.0.1`).
**Порт** — це номер квартири в будинку (`:80`, `:443`, `:3000`).

Коли ви запускаєте локальний сервер (`localhost:3000`), ви кажете: *"Слухай запити на моєму комп'ютері (localhost) у квартирі №3000"* .

### DNS (Domain Name System)
Люди не пам'ятають цифри. Ми пам'ятаємо імена.
DNS — це розподілена база даних, яка перетворює `facebook.com` -> `157.240.214.35`.

**Ланцюжок:**
1.  Кеш браузера.
2.  Кеш ОС.
3.  Роутер.
4.  ISP (Провайдер).
5.  Google DNS (`8.8.8.8`).

---

## Практикум: "Мережевий детектив"

1.  **Ping:** Відкрийте термінал. Напишіть `ping google.com`. Ви побачите час відповіді (Latency).
2.  **TraceRoute:** Напишіть `tracert google.com` (Windows) або `traceroute google.com` (Mac/Linux).
    * Ви побачите кожен стрибок (Hop) від вашого роутера через провайдера, через океан до сервера Google. Це фізичний шлях ваших даних.
3.  **DevTools:** Вкладка Network -> Timing.
    * Подивіться `DNS Lookup` — скільки часу браузер шукав IP.
    * Подивіться `Initial Connection` — скільки часу зайняв TCP Handshake.

## Домашнє завдання

Дізнайтеся свою зовнішню IP-адресу. Попросіть друга (в іншій мережі) спробувати відкрити вашу гру по цій IP-адресі.
**Питання:** Чому у нього не вийде? (Гугліть "NAT" та "Public vs Private IP") .

---

## Контрольні питання

1. На якому рівні моделі OSI працює HTTP? А IP? А Wi-Fi? Що кожен з них «не знає» про інші?

<details>
<summary>Відповідь</summary>

HTTP — рівень 7 (Application). IP — рівень 3 (Network). Wi-Fi — рівень 2 (Data Link) / рівень 1 (Physical).

Кожен рівень знає тільки про безпосередньо нижній і вищий. HTTP «не знає», чим фізично передається запит — кабелем чи радіохвилями. IP «не знає», це браузерний запит чи SSH-з'єднання.

</details>

2. Чоловік каже: «UDP ненадійний, тому онлайн-ігри використовують TCP для надійності». Що тут не так?

<details>
<summary>Відповідь</summary>

Все навпаки. Ігри використовують UDP саме тому, що він **швидкий**. TCP-підтвердження (ACK) додають затримку. У грі краще пропустити кадр позиції гравця, ніж чекати його RetransmissionTimeout — через 100мс позиція вже застаріє.

</details>

3. Поясніть, що відбувається від моменту, коли ви ввели `github.com`, до моменту, коли браузер отримав IP-адресу.

<details>
<summary>Відповідь</summary>

1. Браузер перевіряє свій кеш DNS.
2. ОС перевіряє файл `/etc/hosts` і свій кеш.
3. Роутер перевіряє власний кеш.
4. Запит йде до DNS-сервера провайдера (ISP).
5. ISP звертається до рекурсивних DNS (наприклад, 8.8.8.8 Google).
6. Знайдений IP повертається і кешується на кожному рівні.

</details>

4. Що таке порт? Навіщо він потрібен, якщо є IP-адреса?

<details>
<summary>Відповідь</summary>

IP визначає **комп'ютер** у мережі. Порт визначає **процес** на комп'ютері. Кілька програм можуть слухати одночасно: HTTP-сервер на :80, HTTPS на :443, локальний dev-сервер на :3000. Без порту ОС не знала б, кому передати пакет.

</details>
---

## Слайди: OSI та мережі слайди

![Слайд 1](attachments/osi/slide-001.png)
![Слайд 2](attachments/osi/slide-002.png)
![Слайд 3](attachments/osi/slide-003.png)
![Слайд 4](attachments/osi/slide-004.png)
![Слайд 5](attachments/osi/slide-005.png)
![Слайд 6](attachments/osi/slide-006.png)
![Слайд 7](attachments/osi/slide-007.png)
![Слайд 8](attachments/osi/slide-008.png)
![Слайд 9](attachments/osi/slide-009.png)
![Слайд 10](attachments/osi/slide-010.png)
![Слайд 11](attachments/osi/slide-011.png)
![Слайд 12](attachments/osi/slide-012.png)
![Слайд 13](attachments/osi/slide-013.png)
![Слайд 14](attachments/osi/slide-014.png)
![Слайд 15](attachments/osi/slide-015.png)
![Слайд 16](attachments/osi/slide-016.png)
![Слайд 17](attachments/osi/slide-017.png)
![Слайд 18](attachments/osi/slide-018.png)
![Слайд 19](attachments/osi/slide-019.png)
![Слайд 20](attachments/osi/slide-020.png)
![Слайд 21](attachments/osi/slide-021.png)
![Слайд 22](attachments/osi/slide-022.png)
![Слайд 23](attachments/osi/slide-023.png)
![Слайд 24](attachments/osi/slide-024.png)
![Слайд 25](attachments/osi/slide-025.png)
![Слайд 26](attachments/osi/slide-026.png)
![Слайд 27](attachments/osi/slide-027.png)
![Слайд 28](attachments/osi/slide-028.png)
![Слайд 29](attachments/osi/slide-029.png)
![Слайд 30](attachments/osi/slide-030.png)
![Слайд 31](attachments/osi/slide-031.png)
![Слайд 32](attachments/osi/slide-032.png)
![Слайд 33](attachments/osi/slide-033.png)
![Слайд 34](attachments/osi/slide-034.png)
![Слайд 35](attachments/osi/slide-035.png)
![Слайд 36](attachments/osi/slide-036.png)
![Слайд 37](attachments/osi/slide-037.png)
![Слайд 38](attachments/osi/slide-038.png)
![Слайд 39](attachments/osi/slide-039.png)
![Слайд 40](attachments/osi/slide-040.png)
![Слайд 41](attachments/osi/slide-041.png)
![Слайд 42](attachments/osi/slide-042.png)
![Слайд 43](attachments/osi/slide-043.png)
![Слайд 44](attachments/osi/slide-044.png)
![Слайд 45](attachments/osi/slide-045.png)
![Слайд 46](attachments/osi/slide-046.png)
![Слайд 47](attachments/osi/slide-047.png)
![Слайд 48](attachments/osi/slide-048.png)
![Слайд 49](attachments/osi/slide-049.png)
![Слайд 50](attachments/osi/slide-050.png)
![Слайд 51](attachments/osi/slide-051.png)
![Слайд 52](attachments/osi/slide-052.png)
![Слайд 53](attachments/osi/slide-053.png)
![Слайд 54](attachments/osi/slide-054.png)
![Слайд 55](attachments/osi/slide-055.png)
![Слайд 56](attachments/osi/slide-056.png)
![Слайд 57](attachments/osi/slide-057.png)
![Слайд 58](attachments/osi/slide-058.png)
![Слайд 59](attachments/osi/slide-059.png)
![Слайд 60](attachments/osi/slide-060.png)
![Слайд 61](attachments/osi/slide-061.png)
![Слайд 62](attachments/osi/slide-062.png)
![Слайд 63](attachments/osi/slide-063.png)
![Слайд 64](attachments/osi/slide-064.png)
![Слайд 65](attachments/osi/slide-065.png)
![Слайд 66](attachments/osi/slide-066.png)
![Слайд 67](attachments/osi/slide-067.png)
![Слайд 68](attachments/osi/slide-068.png)
![Слайд 69](attachments/osi/slide-069.png)
![Слайд 70](attachments/osi/slide-070.png)
![Слайд 71](attachments/osi/slide-071.png)
![Слайд 72](attachments/osi/slide-072.png)
![Слайд 73](attachments/osi/slide-073.png)
![Слайд 74](attachments/osi/slide-074.png)
![Слайд 75](attachments/osi/slide-075.png)
![Слайд 76](attachments/osi/slide-076.png)
![Слайд 77](attachments/osi/slide-077.png)
![Слайд 78](attachments/osi/slide-078.png)
![Слайд 79](attachments/osi/slide-079.png)
![Слайд 80](attachments/osi/slide-080.png)
![Слайд 81](attachments/osi/slide-081.png)
![Слайд 82](attachments/osi/slide-082.png)
![Слайд 83](attachments/osi/slide-083.png)
![Слайд 84](attachments/osi/slide-084.png)
![Слайд 85](attachments/osi/slide-085.png)
![Слайд 86](attachments/osi/slide-086.png)
![Слайд 87](attachments/osi/slide-087.png)
![Слайд 88](attachments/osi/slide-088.png)
![Слайд 89](attachments/osi/slide-089.png)
![Слайд 90](attachments/osi/slide-090.png)
![Слайд 91](attachments/osi/slide-091.png)
![Слайд 92](attachments/osi/slide-092.png)
![Слайд 93](attachments/osi/slide-093.png)
![Слайд 94](attachments/osi/slide-094.png)
![Слайд 95](attachments/osi/slide-095.png)
![Слайд 96](attachments/osi/slide-096.png)
![Слайд 97](attachments/osi/slide-097.png)
![Слайд 98](attachments/osi/slide-098.png)
![Слайд 99](attachments/osi/slide-099.png)
![Слайд 100](attachments/osi/slide-100.png)
![Слайд 101](attachments/osi/slide-101.png)
![Слайд 102](attachments/osi/slide-102.png)
![Слайд 103](attachments/osi/slide-103.png)
![Слайд 104](attachments/osi/slide-104.png)
![Слайд 105](attachments/osi/slide-105.png)
![Слайд 106](attachments/osi/slide-106.png)
![Слайд 107](attachments/osi/slide-107.png)
![Слайд 108](attachments/osi/slide-108.png)
![Слайд 109](attachments/osi/slide-109.png)
![Слайд 110](attachments/osi/slide-110.png)
![Слайд 111](attachments/osi/slide-111.png)
![Слайд 112](attachments/osi/slide-112.png)
![Слайд 113](attachments/osi/slide-113.png)
![Слайд 114](attachments/osi/slide-114.png)
![Слайд 115](attachments/osi/slide-115.png)
![Слайд 116](attachments/osi/slide-116.png)
![Слайд 117](attachments/osi/slide-117.png)
![Слайд 118](attachments/osi/slide-118.png)
![Слайд 119](attachments/osi/slide-119.png)
![Слайд 120](attachments/osi/slide-120.png)
![Слайд 121](attachments/osi/slide-121.png)
![Слайд 122](attachments/osi/slide-122.png)
![Слайд 123](attachments/osi/slide-123.png)
![Слайд 124](attachments/osi/slide-124.png)
![Слайд 125](attachments/osi/slide-125.png)

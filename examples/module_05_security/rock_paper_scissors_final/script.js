document.addEventListener('DOMContentLoaded', initApp);

// --- Глобальні змінні стану гри та користувачів ---
let users =[]; // Масив об'єктів користувачів - ВИПРАВЛЕНО
let currentUser = null; // Об'єкт поточного залогіненого користувача
let gameHistory =[]; // Масив об'єктів історії ігор

const GAME_ITEMS = ['Камінь', 'Ножиці', 'Папір'];
const RPSLS_ITEMS = ['Камінь', 'Ножиці', 'Папір', 'Ящірка', 'Спок'];

// Правила для Камінь-Ножиці-Папір
const RPS_RULES = {
    'Камінь': 'Ножиці',
    'Ножиці': 'Папір',
    'Папір': 'Камінь'
};

// Правила для Камінь-Ножиці-Папір-Ящірка-Спок
const RPSLS_RULES = {
    'Камінь': ['Ножиці', 'Ящірка'],
    'Ножиці': ['Папір', 'Ящірка'],
    'Папір': ['Камінь', 'Спок'],
    'Ящірка': ['Спок', 'Папір'],
    'Спок': ['Ножиці', 'Камінь']
};

let currentItems = GAME_ITEMS; // Поточний набір предметів гри
let totalRounds = 0;
let currentRound = 0;
let playerScore = 0;
let computerScore = 0;

// Історія ходів гравця для адаптивного AI (для поточного користувача)
// Формат: { 'попередній_хід': { 'наступний_хід_1': count, 'наступний_хід_2': count } }
let playerMoveHistory = {};

// --- Елементи DOM ---
const authSection = document.getElementById('auth-section');
const welcomeSection = document.getElementById('welcome-section');
const gameSetupSection = document.getElementById('game-setup-section');
const gamePlaySection = document.getElementById('game-play-section');
const gameResultsSection = document.getElementById('game-results-section');
const gameHistorySection = document.getElementById('game-history-section');

const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');
const registrationMessage = document.getElementById('registration-message');
const loginMessage = document.getElementById('login-message');

const welcomeMessage = document.getElementById('welcome-message');
const statsWins = document.getElementById('stats-wins');
const statsLosses = document.getElementById('stats-losses');
const statsTies = document.getElementById('stats-ties');
const statsTotalGames = document.getElementById('stats-total-games');

const aiLevelSelect = document.getElementById('ai-level');
const gameItemsSelect = document.getElementById('game-items-select');
const numRoundsInput = document.getElementById('num-rounds');
const playerChoiceButtonsDiv = document.getElementById('player-choice-buttons');

const currentRoundDisplay = document.getElementById('current-round-display');
const totalRoundsDisplay = document.getElementById('total-rounds-display');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const roundResultDisplay = document.getElementById('round-result');
const playerChoiceDisplay = document.getElementById('player-choice-display');
const computerChoiceDisplay = document.getElementById('computer-choice-display');
const finalGameResultDisplay = document.getElementById('final-game-result');
const historyTableBody = document.querySelector('#history-table tbody');

// --- Функції-хелпери ---

/**
 * Хешує пароль за допомогою SHA-256.
 * @param {string} password - Пароль для хешування.
 * @returns {Promise<string>} Хеш пароля у шістнадцятковому форматі.
 */
async function hashPassword(password) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(password);
    // Web Crypto API (crypto.subtle) вимагає безпечного контексту (HTTPS)
    // або localhost для деяких операцій. Якщо ви запускаєте файл напряму (file://),
    // це може викликати помилку.
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
}

/**
 * Перевіряє доступність localStorage.
 * @param {string} type - Тип сховища ('localStorage' або 'sessionStorage').
 * @returns {boolean} True, якщо сховище доступне.
 */
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            (e.code === 22 || e.code === 1014) && // QuotaExceededError
            storage && storage.length!== 0
        );
    }
}

/**
 * Зберігає дані користувачів та історію ігор у localStorage.
 * Зберігає також XML та JSON представлення даних.
 */
function saveData() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

        // Зберігаємо дані у форматі JSON та XML для демонстрації
        localStorage.setItem('users_json_data', JSON.stringify(users, null, 2));
        localStorage.setItem('gameHistory_json_data', JSON.stringify(gameHistory, null, 2));

        localStorage.setItem('users_xml_data', jsonToXml(users, 'users', 'user'));
        localStorage.setItem('gameHistory_xml_data', jsonToXml(gameHistory, 'gameHistory', 'game'));
    } else {
        console.warn('localStorage недоступний.');
    }
}

/**
 * Завантажує дані користувачів та історію ігор з localStorage.
 */
function loadData() {
    if (storageAvailable('localStorage')) {
        const storedUsers = localStorage.getItem('users');
        const storedGameHistory = localStorage.getItem('gameHistory');

        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
        if (storedGameHistory) {
            gameHistory = JSON.parse(storedGameHistory);
        }
    }
}

/**
 * Конвертує JavaScript об'єкт/масив у XML рядок.
 * Дуже спрощена реалізація для демонстрації.
 * @param {Array|Object} data - Дані для конвертації.
 * @param {string} rootElement - Назва кореневого елемента XML.
 * @param {string} itemElement - Назва елемента для кожного елемента масиву.
 * @returns {string} XML рядок.
 */
function jsonToXml(data, rootElement = 'root', itemElement = 'item') {
    let xml = `<${rootElement}>`;
    if (Array.isArray(data)) {
        data.forEach(item => {
            xml += `<${itemElement}>`;
            for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    // Проста обробка вкладених об'єктів для демонстрації
                    if (typeof item[key] === 'object' && item[key] !== null) {
                        xml += `<${key}>${jsonToXml(item[key], '', '')}</${key}>`;
                    } else {
                        xml += `<${key}>${item[key]}</${key}>`;
                    }
                }
            }
            xml += `</${itemElement}>`;
        });
    } else if (typeof data === 'object' && data!== null) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (typeof data[key] === 'object' && data[key]!== null) {
                    xml += `<${key}>${jsonToXml(data[key], '', '')}</${key}>`;
                } else {
                    xml += `<${key}>${data[key]}</${key}>`;
                }
            }
        }
    }
    xml += `</${rootElement}>`;
    return xml;
}

/**
 * Конвертує XML рядок у JavaScript об'єкт.
 * Дуже спрощена реалізація для демонстрації.
 * @param {string} xmlString - XML рядок.
 * @returns {Object} JavaScript об'єкт.
 */
function xmlToJson(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const obj = {};
    const root = xmlDoc.documentElement;

    if (root) {
        Array.from(root.children).forEach(child => {
            if (child.children.length > 0) {
                const item = {};
                Array.from(child.children).forEach(grandchild => {
                    item[grandchild.tagName] = grandchild.textContent;
                });
                if (!obj[child.tagName]) {
                    obj[child.tagName] =child.textContent;
                }
                obj[child.tagName].push(item);
            } else {
                obj[child.tagName] = child.textContent;
            }
        });
    }
    return obj;
}

/**
 * Показує вказаний розділ та приховує інші.
 * @param {string} sectionId - ID розділу для відображення.
 */
function showSection(sectionId) {
    const sections =document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active-section');
            section.classList.remove('hidden-section');
        } else {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        }
    });
}

/**
 * Оновлює відображення статистики користувача.
 */
function updateStatsDisplay() {
    if (currentUser) {
        statsWins.textContent = currentUser.stats.wins;
        statsLosses.textContent = currentUser.stats.losses;
        statsTies.textContent = currentUser.stats.ties;
        statsTotalGames.textContent = currentUser.stats.totalGames;
    }
}

/**
 * Оновлює кнопки вибору предметів гри.
 */
function updatePlayerChoiceButtons() {
    playerChoiceButtonsDiv.innerHTML = '';
    currentItems.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item;
        button.classList.add('game-choice-btn');
        button.addEventListener('click', () => playRound(item));
        playerChoiceButtonsDiv.appendChild(button);
    });
}

// --- Функції управління користувачами ---

/**
 * Обробляє реєстрацію нового користувача.
 * @param {Event} event - Подія відправки форми.
 */
async function registerUser(event) {
    event.preventDefault();
    const pib = document.getElementById('reg-pib').value;
    const dob = document.getElementById('reg-dob').value;
    const email = document.getElementById('reg-email').value;
    const nickname = document.getElementById('reg-nickname').value;
    const password = document.getElementById('reg-password').value;

    if (users.some(user => user.nickname === nickname)) {
        registrationMessage.textContent = 'Користувач з таким ніком вже існує!';
        registrationMessage.classList.remove('success');
        console.log('Registration failed: Nickname already exists.');
        return;
    }

    let hashedPassword;
    try {
        hashedPassword = await hashPassword(password);
        console.log('Registered password hashed:', hashedPassword);
    } catch (error) {
        console.error('Error hashing password during registration:', error);
        registrationMessage.textContent = 'Помилка хешування пароля. Перевірте консоль браузера (F12). Можливо, Web Crypto API не працює у небезпечному контексті (наприклад, file://).';
        registrationMessage.classList.remove('success');
        return;
    }

    const newUser = {
        pib,
        dob,
        email,
        nickname,
        passwordHash: hashedPassword,
        stats: { wins: 0, losses: 0, ties: 0, totalGames: 0 },
        playerMoveHistory: {} // Історія ходів для адаптивного AI
    };
    users.push(newUser);
    saveData();
    registrationMessage.textContent = 'Реєстрація успішна! Тепер ви можете увійти.';
    registrationMessage.classList.add('success');
    registrationForm.reset();
    console.log('User registered:', newUser.nickname);
}

/**
 * Обробляє вхід користувача.
 * @param {Event} event - Подія відправки форми.
 */
async function loginUser(event) {
    event.preventDefault();
    const nickname = document.getElementById('login-nickname').value;
    const password = document.getElementById('login-password').value;

    console.log('Attempting login for nickname:', nickname);

    const user = users.find(u => u.nickname === nickname);

    if (!user) {
        loginMessage.textContent = 'Користувача не знайдено.';
        loginMessage.classList.remove('success');
        console.log('Login failed: User not found.');
        return;
    }
    console.log('Found user:', user.nickname);

    let hashedPassword;
    try {
        hashedPassword = await hashPassword(password);
        console.log('Entered password hashed:', hashedPassword);
    } catch (error) {
        console.error('Error hashing password during login:', error);
        loginMessage.textContent = 'Помилка хешування пароля. Перевірте консоль браузера (F12). Можливо, Web Crypto API не працює у небезпечному контексті (наприклад, file://).';
        loginMessage.classList.remove('success');
        return;
    }

    console.log('Stored password hash:', user.passwordHash);
    console.log('Comparison result:', user.passwordHash === hashedPassword);

    if (user.passwordHash === hashedPassword) {
        currentUser = user;
        // Ensure playerMoveHistory is initialized if it's null/undefined for older users
        currentUser.playerMoveHistory = currentUser.playerMoveHistory || {};
        playerMoveHistory = currentUser.playerMoveHistory; // Завантажуємо історію ходів гравця
        displayWelcomeMessage();
        showSection('welcome-section');
        loginMessage.textContent = ''; // Очистити повідомлення
        loginForm.reset();
        console.log('Login successful for user:', currentUser.nickname);
        // Зберігаємо останнього залогіненого користувача, щоб вітати його при наступному відкритті
        localStorage.setItem('lastLoggedInUser', currentUser.nickname);
    } else {
        loginMessage.textContent = 'Невірний пароль.';
        loginMessage.classList.remove('success');
        console.log('Login failed: Incorrect password.');
    }
}

/**
 * Відображає привітальне повідомлення та статистику для залогіненого користувача.
 */
function displayWelcomeMessage() {
    if (currentUser) {
        welcomeMessage.textContent = `Ласкаво просимо, ${currentUser.nickname}!`;
        updateStatsDisplay();
    }
}

/**
 * Обробляє вихід користувача.
 */
function logoutUser() {
    currentUser = null;
    playerMoveHistory = {}; // Очистити історію ходів гравця при виході
    localStorage.removeItem('lastLoggedInUser'); // Видалити останнього залогіненого користувача
    showSection('auth-section');
    console.log('User logged out.');
}

// --- Логіка гри ---

/**
 * Запускає нову гру.
 */
function startGame() {
    totalRounds = parseInt(numRoundsInput.value);
    currentRound = 0;
    playerScore = 0;
    computerScore = 0;
    roundResultDisplay.textContent = '';
    playerChoiceDisplay.textContent = '';
    computerChoiceDisplay.textContent = '';

    const selectedGameItems = gameItemsSelect.value;
    currentItems = selectedGameItems === 'rps'? GAME_ITEMS : RPSLS_ITEMS;
    updatePlayerChoiceButtons();

    updateGameUI();
    showSection('game-play-section');
    console.log(`Game started: ${totalRounds} rounds, AI level: ${aiLevelSelect.value}, Items: ${selectedGameItems}`);
}

/**
 * Оновлює інтерфейс гри (рахунок, номер раунду).
 */
function updateGameUI() {
    currentRoundDisplay.textContent = currentRound;
    totalRoundsDisplay.textContent = totalRounds;
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
}

/**
 * Визначає переможця раунду.
 * @param {string} playerChoice - Вибір гравця.
 * @param {string} computerChoice - Вибір робота.
 * @param {Object} rules - Правила гри (RPS_RULES або RPSLS_RULES).
 * @returns {string} 'player', 'computer', або 'tie'.
 */
function determineRoundWinner(playerChoice, computerChoice, rules) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    const playerWinsAgainst = rules[playerChoice];

    if (Array.isArray(playerWinsAgainst)) { // Для RPSLS
        if (playerWinsAgainst.includes(computerChoice)) {
            return 'player';
        }
    } else { // Для RPS
        if (playerWinsAgainst === computerChoice) {
            return 'player';
        }
    }
    return 'computer';
}

/**
 * Отримує вибір комп'ютера залежно від рівня AI.
 * @param {string} level - Рівень AI ('simple', 'stochastic', 'adaptive', 'super').
 * @returns {string} Вибір комп'ютера.
 */
function getComputerChoice(level) {
    switch (level) {
        case 'simple':
            return getComputerChoiceSimple();
        case 'stochastic':
            return getComputerChoiceStochastic();
        case 'adaptive':
            return getComputerChoiceAdaptive();
        case 'super':
            return getComputerChoiceSuper();
        default:
            return getComputerChoiceStochastic(); // За замовчуванням
    }
}

/**
 * Простий (детермінований) AI: завжди вибирає перший елемент.
 * @returns {string} Вибір комп'ютера.
 */
function getComputerChoiceSimple() {
    return currentItems[0]; // Завжди "Камінь" або перший елемент
}

/**
 * Середній (стохастичний) AI: випадковий вибір.
 * @returns {string} Вибір комп'ютера.
 */
function getComputerChoiceStochastic() {
    const randomIndex = Math.floor(Math.random() * currentItems.length);
    return currentItems[randomIndex];
}

/**
 * Складний (адаптивний) AI: аналізує історію ходів гравця.
 * @returns {string} Вибір комп'ютера.
 */
function getComputerChoiceAdaptive() {
    // Перевіряємо, чи є достатньо даних для аналізу
    if (currentUser && currentUser.lastPlayerChoice && playerMoveHistory[currentUser.lastPlayerChoice]) {
        const lastPlayerChoice = currentUser.lastPlayerChoice;
        const nextMoves = playerMoveHistory[lastPlayerChoice];

        let mostFrequentNextMove = null;
        let maxCount = 0;

        // Знаходимо найбільш ймовірний наступний хід гравця
        for (const move in nextMoves) {
            if (nextMoves[move] > maxCount) {
                maxCount = nextMoves[move];
                mostFrequentNextMove = move;
            }
        }

        if (mostFrequentNextMove) {
            // Робот вибирає те, що перемагає найбільш ймовірний хід гравця
            const rules = gameItemsSelect.value === 'rps'? RPS_RULES : RPSLS_RULES;
            // Шукаємо предмет, який перемагає mostFrequentNextMove
            for (const item of currentItems) {
                const winner = determineRoundWinner(item, mostFrequentNextMove, rules);
                if (winner === 'player') { // Якщо 'item' перемагає 'mostFrequentNextMove'
                    console.log(`Adaptive AI predicts player will play ${mostFrequentNextMove}, choosing ${item}`);
                    return item;
                }
            }
        }
    }
    // Якщо немає достатньо даних або патерн не виявлено, діємо випадково
    console.log('Adaptive AI: Not enough data or no clear pattern, falling back to stochastic.');
    return getComputerChoiceStochastic();
}

/**
 * Супер-робот (оптимальний стохастичний): вибирає кожен предмет з рівною ймовірністю.
 * @returns {string} Вибір комп'ютера.
 */
function getComputerChoiceSuper() {
    // Оптимальна стратегія GTO - вибирати кожен варіант з рівною ймовірністю
    const randomIndex = Math.floor(Math.random() * currentItems.length);
    console.log('Super AI: Choosing randomly for GTO strategy.');
    return currentItems[randomIndex];
}

/**
 * Виконує один раунд гри.
 * @param {string} playerChoice - Вибір гравця.
 */
function playRound(playerChoice) {
    if (currentRound >= totalRounds) {
        return; // Гра вже завершена
    }

    currentRound++;
    const aiLevel = aiLevelSelect.value;
    const computerChoice = getComputerChoice(aiLevel);
    const rules = gameItemsSelect.value === 'rps'? RPS_RULES : RPSLS_RULES;

    const result = determineRoundWinner(playerChoice, computerChoice, rules);

    playerChoiceDisplay.textContent = playerChoice;
    computerChoiceDisplay.textContent = computerChoice;

    let roundMessage = '';
    if (result === 'player') {
        playerScore++;
        roundMessage = 'Ви виграли раунд!';
    } else if (result === 'computer') {
        computerScore++;
        roundMessage = 'Робот виграв раунд!';
    } else {
        roundMessage = 'Нічия!';
    }
    roundResultDisplay.textContent = roundMessage;

    updateGameUI();
    console.log(`Round ${currentRound}: Player chose ${playerChoice}, Computer chose ${computerChoice}. Result: ${roundMessage}`);

    // Оновлення історії ходів гравця для адаптивного AI
    if (currentUser) {
        if (currentUser.lastPlayerChoice) {
            if (!playerMoveHistory[currentUser.lastPlayerChoice]) {
                playerMoveHistory[currentUser.lastPlayerChoice] = {};
            }
            if (!playerMoveHistory[currentUser.lastPlayerChoice][playerChoice]) {
                playerMoveHistory[currentUser.lastPlayerChoice][playerChoice] = 0;
            }
            playerMoveHistory[currentUser.lastPlayerChoice][playerChoice]++;
            console.log(`Updated player move history for ${currentUser.lastPlayerChoice} -> ${playerChoice}: ${playerMoveHistory[currentUser.lastPlayerChoice][playerChoice]}`);
        }
        currentUser.lastPlayerChoice = playerChoice; // Зберігаємо останній хід гравця
    }

    if (currentRound >= totalRounds) {
        endGame();
    }
}

/**
 * Завершує гру, визначає переможця та оновлює статистику.
 */
function endGame() {
    let finalResultText = '';
    let gameOutcome = ''; // 'win', 'loss', 'tie'

    if (playerScore > computerScore) {
        finalResultText = 'Вітаємо! Ви виграли гру!';
        gameOutcome = 'win';
    } else if (computerScore > playerScore) {
        finalResultText = 'На жаль, робот виграв гру.';
        gameOutcome = 'loss';
    } else {
        finalResultText = 'Гра завершилася нічиєю!';
        gameOutcome = 'tie';
    }
    finalGameResultDisplay.textContent = finalResultText;
    console.log(`Game ended. Final Score: Player ${playerScore}, Computer ${computerScore}. Outcome: ${finalResultText}`);

    // Оновлення статистики користувача
    if (currentUser) {
        currentUser.stats.totalGames++;
        if (gameOutcome === 'win') currentUser.stats.wins++;
        else if (gameOutcome === 'loss') currentUser.stats.losses++;
        else currentUser.stats.ties++;

        // Зберігаємо оновлену історію ходів гравця
        currentUser.playerMoveHistory = playerMoveHistory;

        // Додаємо запис до історії ігор
        gameHistory.push({
            date: new Date().toLocaleString(),
            nickname: currentUser.nickname,
            aiLevel: aiLevelSelect.value,
            rounds: totalRounds,
            playerScore: playerScore,
            computerScore: computerScore,
            result: gameOutcome
        });
        saveData(); // Зберігаємо оновлені дані
        console.log('User stats and game history updated and saved.');
    }

    showSection('game-results-section');
}

/**
 * Відображає історію ігор у таблиці.
 */
function displayGameHistory() {
    historyTableBody.innerHTML = ''; // Очистити попередні записи
    const userGames = gameHistory.filter(game => game.nickname === currentUser.nickname);

    userGames.forEach(game => {
        const row = historyTableBody.insertRow();
        row.insertCell().textContent = game.date;
        row.insertCell().textContent = game.aiLevel;
        row.insertCell().textContent = game.rounds;
        row.insertCell().textContent = game.result === 'win'? 'Перемога' :
                                       game.result === 'loss'? 'Поразка' : 'Нічия';
    });
    showSection('game-history-section');
    console.log(`Displaying game history for ${currentUser.nickname}.`);
}

// --- Ініціалізація та обробники подій ---
function initApp() {
    loadData();
    console.log('Users loaded:', users);
    console.log('Game History loaded:', gameHistory);

    // Перевірка, чи є залогінений користувач (наприклад, з попередньої сесії)
    const lastLoggedInNickname = localStorage.getItem('lastLoggedInUser');
    if (lastLoggedInNickname) {
        currentUser = users.find(u => u.nickname === lastLoggedInNickname);
        if (currentUser) {
            currentUser.playerMoveHistory = currentUser.playerMoveHistory || {}; // Ініціалізація, якщо відсутня
            playerMoveHistory = currentUser.playerMoveHistory;
            displayWelcomeMessage();
            showSection('welcome-section');
            console.log('Welcome back user:', currentUser.nickname);
        } else {
            // Користувача не знайдено в даних, очистити lastLoggedInUser і показати форму входу
            localStorage.removeItem('lastLoggedInUser');
            showSection('auth-section');
            console.log('Last logged in user not found in data, showing auth section.');
        }
    } else {
        showSection('auth-section');
        console.log('No last logged in user, showing auth section.');
    }

    // Обробники подій для форм
    registrationForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);

    // Обробники подій для кнопок навігації
    document.getElementById('start-new-game-btn').addEventListener('click', () => showSection('game-setup-section'));
    document.getElementById('view-game-history-btn').addEventListener('click', displayGameHistory);
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('back-to-welcome-btn').addEventListener('click', () => {
        updateStatsDisplay();
        showSection('welcome-section');
    });
    document.getElementById('play-again-btn').addEventListener('click', () => showSection('game-setup-section'));
    document.getElementById('back-to-welcome-from-results-btn').addEventListener('click', () => {
        updateStatsDisplay();
        showSection('welcome-section');
    });
    document.getElementById('back-from-history-btn').addEventListener('click', () => {
        updateStatsDisplay();
        showSection('welcome-section');
    });

    // Обробники для завантаження даних
    document.getElementById('download-json').addEventListener('click', () => {
        const usersJson = localStorage.getItem('users_json_data');
        const gameHistoryJson = localStorage.getItem('gameHistory_json_data');
        const combinedJson = {
            users: usersJson? JSON.parse(usersJson) :[],
            gameHistory: gameHistoryJson? JSON.parse(gameHistoryJson) : []
        };
        downloadFile(JSON.stringify(combinedJson, null, 2), 'game_data.json', 'application/json');
        console.log('Attempting to download JSON data.');
    });

    document.getElementById('download-xml').addEventListener('click', () => {
        const usersXml = localStorage.getItem('users_xml_data');
        const gameHistoryXml = localStorage.getItem('gameHistory_xml_data');
        // Для XML складніше об'єднати, тому просто надамо обидва
        let combinedXml = `<root>\n`;
        if (usersXml) combinedXml += `  ${usersXml.replace(/<\/?users>/g, '<users>')}\n`; // Замінюємо кореневий тег для вкладення
        if (gameHistoryXml) combinedXml += `  ${gameHistoryXml.replace(/<\/?gameHistory>/g, '<gameHistory>')}\n`; // Замінюємо кореневий тег для вкладення
        combinedXml += `</root>`;
        downloadFile(combinedXml, 'game_data.xml', 'application/xml');
        console.log('Attempting to download XML data.');
    });
}

/**
 * Функція для завантаження файлу.
 * @param {string} content - Вміст файлу.
 * @param {string} filename - Ім'я файлу.
 * @param {string} contentType - Тип вмісту (MIME-тип).
 */
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
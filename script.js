const heartButton = document.getElementById('heart-button');
const scoreElement = document.getElementById('love-score');
const phraseDisplay = document.getElementById('phrase-display');
const storyParts = document.querySelectorAll('.story-part');
const bodyElement = document.getElementById('body-element');
const fallingHeartsContainer = document.getElementById('falling-hearts-container');

let loveScore = 0;
let currentLevel = 1;
let storyUnlocked = 0; 
let phraseTimeout; 

const phrases = {
    5: "Первое касание. Просто отметим.",
    15: "Пятнадцать. Значит, не случайность.",
    25: "Кажется, тебе здесь комфортно.",
    40: "Сердце ещё держится. Пока что.",
    50: "Предлагаю чай. Или паузу. Или психотерапевта.",
    75: "Настойчиво. Уважаю.",
    100: "Если кто-то рядом — объясни им, что ты норм.",
    125: "Ты всё ещё здесь. Это уже что-то.",
    160: "Интересно, когда ты остановишься.",
    200: "Когда-нибудь ты расскажешь об этом детям. Или врачу.",
    260: "Кажется, мы оба застряли в этом интерфейсе.",
    300: "300. Шутка про тракториста актуальна как никогда 🥳",
    400: "Чем ты объяснишь это в резюме?",
    500: "Ты подходишь к этому с пугающей целеустремлённостью",
    700: "На этом этапе я просто наблюдаю.",
    1000: "Можно было написать диплом за это время.",
};


const levelMilestones = {
    2: 20,
    3: 50,
    4: 100, 
    5: 200,
};

const themeChangeLevel = 4; // Уровень, на котором меняется тема

const heartEmojis = ['❤️', '💖', '💗', '💓', '💕', '💞', '💘', '💝']; 

/** Обработчик клика по сердцу */
function handleHeartClick() {
    loveScore++;
    scoreElement.textContent = loveScore;

    heartButton.classList.add('clicked');
    setTimeout(() => {
        heartButton.classList.remove('clicked');
    }, 300); 

    if (navigator.vibrate) {
        navigator.vibrate(50); 
    }

    checkMilestones();
    createFlyingHeart(event);
}

function checkMilestones() {
    if (phrases[loveScore]) {
        showPhrase(phrases[loveScore]);
    }

    const nextLevel = currentLevel + 1;
    if (levelMilestones[nextLevel] && loveScore >= levelMilestones[nextLevel]) {
        currentLevel = nextLevel;
        bodyElement.classList.remove(`level-${currentLevel - 1}`); 
        bodyElement.classList.add(`level-${currentLevel}`); 
        console.log(`Достигнут уровень ${currentLevel}!`);

        heartButton.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        if (currentLevel === themeChangeLevel) {
            bodyElement.classList.add('dark-theme');
            console.log("Тема изменена на темную!");
        }
    }

    storyParts.forEach(part => {
        const unlockScore = parseInt(part.dataset.unlock, 10);
        if (!part.classList.contains('visible') && loveScore >= unlockScore) {
            part.classList.remove('hidden');
            setTimeout(() => part.classList.add('visible'), 50);
            storyUnlocked++;
            console.log(`Открыта глава истории ${storyUnlocked}`);
        }
    });
}

function showPhrase(text) {
    clearTimeout(phraseTimeout);
    phraseDisplay.textContent = text;
    phraseDisplay.classList.add('visible');
    phraseTimeout = setTimeout(() => {
        phraseDisplay.classList.remove('visible');
    }, 3500); 
}

function createFallingHeart() {
    const heart = document.createElement('span');
    heart.classList.add('heart-fall');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]; 
    const size = Math.random() * 1 + 0.8; 
    const duration = Math.random() * 5 + 5; 
    const delay = Math.random() * 2; 
    const startPosition = Math.random() * 95;
    heart.style.left = `${startPosition}vw`;
    heart.style.fontSize = `${size}rem`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.color = bodyElement.classList.contains('dark-theme') ? 'var(--heart-color-dark)' : 'var(--accent-color-light)';
    fallingHeartsContainer.appendChild(heart);
    setTimeout(() => {
        heart.remove();
    }, (duration + delay) * 1000);
}

function createFlyingHeart(clickEvent) {
    const flyCount = 3 + Math.floor(Math.random() * 3); 
    for (let i = 0; i < flyCount; i++) {
        const heartFly = document.createElement('span');
        heartFly.textContent = '💖'; 
        heartFly.style.position = 'absolute';
        heartFly.style.zIndex = '100';
        heartFly.style.fontSize = `${Math.random() * 10 + 10}px`;
        heartFly.style.color = 'var(--current-heart)';
        heartFly.style.userSelect = 'none';
        heartFly.style.pointerEvents = 'none';

        const startX = clickEvent.clientX;
        const startY = clickEvent.clientY;
        heartFly.style.left = `${startX}px`;
        heartFly.style.top = `${startY}px`;

        document.body.appendChild(heartFly);
        const angle = Math.random() * Math.PI * 2; 
        const distance = Math.random() * 50 + 50; 
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance - 50; 

        heartFly.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 400, 
            easing: 'ease-out'
        });

        setTimeout(() => {
            heartFly.remove();
        }, 1000);
    }
}

scoreElement.textContent = loveScore; 
setInterval(createFallingHeart, 500); 
heartButton.addEventListener('click', handleHeartClick);
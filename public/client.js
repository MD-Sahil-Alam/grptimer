const socket = io();

// Modal Elements
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const nameSubmit = document.getElementById('nameSubmit');
const appContent = document.getElementById('appContent');

// Timer Elements
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const otherTimersContainer = document.getElementById('otherTimers');
const msg = document.getElementById('msg');

let myTimerId = null;
let allUsers = {};

// Name Input Handling
nameSubmit.addEventListener('click', () => {
    const userName = nameInput.value.trim() || `User-${Math.random().toString(36).substr(2, 6)}`;
    
    // Hide modal and show app content
    nameModal.classList.add('hidden');
    appContent.classList.remove('hidden');
    
    // Register user with server
    socket.emit('registerUser', userName);
});

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculateElapsedTime(user) {
    if (!user.isRunning) return user.elapsedTime;
    return Date.now() - user.startTime;
}

function updateTimerDisplay(userId, elapsedTime) {
    const timerDisplay = document.getElementById(`display-${userId}`);
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(elapsedTime);
    }
}

function updateAllTimers() {
    Object.entries(allUsers).forEach(([userId, user]) => {
        if (userId !== myTimerId) {
            const elapsedTime = calculateElapsedTime(user);
            updateTimerDisplay(userId, elapsedTime);
        }
    });

    // Update my timer if running
    if (allUsers[myTimerId]) {
        const elapsedTime = allUsers[myTimerId].isRunning 
            ? calculateElapsedTime(allUsers[myTimerId]) 
            : allUsers[myTimerId].elapsedTime;
        display.textContent = formatTime(elapsedTime);
    }

    requestAnimationFrame(updateAllTimers);
}

function updateUserTimers(users) {
    allUsers = users;
    
    // Remove timers for disconnected users
    const currentUserIds = new Set(Object.keys(users));
    document.querySelectorAll('.user-timer').forEach(el => {
        const userId = el.id.replace('timer-', '');
        if (!currentUserIds.has(userId) && userId !== myTimerId) {
            el.remove();
        }
    });

    // Add timers for new users
    Object.keys(users).forEach(userId => {
        if (userId !== myTimerId && !document.getElementById(`timer-${userId}`)) {
            const user = users[userId];
            const userTimerEl = document.createElement('div');
            userTimerEl.id = `timer-${userId}`;
            userTimerEl.classList.add('user-timer');
            userTimerEl.innerHTML = `
                <div class="user-timer-id">${user.userName}</div>
                <div id="display-${userId}" class="timer-display">00:00:00</div>
            `;
            otherTimersContainer.appendChild(userTimerEl);
        }
    });

    // Ensure reset shows 00:00:00 for all users
    if (allUsers[myTimerId] && !allUsers[myTimerId].isRunning) {
        display.textContent = '00:00:00';
        document.querySelectorAll('.user-timer .timer-display').forEach(el => {
            el.textContent = '00:00:00';
        });
    }

    // Start continuous timer update
    requestAnimationFrame(updateAllTimers);

    const messages = [
        "🔥 You didn’t come this far to only come this far!",
        "🎯 Focus! Your future self will thank you.",
        "🚀 Believe in yourself and you’ll be unstoppable!",
        "📖 Studying now = flexing later. 💪",
        "💤 Sleep is important, but so is passing. Choose wisely. 😆",
        "📆 One day at a time. Just don’t make that day the exam day. 😅",
        "🚦 Success is like a traffic light: sometimes you have to wait, but you’ll get there!",
        "🥇 The only bad exam is the one you didn’t prepare for.",
        "⏰ Set goals, not alarms. (But also set alarms... don’t miss the exam! 😆)",
        "🤓 Nerd today, boss tomorrow!",
        "🔁 Study. Eat. Sleep. Repeat. (With some memes in between!)",
        "📌 If Plan A fails, remember there are 25 more letters in the alphabet!",
        "💪 Hard work beats talent when talent doesn’t work hard.",
        "🎢 Studying is like a rollercoaster: terrifying at first, but fun when it’s over!",
        "📊 Your grades don’t define you, but they do define whether you’ll party after exams! 😜",
        "👀 If you're looking at this message instead of studying, it's time to get back to work! 😉",
        "📝 The best way to predict your future is to create it.",
        "🎓 The tassel is worth the hassle!",
        "💭 Dream big, study hard, achieve more!",
        "🦸‍♂ Be the hero your GPA needs!",
        "Work hard, nap harder. 😴",
        "Dream big, but set an alarm. ⏰",
        "Slow progress is still progress! 🚀",
        "Stay positive… test negative. 😆",
        "Do it now! Sometimes ‘later’ becomes ‘never’. 🔥",
        "The comeback is always stronger than the setback! 💪",
        "Doubt kills more dreams than failure ever will! 🎯",
        "You didn’t wake up today to be mediocre! 🌟",
        "You can do it. Coffee helps. ☕",
        "Make today so awesome that yesterday gets jealous. 😎",
        "Study like your WiFi depends on it. 📶",
        "Success is 1% inspiration, 99% caffeine. ☕🔥",
        "Be stubborn about your goals, flexible about your methods. 🔄",
        "One chapter at a time, one victory at a time. 📖🏆",
        "Mistakes are proof you’re trying. Keep going! ✨",
        "If it’s easy, you’re not learning. Challenge yourself! 💡",
        "Eyes on the goal, not on the clock. ⏳",
        "You don’t have to be great to start, but you have to start to be great. 🚀",
        "Keep pushing! Future you will thank you. 🙌",
        "Your only competition is yesterday’s you. 💪",
        "Every expert was once a beginner. 📚",
        "Study like you’ve got something to prove. 🔥",
        "Success is rented, and rent is due every day! 🏆",
        "Turn ‘I can’t’ into ‘Watch me’. 👀🔥",
        "Smart work beats hard work when hard work isn’t smart. 🧠",
        "Study now, flex later. 💪😎",
        "Don’t stop when you’re tired. Stop when you’re done! 🏁",
        "The grind never lies—results will show. 💯",
        "Good things come to those who work for it! ⚡",
        "Winners focus on winning, losers focus on winners. Stay in your lane! 🏎",
        "Discipline beats motivation every time. Stay consistent! 🎯",
        "Small steps every day lead to big results. 📈",
        "One more page, one more step, one more win! 📖🥇",
        "The harder you work now, the easier your future will be. 🚀",
        "Focus. Hustle. Repeat. 💼🔥",
        "Results happen over time, not overnight. Keep going! ⏳",
        "Breaks are okay, quitting isn’t! 🛑",
        "Study like your grades depend on it… because they do! 📚😆",
        "Stars don’t shine without darkness. Keep grinding! 🌟",
        "Less complaining, more training! 💪",
        "If knowledge is power, you’re about to be unstoppable! ⚡",
        "Your brain is your best investment. Train it! 🧠💰",
        "School may be tough, but so are you! 💥",
        "The secret to getting ahead is getting started. 🚦",
        "You’re not behind, you’re just getting started! ⏳🔥",
        "Exam season: where sleep is a myth, syllabus is infinite, and panic is real! 😵📚",
        "Study like you’ve never partied, so you can party like you’ve never studied! 🎉📖",
        "The syllabus isn’t infinite… it just feels like it! 📜😩",
        "Board exams: The only time students voluntarily wake up at 4 AM. ⏰😴",
        "Your brain has auto-updated to ‘exam mode.’ Please do not shut down! 🧠⚠",
        "One does not simply complete the entire syllabus before the exam! 🤯📖",
        "If overthinking was a subject, we’d all top the boards! 🤔🥇",
        "First hour of studying: Productive. Next five hours: Searching for the perfect pen. ✍😆",
        "You know it's serious when even the backbenchers are asking doubts! 🤓📝",
        "Textbooks are like horror movies: the more you go through them, the scarier they get! 📚👻",
        "When your brain starts revising the syllabus in your dreams, you know it's getting real! 💤📖",
        "Exams: The only time we wish we had Hermione’s Time Turner! ⏳✨",
        "That moment when your mind is blanker than your answer sheet! 😶📝",
        "Why do we call it ‘Multiple Choice’? I have zero choice, I don’t know any of them! ❌😂",
        "Board exams: When even the school topper starts questioning life choices! 🤯📚",
        "Last-minute revision: Speed-reading your entire textbook in 30 minutes! 🏃‍♂📖",
        "Dear exams, can we just mutually ghost each other? 👻😅",
        "Me: plans to study at 5 PM Also me at 4:59 PM: ‘Tomorrow is a better idea!’ 🤡🕰",
        "Boards are like horror movies. No matter how much you prepare, the ending still shocks you! 😱📜",
        "‘I’ll wake up early and study’ – The biggest lie every student tells themselves! 😂⏰",
        "Exam tip: Read the question twice. Cry once. Then guess the answer. 🤷‍♂😭",
        "Exams are like WiFi signals—strong at the start, weak in the middle, and gone by the end! 📶📉",
        "Writing ‘God bless me’ at the end of your answer sheet because that’s your last hope! 🙏😂",
        "First five minutes of the exam: ‘I got this!’ Next five minutes: ‘What language is this?’ 🤨📖",
        "Fun fact: The syllabus is inversely proportional to the time left before the exam. ⏳📚",
        "That one friend who says, ‘I haven’t studied anything’ but scores 95%! 😤📖",
        "Parents before exams: ‘Beta, study!’ Parents after exams: ‘Beta, result?’ 📢😬",
        "My brain during exams: 1% syllabus, 99% song lyrics! 🎶🤦‍♂",
        "The only thing that increases before exams? My ability to procrastinate! ⏳😅",
        "Exam hall reality: Brain says ‘Write something.’ Hand says ‘Nothing to write.’ 🤷‍♂✍",
        "Me reading the first question in the exam: ‘Have I even studied this subject?’ 🤔📜",
        "One subject left, but motivation is already gone! 🏃‍♂💨",
        "Exams: The only time we Google ‘how to finish a syllabus in one night’ 🌙📚",
        "That moment when you see a question and realize you studied everything except that! 😭📖",
        "The goal was to complete the syllabus. The reality? Completed 100 episodes of my favorite show! 📺🍿",
        "Studying with full focus... until I remember a childhood memory and get lost in thoughts! 😆🧠",
        "During exams: Stares at the wall for 10 minutes, then panics 😵💭",
        "Me: ‘I will not procrastinate this time.’ Also me: ‘Let me take a small 3-hour break first!’ 😆⏳",
        "Exam hall be like: ‘Why is everyone writing so much? What do they know that I don’t?’ 😟📝",
        "Exams are proof that time flies the fastest when you are unprepared! ⏰💨",
    ];
    
    function startPeriodicMessages() {
        setInterval(() => {
            // Select a random message
            const randomIndex = Math.floor(Math.random() * messages.length);
            msg.textContent = messages[randomIndex];
        }, 180000); // 3 minutes
    }
    
    // Call this function after user registration or when starting the timer
    startPeriodicMessages();
    
}

startBtn.addEventListener('click', () => {
    socket.emit('startTimer');
});

pauseBtn.addEventListener('click', () => {
    socket.emit('pauseTimer');
});

resetBtn.addEventListener('click', () => {
    socket.emit('resetTimer');
    display.textContent = '00:00:00';
});

// When connection is established
socket.on('connect', () => {
    myTimerId = socket.id;
});

// Update all users' timers
socket.on('updateUsers', (users) => {
    updateUserTimers(users);
});
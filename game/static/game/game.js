let p1Score = 0;
let p2Score = 0;
let knotPosition = 50; // 50% is center
const maxScoreDiff = 10; // 10 points advantage wins

const knot = document.getElementById('knot');
const startScreen = document.getElementById('start-screen');
const winnerOverlay = document.getElementById('winner-overlay');
const winnerText = document.getElementById('winner-text');

const p1ProblemDisplay = document.getElementById('p1-problem');
const p1Input = document.getElementById('p1-input');
const p1ScoreDisplay = document.getElementById('p1-score');
const p1Feedback = document.getElementById('p1-feedback');

const p2ProblemDisplay = document.getElementById('p2-problem');
const p2Input = document.getElementById('p2-input');
const p2ScoreDisplay = document.getElementById('p2-score');
const p2Feedback = document.getElementById('p2-feedback');

const kidP1 = document.getElementById('kid-p1');
const kidP2 = document.getElementById('kid-p2');
const timerDisplay = document.getElementById('turn-timer');
const timeLeftDisplay = document.getElementById('time-left');

const qCounterDisplay = document.getElementById('q-counter');
const qCurrentDisplay = document.getElementById('q-current');
const MAX_QUESTIONS = 50;
let questionsPlayed = 0;

// Confetti Setup
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let confettiActive = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createConfetti() {
    const colors = ['#06b6d4', '#ec4899', '#fde047', '#4ade80', '#a855f7'];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            dx: Math.random() * 4 - 2,
            dy: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function drawConfetti() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.y += p.dy;
        p.x += p.dx;

        if (p.y < canvas.height) {
            activeParticles++;
        }
    });

    particles = particles.filter(p => p.y < canvas.height);

    if (activeParticles > 0) {
        requestAnimationFrame(drawConfetti);
    } else {
        confettiActive = false;
    }
}

function boomConfetti() {
    confettiActive = true;
    createConfetti();
    drawConfetti();
}

let p1CurrentAnswer = 0;
let p2CurrentAnswer = 0;

let p1CurrentText = '';
let p2CurrentText = '';

let gameActive = false;
let currentPlayer = 'p1';
let timeLeft = 5;
let timerInterval = null;

function generateProblem() {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;

    switch (op) {
        case '+':
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * a); // ensure positive answer
            answer = a - b;
            break;
        case '*':
            a = Math.floor(Math.random() * 10) + 2;
            b = Math.floor(Math.random() * 10) + 2;
            answer = a * b;
            break;
    }
    return { text: `${a} ${op} ${b}`, answer: answer };
}

function startGame() {
    p1Score = 0;
    p2Score = 0;
    knotPosition = 50;
    updateUI();

    startScreen.classList.add('hidden');
    winnerOverlay.classList.add('hidden');
    timerDisplay.classList.remove('hidden');
    qCounterDisplay.classList.remove('hidden');

    questionsPlayed = 0;
    qCurrentDisplay.innerText = questionsPlayed + 1;

    document.querySelector('.rope-system').style.zIndex = '';
    kidP1.classList.remove('losing', 'winner');
    kidP2.classList.remove('losing', 'winner');
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];

    // Clear inputs
    p1Input.value = '';
    p2Input.value = '';

    gameActive = true;

    setProblem('p1');
    setProblem('p2');

    startTurn('p1');
}

function startTurn(player) {
    if (!gameActive) return;

    if (questionsPlayed >= MAX_QUESTIONS) {
        checkGameEnd();
        return;
    }

    qCurrentDisplay.innerText = questionsPlayed + 1;

    currentPlayer = player;
    p1Input.disabled = true;
    p2Input.disabled = true;

    if (player === 'p1') {
        p1Input.disabled = false;
        p1Input.focus();
        p1ProblemDisplay.innerText = p1CurrentText;
        p2ProblemDisplay.innerText = '???';
    } else {
        p2Input.disabled = false;
        p2Input.focus();
        p2ProblemDisplay.innerText = p2CurrentText;
        p1ProblemDisplay.innerText = '???';
    }

    clearInterval(timerInterval);
    timeLeft = 5;
    timeLeftDisplay.innerText = timeLeft;
    timerDisplay.classList.remove('running-out');

    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.innerText = timeLeft;

        if (timeLeft <= 2) {
            timerDisplay.classList.add('running-out');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeUp(player);
        }
    }, 1000);
}

function timeUp(player) {
    showFeedback(player, false);
    const inputEl = player === 'p1' ? p1Input : p2Input;
    inputEl.value = '';

    questionsPlayed++;
    if (checkGameEnd()) return;

    setProblem(player);
    const nextPlayer = player === 'p1' ? 'p2' : 'p1';
    startTurn(nextPlayer);
}

function endGame(winner) {
    gameActive = false;
    clearInterval(timerInterval);
    p1Input.disabled = true;
    p2Input.disabled = true;
    timerDisplay.classList.add('hidden');
    qCounterDisplay.classList.add('hidden');

    if (winner === 'Tie') {
        winnerText.innerText = `It's a Tie!`;
    } else {
        winnerText.innerText = `${winner} Wins!`;
    }

    winnerOverlay.classList.remove('hidden');

    document.querySelector('.rope-system').style.zIndex = '101';

    if (winner === 'Player 1') {
        kidP2.classList.add('losing');
        kidP1.classList.add('winner');
    } else if (winner === 'Player 2') {
        kidP1.classList.add('losing');
        kidP2.classList.add('winner');
    } else {
        // Tie: Both kids celebrate
        kidP1.classList.add('winner');
        kidP2.classList.add('winner');
    }

    boomConfetti();
}

function checkGameEnd() {
    if (knotPosition <= 0) {
        knotPosition = 0;
        updateUI();
        endGame('Player 1');
        return true;
    } else if (knotPosition >= 100) {
        knotPosition = 100;
        updateUI();
        endGame('Player 2');
        return true;
    }

    if (questionsPlayed >= MAX_QUESTIONS) {
        if (p1Score > p2Score) endGame('Player 1');
        else if (p2Score > p1Score) endGame('Player 2');
        else endGame('Tie');
        return true;
    }

    return false;
}

function updateUI() {
    p1ScoreDisplay.innerText = p1Score;
    p2ScoreDisplay.innerText = p2Score;
    knot.style.left = `${knotPosition}%`;
}

function showFeedback(player, isCorrect) {
    const feedbackEl = player === 'p1' ? p1Feedback : p2Feedback;
    feedbackEl.innerText = isCorrect ? 'Correct! +1' : 'Wrong!';
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;

    setTimeout(() => {
        feedbackEl.style.opacity = '0';
    }, 1000);
}

function setProblem(player) {
    const prob = generateProblem();
    if (player === 'p1') {
        p1CurrentText = prob.text;
        p1CurrentAnswer = prob.answer;
        p1ProblemDisplay.innerText = currentPlayer === 'p1' ? p1CurrentText : '???';
    } else {
        p2CurrentText = prob.text;
        p2CurrentAnswer = prob.answer;
        p2ProblemDisplay.innerText = currentPlayer === 'p2' ? p2CurrentText : '???';
    }
}

function handleInput(e, player) {
    if (!gameActive) return;
    if (player !== currentPlayer) return;

    if (e.key === 'Enter') {
        clearInterval(timerInterval);
        const inputEl = player === 'p1' ? p1Input : p2Input;
        const val = parseInt(inputEl.value);
        const correctAns = player === 'p1' ? p1CurrentAnswer : p2CurrentAnswer;

        if (!isNaN(val) && val === correctAns) {
            // Correct
            showFeedback(player, true);
            if (player === 'p1') {
                p1Score++;
                knotPosition -= (50 / maxScoreDiff); // Move left towards 0%
                document.getElementById('p1-section').classList.add('active');
                kidP1.classList.add('pulling');
                setTimeout(() => {
                    document.getElementById('p1-section').classList.remove('active');
                    kidP1.classList.remove('pulling');
                }, 400);
            } else {
                p2Score++;
                knotPosition += (50 / maxScoreDiff); // Move right towards 100%
                document.getElementById('p2-section').classList.add('active');
                kidP2.classList.add('pulling');
                setTimeout(() => {
                    document.getElementById('p2-section').classList.remove('active');
                    kidP2.classList.remove('pulling');
                }, 400);
            }

            inputEl.value = '';
            updateUI();

        } else {
            // Wrong answer or empty submission
            showFeedback(player, false);
            inputEl.value = '';
        }

        questionsPlayed++;
        if (checkGameEnd()) return;

        // Always set a new problem and switch turn
        setProblem(player);
        const nextPlayer = player === 'p1' ? 'p2' : 'p1';
        startTurn(nextPlayer);
    }
}

p1Input.addEventListener('keyup', (e) => handleInput(e, 'p1'));
p2Input.addEventListener('keyup', (e) => handleInput(e, 'p2'));

// Small helper to switch focus easily if using same keyboard
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    // Map left shift or something to focus left, right shift to focus right?
    // Not strictly necessary, players can just click in their input box.
});

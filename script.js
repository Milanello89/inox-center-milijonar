// INOX CENTER Milijonar - kviz igra
// nastavitve
const SHEETS_ENDPOINT = ''; // nastavi na URL svoje Google Apps Script funkcije (konča se z /exec) ali pusti prazno za lokalno shranjevanje

// seznam vprašanj (15)
const QUESTIONS = [
  {
    question: 'Kaj določa kakovost inox jekla?',
    answers: [
      'Vsebnost kroma',
      'Barva površine',
      'Debelina premaza',
      'Način skladiščenja'
    ],
    correct: 0
  },
  {
    question: 'Serija aluminijevih zlitin 6061 spada v katero skupino?',
    answers: [
      'Serija 5xxx',
      'Serija 6xxx',
      'Serija 2xxx',
      'Serija 7xxx'
    ],
    correct: 1
  },
  {
    question: 'Kaj pomeni kratica TIG pri varjenju?',
    answers: [
      'Varjenje z volframom v inertnem plinu',
      'Varjenje z aktivnim plinom',
      'Varjenje z elektrodno žico',
      'Varjenje pod praškom'
    ],
    correct: 0
  },
  {
    question: 'Zakaj je inox odporen proti koroziji?',
    answers: [
      'Zaradi nizke gostote',
      'Zaradi pasivne kromove oksidne plasti',
      'Zaradi visoke vsebnosti ogljika',
      'Zaradi dodanega bakra'
    ],
    correct: 1
  },
  {
    question: 'Kolikšen je največji dovoljeni odstotek ogljika v avstenitnem inoxu AISI 304?',
    answers: [
      '0,08 %',
      '0,5 %',
      '1,2 %',
      '2,0 %'
    ],
    correct: 0
  },
  {
    question: 'Kateri dejavnik najbolj vpliva na težo aluminijaste pločevine?',
    answers: [
      'Barva pločevine',
      'Debelina pločevine',
      'Način rezanja',
      'Temperatura okolice'
    ],
    correct: 1
  },
  {
    question: 'Oznaka EN 1.4301 ustreza kateremu ameriškemu standardu?',
    answers: [
      'AISI 304',
      'AISI 316',
      'AISI 321',
      'AISI 430'
    ],
    correct: 0
  },
  {
    question: 'Zakaj je aluminij lažji od železa?',
    answers: [
      'Zaradi nižje gostote',
      'Zaradi višje tališča',
      'Zaradi večje trdote',
      'Zaradi višje električne prevodnosti'
    ],
    correct: 0
  },
  {
    question: 'Kako se imenuje postopek poliranja inoxa do ogledalnega sijaja?',
    answers: [
      'Elektropoliranje',
      'Peskarenje',
      'Brušenje s smirkovim papirjem',
      'Eloksiranje'
    ],
    correct: 0
  },
  {
    question: 'Katera toleranca je tesnejša?',
    answers: [
      '±0,1 mm',
      '±0,5 mm',
      '±1,0 mm',
      '±2,0 mm'
    ],
    correct: 0
  },
  {
    question: 'Pri varjenju aluminija se najpogosteje uporablja kateri inertni plin?',
    answers: [
      'Argon',
      'Kisik',
      'Dušik',
      'Ogljikov dioksid'
    ],
    correct: 0
  },
  {
    question: 'Kaj pomeni oznaka "2B" pri površini inox pločevine?',
    answers: [
      'Kladirano',
      'Hladno valjano s svetlo, rahlo sijajno površino',
      'Brušeno do grobe strukture',
      'Eloksirano'
    ],
    correct: 1
  },
  {
    question: 'Približna gostota nerjavnega jekla je:',
    answers: [
      '7,9 g/cm³',
      '1,2 g/cm³',
      '2,7 g/cm³',
      '5,0 g/cm³'
    ],
    correct: 0
  },
  {
    question: 'Kako vpliva povečanje debeline aluminijaste plošče na njeno upogibno togost?',
    answers: [
      'Togost narašča s tretjo potenco debeline',
      'Togost narašča linearno',
      'Togost se ne spremeni',
      'Togost se zmanjša'
    ],
    correct: 0
  },
  {
    question: 'Kaj se zgodi z varom, če se med varjenjem aluminija ne odstrani oksidna plast?',
    answers: [
      'Var bo porozen in šibkejši',
      'Var bo trši',
      'Var bo bolj svetel',
      'Var se sploh ne bo oblikoval'
    ],
    correct: 0
  }
];

let playerName = '';
let currentIndex = 0;
let score = 0;
let usedFifty = false;
let usedAudience = false;
let usedFriend = false;

// elementi
const menuSection = document.getElementById('menu');
const gameSection = document.getElementById('game');
const resultSection = document.getElementById('result');
const leaderboardSection = document.getElementById('leaderboard');

const startBtn = document.getElementById('startBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const backBtn = document.getElementById('backBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');

const questionNumberSpan = document.getElementById('questionNumber');
const scoreDisplay = document.getElementById('scoreDisplay');
const questionText = document.getElementById('questionText');
const answerList = document.getElementById('answerList');

const fiftyBtn = document.getElementById('fiftyBtn');
const audienceBtn = document.getElementById('audienceBtn');
const friendBtn = document.getElementById('friendBtn');

const resultMessage = document.getElementById('resultMessage');
const leaderboardContent = document.getElementById('leaderboardContent');
const playerNameInput = document.getElementById('playerName');

// helper functions for UI
function show(section) {
  menuSection.classList.add('hidden');
  gameSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  leaderboardSection.classList.add('hidden');
  section.classList.remove('hidden');
}

// začetek igre
function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('Prosim vnesite svoje ime!');
    return;
  }
  currentIndex = 0;
  score = 0;
  usedFifty = false;
  usedAudience = false;
  usedFriend = false;
  // omogoči lifeline gumbe
  fiftyBtn.disabled = false;
  audienceBtn.disabled = false;
  friendBtn.disabled = false;
  fiftyBtn.classList.remove('disabled');
  audienceBtn.classList.remove('disabled');
  friendBtn.classList.remove('disabled');
  show(gameSection);
  updateStatus();
  displayQuestion();
}

function updateStatus() {
  questionNumberSpan.textContent = (currentIndex + 1) + '/' + QUESTIONS.length;
  scoreDisplay.textContent = 'Točke: ' + score;
}

function displayQuestion() {
  const current = QUESTIONS[currentIndex];
  questionText.textContent = current.question;
  answerList.innerHTML = '';
  current.answers.forEach((text, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', () => selectAnswer(idx));
    li.appendChild(btn);
    answerList.appendChild(li);
  });
}

function selectAnswer(selected) {
  const current = QUESTIONS[currentIndex];
  const buttons = answerList.querySelectorAll('button');
  // onemogoči vse
  buttons.forEach(btn => btn.disabled = true);
  // označi odgovore
  buttons.forEach((btn, idx) => {
    if (idx === current.correct) {
      btn.classList.add('correct');
    } else if (idx === selected) {
      btn.classList.add('incorrect');
    }
  });
  // posodobi rezultat
  if (selected === current.correct) {
    score += 100; // 100 točk za pravilni odgovor
  }
  scoreDisplay.textContent = 'Točke: ' + score;
  // čez kratek čas preidi na naslednje vprašanje ali konec
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < QUESTIONS.length) {
      updateStatus();
      displayQuestion();
    } else {
      endGame();
    }
  }, 1500);
}

function endGame() {
  show(resultSection);
  resultMessage.textContent = `Čestitke, ${playerName}! Dosegli ste ${score} točk.`;
  // shrani rezultat
  saveScore(playerName, score);
}

// lifelines
function useFifty() {
  if (usedFifty) return;
  usedFifty = true;
  fiftyBtn.disabled = true;
  fiftyBtn.classList.add('disabled');
  const current = QUESTIONS[currentIndex];
  const wrongIndexes = [];
  current.answers.forEach((_, idx) => {
    if (idx !== current.correct) wrongIndexes.push(idx);
  });
  // naključno izberi dve napačni za odstranitev
  shuffleArray(wrongIndexes);
  const toRemove = wrongIndexes.slice(0, 2);
  const buttons = answerList.querySelectorAll('button');
  toRemove.forEach(idx => {
    buttons[idx].disabled = true;
    buttons[idx].classList.add('disabled');
  });
}

function useAudience() {
  if (usedAudience) return;
  usedAudience = true;
  audienceBtn.disabled = true;
  audienceBtn.classList.add('disabled');
  const current = QUESTIONS[currentIndex];
  // pripravi naključno glasovanje: pravilen odgovor dobi najvišjo podporo
  const votes = new Array(current.answers.length).fill(0);
  let totalVotes = 100;
  // dodeli največ glasov pravilnemu
  const correctVotes = Math.floor(40 + Math.random() * 30); // 40–70 %
  votes[current.correct] = correctVotes;
  totalVotes -= correctVotes;
  // razdeli preostanek
  for (let i = 0; i < current.answers.length; i++) {
    if (i === current.correct) continue;
    if (i === current.answers.length - 1) {
      votes[i] = totalVotes;
    } else {
      const v = Math.floor(Math.random() * (totalVotes / 2));
      votes[i] = v;
      totalVotes -= v;
    }
  }
  // pokaži glasovanje
  let message = 'Glasovi občinstva:\n';
  votes.forEach((v, idx) => {
    message += `${String.fromCharCode(65 + idx)}: ${v}%\n`;
  });
  alert(message);
}

function useFriend() {
  if (usedFriend) return;
  usedFriend = true;
  friendBtn.disabled = true;
  friendBtn.classList.add('disabled');
  const current = QUESTIONS[currentIndex];
  // prijatelj ima 75 % možnosti, da ve pravilen odgovor
  const knows = Math.random() < 0.75;
  let suggested;
  if (knows) {
    suggested = current.correct;
  } else {
    // izberi napačni odgovor
    const wrong = [];
    current.answers.forEach((_, idx) => {
      if (idx !== current.correct) wrong.push(idx);
    });
    suggested = wrong[Math.floor(Math.random() * wrong.length)];
  }
  alert(`Prijatelj pravi, da je odgovor ${String.fromCharCode(65 + suggested)}.`);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// shranjevanje rezultatov
function saveScore(name, score) {
  if (SHEETS_ENDPOINT) {
    // pošlji na Google Sheet
    fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, date: new Date().toISOString() })
    }).catch(err => console.error('Napaka pri shranjevanju rezultata:', err));
  } else {
    // lokalno shranjevanje
    const scores = JSON.parse(localStorage.getItem('inoxScores') || '[]');
    scores.push({ name, score, date: new Date().toISOString() });
    localStorage.setItem('inoxScores', JSON.stringify(scores));
  }
}

async function loadScores() {
  if (SHEETS_ENDPOINT) {
    try {
      const res = await fetch(SHEETS_ENDPOINT);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error('Napaka pri branju rezultatov:', err);
      return [];
    }
  } else {
    const scores = JSON.parse(localStorage.getItem('inoxScores') || '[]');
    return scores;
  }
}

async function showLeaderboard() {
  show(leaderboardSection);
  leaderboardContent.textContent = 'Nalaganje ...';
  const scores = await loadScores();
  // razvrsti po točkah, nato po datumu (novejše višje)
  scores.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
  let html = '';
  if (scores.length === 0) {
    html = '<p>Ni shranjenih rezultatov.</p>';
  } else {
    html += '<table><thead><tr><th>Mesto</th><th>Igralec</th><th>Točke</th><th>Datum</th></tr></thead><tbody>';
    scores.slice(0, 10).forEach((item, idx) => {
      const date = new Date(item.date).toLocaleDateString();
      html += `<tr><td>${idx + 1}</td><td>${item.name}</td><td>${item.score}</td><td>${date}</td></tr>`;
    });
    html += '</tbody></table>';
  }
  leaderboardContent.innerHTML = html;
}

// gumbi
startBtn.addEventListener('click', startGame);
leaderboardBtn.addEventListener('click', () => showLeaderboard());
backBtn.addEventListener('click', () => show(menuSection));
playAgainBtn.addEventListener('click', () => show(menuSection));
viewLeaderboardBtn.addEventListener('click', () => showLeaderboard());
fiftyBtn.addEventListener('click', useFifty);
audienceBtn.addEventListener('click', useAudience);
friendBtn.addEventListener('click', useFriend);

// inicializacija
show(menuSection);

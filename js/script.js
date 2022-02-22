const diceBoardEl = document.getElementById("dice-board");
const rollBtn = document.getElementById("roll-btn");
const confirmBtn = document.getElementById("confirm");
const scoreboardEl = document.getElementById("scoreboard");
const playerScoreEl = document.getElementById("score");

rollBtn.addEventListener('click', handleRollDice);
diceBoardEl.addEventListener('click', handleDiceClick);
confirmBtn.addEventListener('click', handleConfirmChoice);

let currentRoll, totalScore;
const dice = {}
const scoreboard = {
  0: {
    requires: 1, //flat score will be hardcoded, otherwise this will be a multiple
    upperSection: true,
    display: "1",
    scoring: "Sum all 1s"
  },
  1: {
    requires: 2,
    upperSection: true,
    display: "2",
    scoring: "Sum all 2s"
  },
  2: {
    requires: 3,
    upperSection: true,
    display: "3",
    scoring: "Sum all 3s"
  },
  3: {
    requires: 4,
    upperSection: true,
    display: "4",
    scoring: "Sum all 4s"
  },
  4: {
    requires: 5,
    upperSection: true,
    display: "5",
    scoring: "Sum all 5s"
  },
  5: {
    requires: 6,
    upperSection: true,
    display: "6",
    scoring: "Sum all 6s"
  }, 
  6: {
    upperSection: false,
    display: "Three of a Kind",
    scoring: "Sum all dice"
  },
  7: {
    upperSection: false,
    display: "Four of a Kind",
    scoring: "Sum all dice"
  },
  8: {
    flatScore: 25,
    upperSection: false,
    display: "Full House",
    scoring: "25 points"
  },
  9: {
    flatScore: 30,
    upperSection: false,
    display: "Small Straight",
    scoring: "30 points"
  },
  10: {
    flatScore: 40,
    upperSection: false,
    display: "Large Straight",
    scoring: "40 points"
  },
  11: {
    flatScore: 50,
    upperSection: false,
    display: "Yahtzee",
    scoring: "50 points"
  },
  12: {
    upperSection: false,
    display: "Chance",
    scoring: "Sum all dice"
  }
}


function init() {
  currentRoll = 1;
  totalScore = 0;

  resetScore();
  generateDice();
  rollDice();
  render();
}

function render(){
  diceBoardEl.innerHTML = "";
 for(d in dice){
  let diceEl = document.createElement("div");
  diceEl.classList.add("dice");
  if (dice[d].hold) diceEl.classList.add("hold");
  diceEl.setAttribute('id', d);
  diceEl.textContent = dice[d].value;
  diceBoardEl.appendChild(diceEl);
  generateScoreBoard();
 }
 playerScoreEl.innerText = totalScore;
}

function handleRollDice() {
  rollDice();
  render();
}

function handleDiceClick(e) {
  if (!e.target.classList.contains("dice")) {
    return;
  }
  if(dice[e.target.id].hold) {
    dice[e.target.id].hold = false;
    e.target.classList.remove("hold")
  } else {
    dice[e.target.id].hold = true; 
    e.target.classList.add("hold");
  }
}

function handleConfirmChoice() {

}

function resetScore() {
  for(score in scoreboard) {
    scoreboard[score].taken = false;
    scoreboard[score].userScore = null;
  }
  console.log(scoreboard)
}

function generateDice(){
  for (d = 1; d < 7; d++) {
    dice[d] = {};
    dice[d].hold = false;
    dice[d].value = 0;   
  }
}

function generateScoreBoard(){
  scoreboardEl.innerHTML = "";
  for(let i = 0; i < Object.entries(scoreboard).length; i++) {
    let scoreRowEl = document.createElement('div');
    let nameDivEl = document.createElement('div');
    let scoringDivEl = document.createElement('div');
    let playerScoreDivEl = document.createElement('div');
    scoreRowEl.classList.add('scoreboard-row');
    nameDivEl.classList.add('category');
    nameDivEl.textContent = scoreboard[i].display;
    scoringDivEl.classList.add('scoring');
    scoringDivEl.textContent = scoreboard[i].scoring;
    playerScoreDivEl.classList.add('player-score')
    playerScoreDivEl.textContent = scoreboard[0].userScore;
    scoreboardEl.append(scoreRowEl);
    scoreRowEl.append(nameDivEl);
    scoreRowEl.append(scoringDivEl);
    scoreRowEl.append(playerScoreDivEl);
  }
}

function rollDice() {
  if (currentRoll > 3) return;
  console.log('current roll is', currentRoll)
  for(d in dice){
    if(!dice[d].hold) {
      dice[d].value = Math.floor(Math.random()*6)+1;
    } 
  }
  currentRoll++;
  console.log(dice);
}


init();

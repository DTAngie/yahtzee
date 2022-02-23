const diceBoardEl = document.getElementById("dice-board");
const rollBtn = document.getElementById("roll-btn");
const confirmBtn = document.getElementById("confirm");
const scoreboardEl = document.getElementById("scoreboard");
const playerScoreEl = document.getElementById("score");

rollBtn.addEventListener('click', handleRollDice);
diceBoardEl.addEventListener('click', handleDiceClick);
confirmBtn.addEventListener('click', handleConfirmChoice);
scoreboardEl.addEventListener('click', handleAddScore);

let currentRoll, totalScore, previousSelection, s;
let dice = {};
let diceArray = [];
let selectedCategory = {};
let scoreboard = {
  0: {
    requires: 1, //flat score will be hardcoded, otherwise this will be a multiple
    upperSection: true,
    display: "1",
    scoring: "Sum all 1s",
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
  dice = {};
  diceArray = [];
  selectedCategory = {
    id: null,
    score: null
  }

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
 if (currentRoll === 4) {
   rollBtn.setAttribute('disabled', true)
 } else {
   rollBtn.removeAttribute('disabled');
 }
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

function handleConfirmChoice(e) {
  currentRoll = 1;
  scoreboard[selectedCategory.id].playerScore = selectedCategory.score;
  for(d in dice) {
    dice[d].hold = false;
  }
  e.target.setAttribute("disabled", true);
  previousSelection = null;
  selectedCategory.id = null;
  selectedCategory.score = null;
  rollDice();
  render();
}

function handleAddScore(e) {
  if(!e.target.id) return;
  let category = scoreboard[e.target.id];
  if(category.playerScore) return;
  let el = e.target;
  // this prevents multiple scores per round
  if(previousSelection) {
    previousSelection.innerHTML = "";
  }
  previousSelection = e.target; 
  confirmBtn.removeAttribute("disabled");
  if (category.upperSection){
    selectedCategory.score = category.requires * (diceArray.filter(x => x === category.requires).length);
  }
  switch (e.target.id) {
    case "6":
      diceArray.sort();
      selectedCategory.score = (diceArray[2] === diceArray[0] || diceArray[2] === diceArray[4]) ? diceArray.reduce((a,b) => {return a+b}) : 0;
      break;
    case "7":
      diceArray.sort();
      selectedCategory.score = (diceArray[3] === diceArray[0] || diceArray[4] === diceArray[1]) ? diceArray.reduce((a,b) => {return a+b}) : 0;
      //check for four of a kind
      break;
    case "8":
      //check for full house
      break;
    case "9":
      s = diceArray.sort().filter((d, idx, diceArray) => diceArray.indexOf(d) === idx).join('');
      selectedCategory.score = (s.includes('1234') || s.includes('2345') || s.includes('3456')) ? 30 : 0;
      break;
      case "10":
        s = diceArray.sort().filter((d, idx, diceArray) => diceArray.indexOf(d) === idx).join('');
      selectedCategory.score = (s.includes('12345') || s.includes('23456')) ? 40 : 0;
      break;
    case "11":
      diceArray.sort();
      selectedCategory.score = (diceArray[0] === diceArray[4]) ? 50 : 0; 
      //TODO: check for multiple yahtzees
      break;
    case "12":
      selectedCategory.score = diceArray.reduce((a,b) => {return a+b});
      break;
  }
  selectedCategory.id = e.target.id;
  el.textContent = selectedCategory.score;
}

function resetScore() {
  for(score in scoreboard) {
    scoreboard[score].taken = false;
    scoreboard[score].playerScore = null;
  }
  console.log(scoreboard)
}

function generateDice(){
  for (d = 1; d < 6; d++) {
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
    playerScoreDivEl.setAttribute('id', i);
    scoreRowEl.classList.add('scoreboard-row');
    nameDivEl.classList.add('category');
    nameDivEl.textContent = scoreboard[i].display;
    scoringDivEl.classList.add('scoring');
    scoringDivEl.textContent = scoreboard[i].scoring;
    playerScoreDivEl.classList.add('player-score')
    playerScoreDivEl.textContent = scoreboard[i].playerScore;
    scoreboardEl.append(scoreRowEl);
    scoreRowEl.append(nameDivEl);
    scoreRowEl.append(scoringDivEl);
    scoreRowEl.append(playerScoreDivEl);
  }
}

function rollDice() {
  if (currentRoll > 3) return;
  console.log('current roll is', currentRoll)
  diceArray = [];
  for(d in dice){
    if(!dice[d].hold) {
      dice[d].value = Math.floor(Math.random()*6)+1;
    } 
    diceArray.push(dice[d].value);
  }
  currentRoll++;
}


init();

const diceBoardEl = document.getElementById("dice-board");
const rollBtn = document.getElementById("roll-btn");
const playerScoreEl = document.getElementById("score");

rollBtn.addEventListener('click', handleRollDice);
diceBoardEl.addEventListener('click', handleDiceClick);

let currentRoll, totalScore;
const dice = {}
const scoreboard = {
  ones: {
    requires: 1, //flat score will be hardcoded, otherwise this will be a multiple
    upperSection: true
  },
  twos: {
    requires: 2,
    upperSection: true
  },
  threes: {
    requires: 3,
    upperSection: true
  },
  fours: {
    requires: 4,
    upperSection: true
  },
  fives: {
    requires: 5,
    upperSection: true
  },
  six: {
    requires: 6,
    upperSection: true
  }, 
  threeOfAKind: {
    upperSection: false
  },
  fourOfAKind: {
    upperSection: false
  },
  fullHouse: {
    flatScore: 25,
    upperSection: false
  },
  smallStraight: {
    flatScore: 30,
    upperSection: false
  },
  largeStraight: {
    flatScore: 40,
    upperSection: false
  },
  yahtzee: {
    flatScore: 50,
    upperSection: false
  },
  chance: {
    upperSection: false
  }
}


function init() {
  currentRoll = 1;
  totalScore = 0;
  resetScoreBoard();
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

function resetScoreBoard() {
  for(score in scoreboard) {
    scoreboard[score].taken = false;
    scoreboard[score].userScore = 0;
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

function rollDice() {
  console.log('current roll is', currentRoll)
  for(d in dice){
    if(currentRoll === 3) {
      dice[d]
      currentRoll = 0;
  
    }
    if(!dice[d].hold) {
      dice[d].value = Math.floor(Math.random()*6)+1;
    } 
  }
  currentRoll++;
  console.log(dice);
}


init();

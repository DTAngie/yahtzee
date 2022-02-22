const diceBoardEl = document.getElementById("dice-board");
const rollBtn = document.getElementById("roll-btn");

rollBtn.addEventListener('click', handleRollDice);


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
  diceEl.setAttribute('id', d);
  diceEl.textContent = dice[d].value;
  diceBoardEl.appendChild(diceEl);
 }
}

function handleRollDice() {
  rollDice();
  render();
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
  for(d in dice){
    dice[d].value = Math.floor(Math.random()*6);
  }
  console.log(dice);
}


init();

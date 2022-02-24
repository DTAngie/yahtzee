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
    requires: 1,
    upperSection: true,
    display: "1",
    scoring: "Sum all 1s",
    locked: false
  },
  1: {
    requires: 2,
    upperSection: true,
    display: "2",
    scoring: "Sum all 2s",
    locked: false
  },
  2: {
    requires: 3,
    upperSection: true,
    display: "3",
    scoring: "Sum all 3s",
    locked: false
  },
  3: {
    requires: 4,
    upperSection: true,
    display: "4",
    scoring: "Sum all 4s",
    locked: false
  },
  4: {
    requires: 5,
    upperSection: true,
    display: "5",
    scoring: "Sum all 5s",
    locked: false
  },
  5: {
    requires: 6,
    upperSection: true,
    display: "6",
    scoring: "Sum all 6s",
    locked: false
  }, 
  6: {
    locked: true,
    display: "Total Score",
    scoring: "==>",
    total: function(){
      let upperSum = null;
      for(let i = 0; i < 6; i++){
        upperSum += (scoreboard[i].playerScore) ? scoreboard[i].playerScore : 0;
      }
      return upperSum ? this.playerScore = upperSum : 0;
    }
  },
  7: {
    locked: true,
    display: "Bonus Score",
    display2: "(if total score is 63 or over)",
    scoring: "35 points",
    flatScore: 35,
    requires: 23,
    bonusReached: false,
    total: function(){
      if(this.bonusReached) {
        this.playerScore = this.flatScore;
      }
      return this.playerScore ? this.playerScore : 0;
    }
  },
  8: {
    locked: true,
    display: "Total of the Upper Section",
    scoring: "==>",
    total: function(bonus, upperSum){
      return upperSum ? this.playerScore = (bonus + upperSum) : 0;
    }
  },
  9: {
    upperSection: false,
    display: "Three of a Kind",
    scoring: "Sum all dice",
    locked: false
  },
  10: {
    upperSection: false,
    display: "Four of a Kind",
    scoring: "Sum all dice",
    locked: false
  },
  11: {
    flatScore: 25,
    upperSection: false,
    display: "Full House",
    scoring: "25 points",
    locked: false
  },
  12: {
    flatScore: 30,
    upperSection: false,
    display: "Small Straight",
    scoring: "30 points",
    locked: false
  },
  13: {
    flatScore: 40,
    upperSection: false,
    display: "Large Straight",
    scoring: "40 points",
    locked: false
  },
  14: {
    flatScore: 50,
    upperSection: false,
    display: "Yahtzee",
    scoring: "50 points",
    locked: false
  },
  15: {
    upperSection: false,
    display: "Chance",
    scoring: "Sum all dice",
    locked: false
  },
  16: {
    display: "Yahtzee Bonus",
    scoring: "==>",
    locked: false,
    bonus: [],
    total: function(){
      return this.bonus.push(100);
    }
  },
  17: {
    locked: true,
    display: "Total of Lower Section",
    scoring: "==>",
    total: function(){
      let lowerSum = null;
      for(let i = 9; i < 17; i++){
        lowerSum += (scoreboard[i].playerScore) ? scoreboard[i].playerScore : 0;
      }
      return lowerSum ? this.playerScore = lowerSum : 0;
    }
  },
  18: {
    locked: true,
    display: "Total of Upper Section",
    scoring: "==>",
    total: function(sum){
      return sum ? this.playerScore = sum : 0;
    }
  },
  19: {
    locked: true,
    display: "Grand Total Score",
    scoring: "==>",
    total: function(upper, lower) {
      return (upper || lower) ? this.playerScore = (upper + lower) : 0;
    }
  },
}
let upperTotal = scoreboard[6];
let bonus = scoreboard[7];
let upperTotal2 = scoreboard[8];
let yahtzeeBonus = scoreboard[16];
let lowerTotal  = scoreboard[17];
let upperTotal3  = scoreboard[18];
let grandTotal = scoreboard[19];


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
  }
  generateScoreBoard();
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
  updateTotals();
  rollDice();
  render();
}

function handleAddScore(e) {
  if(!e.target.id) return;
  let category = scoreboard[e.target.id];
  if(category.playerScore || category.locked) return;
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
  diceArray.sort();
  switch (e.target.id) {
    case "9":
      s = diceArray.filter((d, idx, diceArray) => diceArray[idx+2] === d);
      selectedCategory.score = s.length ? diceArray.reduce((a,b) => a+b) : 0;
      break;
    case "10":
      s = diceArray.filter((d, idx, diceArray) => diceArray[idx+3] === d);
      selectedCategory.score = s.length ? diceArray.reduce((a,b) => a+b) : 0;
      break;
    case "11":
      selectedCategory.score = ((diceArray[0] === diceArray[1] && diceArray[2] === diceArray[4]) || (diceArray[0] === diceArray[2] && diceArray[3] === diceArray[4])) ? category.flatScore : 0;
      break;
    case "12":
      s = diceArray.filter((d, idx, diceArray) => diceArray.indexOf(d) === idx).join('');
      selectedCategory.score = (s.includes('1234') || s.includes('2345') || s.includes('3456')) ? category.flatScore : 0;
      break;
    case "13":
      s = diceArray.filter((d, idx, diceArray) => diceArray.indexOf(d) === idx).join('');
      selectedCategory.score = (s.includes('12345') || s.includes('23456')) ? category.flatScore : 0;
      break;
    case "14":
      selectedCategory.score = (diceArray[0] === diceArray[4]) ? category.flatScore : 0; 
      //TODO: check for multiple yahtzees
      break;
    case "15":
      selectedCategory.score = diceArray.reduce((a,b) => a+b);
      break;
  }
  selectedCategory.id = e.target.id;
  el.textContent = selectedCategory.score;
}

function resetScore() {
  for(score in scoreboard) {
    let thisScore = scoreboard[score];
    thisScore.playerScore = null;
    if (!thisScore.locked) {
      thisScore.taken = false;
    }
  }
  bonus.bonusReached = false;
  yahtzeeBonus.bonus = [];
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
    console.log('this is ', i)
    let thisCategory = scoreboard[i];
    let scoreRowEl = document.createElement('div');
    let nameDivEl = document.createElement('div');
    let scoringDivEl = document.createElement('div');
    let playerScoreDivEl = document.createElement('div');
    playerScoreDivEl.setAttribute('id', i);
    scoreRowEl.classList.add('scoreboard-row', 'flex');
    nameDivEl.classList.add('category');
    nameDivEl.innerHTML = `${thisCategory.display} ${(thisCategory.display2) ? "<br>"+thisCategory.display2 : ""}`;
    scoringDivEl.classList.add('scoring');
    scoringDivEl.textContent = thisCategory.scoring;
    playerScoreDivEl.classList.add('player-score')
    if (i !== 16) {
      playerScoreDivEl.textContent = thisCategory.playerScore;
    } else {
      playerScoreDivEl.classList.add('flex');
      for (let j = 0; j < 3; j++){
        let bonusDivsEl = document.createElement('div');
        bonusDivsEl.classList.add('y-bonus');
        bonusDivsEl.textContent = yahtzeeBonus.bonus.length ? yahtzeeBonus.bonus[j] : "";
        playerScoreDivEl.append(bonusDivsEl);
      }
 
    }
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

function updateTotals(){
  upperTotal.total();
  if(upperTotal.playerScore >= bonus.requires) {
    bonus.bonusReached = true;
  }
  upperTotal2.total(bonus.total(), upperTotal.playerScore);
  lowerTotal.total();
  upperTotal3.total(upperTotal2.playerScore);
  grandTotal.total(upperTotal.playerScore, lowerTotal.playerScore);
}

init();
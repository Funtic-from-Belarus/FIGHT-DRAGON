let health = 100;
let xp = 0;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];


const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const xpText = document.querySelector("#xpText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");


const weapons = [
   {
      name: "stick",
      power: 5
   },
   {
      name: "dagger",
      power: 30
   },
   {
      name: "claw hammer",
      power: 50
   },
   {
      name: "sword",
      power: 100
   }
]

const monsters = [
   {
      name: "slice",
      level: 2,
      health: 15
   },
   {
      name: "fanged beast",
      level: 8,
      health: 60
   },
   {
      name: "dragon",
      level: 20,
      health: 300
   }
];


const locations = [
   {
      name: "town square",
      buttonText: ["Go to store", "Go to cave", "Fight dragon"],
      buttonFunctions: [goStore, goCave, fightDragon],
      text: "You are in the town square. You see a sign that says 'store'."
   },
   {
      name: "store",
      buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
      buttonFunctions: [buyHealth, buyWeapon, goTown],
      text: "You enter the store."
   },
   {
      name: "cave",
      buttonText: ["Fight slime", "Fight fanged beast", "Go to town square"],
      buttonFunctions: [fightSlime, fightBeast, goTown],
      text: "You enter the cave. You see some monsters."
   },
   {
      name: "fight",
      buttonText: ["Attack", "Dodge", "Run"],
      buttonFunctions: [attack, dodge, goTown],
      text: "You are fighting a monster."
   },
   {
      name: "kill monster",
      buttonText: ["Go to town square", "Go to town square", "Go to town square"],
      buttonFunctions: [goTown, goTown, eastenEgg],
      text: "The monster dies. You gain experience points and find gold."
   },
   {
      name: "lose",
      buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
      buttonFunctions: [reset, reset, reset],
      text: "You die."
   },
   {
      name: "win",
      buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
      buttonFunctions: [reset, reset, reset],
      text: "You defeat the dragon, you win the game!"
   },
   {
      name: "easten game",
      buttonText: ["2", "8", "Go to town"],
      buttonFunctions: [pickTwo, pickEight, goTown],
      text: "You find the secret game. Pick the number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
   }
]


button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;


function update(location) {
   monsterStats.style.display = "none";
   button1.innerText = location.buttonText[0];
   button2.innerText = location.buttonText[1];
   button3.innerText = location.buttonText[2];
   button1.onclick = location.buttonFunctions[0];
   button2.onclick = location.buttonFunctions[1];
   button3.onclick = location.buttonFunctions[2];
   text.innerText = location.text;
}

function goTown() {
   update(locations[0]);
}

function goStore() {
   update(locations[1]);
}

function goCave() {
   update(locations[2]);
}

function buyHealth() {
   if (gold >= 10) {
      gold -= 10;
      health += 10;
      healthText.innerText = health;
      goldText.innerText = gold;
   } else {
      text.innerText = "You don't have enough gold to buy health";
   }
}

function buyWeapon() {
   if (currentWeapon < weapons.length - 1) {
      if (gold >= 30) {
         gold -= 30;
         currentWeapon++;
         let newWeapon = weapons[currentWeapon].name;
         goldText.innerText = gold;
         text.innerText = "You now have a " + newWeapon + ".";
         inventory.push(newWeapon);
         text.innerText += "In your inventory you have: " + inventory;
      } else {
         text.innerText = "You don't have enough gold to buy a weapon";
      }
   } else {
      text.innerText = "You already have the most powerful weapon";
      button2.innerText = "Sell weapon for 15 gold";
      button2.onclick = sellWeapon;
   }
}

function sellWeapon() {
   if (inventory.length > 1) {
      gold += 15;
      goldText.innerText = gold;
      let currentWeapon = inventory.shift();
      text.innerText = "You sold " + currentWeapon + ".";
      text.innerText += "In your inventory you have: " + inventory;
   } else {
      text.innerText = "Don't sell your only weapon.";
   }
}

function fightSlime() {
   fighting = 0;
   goFight();
}

function fightBeast() {
   fighting = 1;
   goFight();
}

function fightDragon() {
   fighting = 2;
   goFight();
}

function goFight() {
   update(locations[3]);
   monsterHealth = monsters[fighting].health;
   monsterStats.style.display = "block";
   monsterNameText.innerText = monsters[fighting].name;
   monsterHealthText.innerText = monsterHealth;
}

function attack() {
   text.innerText = "You " + monsters[fighting].name + " attacked.";
   text.innerText = " You attacked it with " + weapons[currentWeapon].name + ".";
   if (isMonsterHit()) {
      health -= getMonsterAttackValue(monsters[fighting].level);
   } else {
      text.innerText += "You miss."
   }
   monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
   healthText.innerText = health;
   monsterHealthText.innerText = monsterHealth;
   if (health <= 0) {
      lose();
   } else if (monsterHealth <= 0) {
      fighting === 2 ? wingame() : defeatMonster();
   }
   if (Math.random() <= .1 && inventory.length !== 1) {
      text, innerText = "Your " + inventory.pop() + " breaks.";
      currentWeapon--;
   }
}

function isMonsterHit() {
   return Math.random() > .3 || health < 20;
}

function getMonsterAttackValue(level) {
   let hit = (level * 5) - (Math.floor(Math.random() * xp));
   return hit;
}

function dodge() {
   text.innerText = "You dodge the attacked from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
   gold += Math.floor(monsters[fighting].level * 6.7);
   xp += monsters[fighting].level;
   xpText.innerText = xp;
   goldText.innerText = gold;
   update(locations[4]);
}

function lose() {
   update(locations[5])
}

function wingame() {
   update(locations[6])
}

function reset() {
   let health = 100;
   let xp = 0;
   let gold = 50;
   let currentWeapon = 0;
   let inventory = ["stick"];
   xpText.innerText = xp;
   goldText.innerText = gold;
   healthText.innerText = health;
   goTown();
}

function eastenEgg() {
   update(locations[7]);
}

function pickTwo() {
   pick(2);
}

function pickEight() {
   pick(8);
}
function pick(guess) {
   let numbers = [];
   while (numbers.length < 10) {
      numbers.push(Math.floor(Math.random() * 11));
   }
   text.innerText = "You picked " + guess + " . Here is random numbers.\n";

   for (let i = 0; i < 10; i++) {
      text.innerText += numbers[i] + "\n";
   }

   if (numbers.indexOf(guess) !== -1) {
      text.innerText += "Right, you win 20 gold";
      gold += 20;
      goldText.innerText = gold;
   } else {
      text.innerText += "Wrong! You lose 10 health";
      health -= 10;
      healthText.innerText = health
      if (health <= 0) {
         lose();
      }
   }
}
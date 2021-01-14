// This is a basic implementation of the casino card game blackJack.
// It is based off a 4 deck shoe, totalling 208 cards, 16 of each value, made of 4 each of each suite.
// For now there will be no implementation of double down, insurance or split, just hit or stay
// the dealer will hit on 16 or less, and stay on 17 or more.
// The shoe will be reshuffled when more than 52 cards have been drawn from it. 

// The game constants
const width = window.innerWidth;
const height = window.innerHeight;
const scaleX = width/800;
const scaleY = height/600;
const scale = Math.max(scaleX, scaleY);
const cardScale = scale*0.1;

// Phaser configuration
const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    scale: {
        mode: Phaser.DOM.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.DOM.CENTER_BOTH,
        // width: width, this breaks the scaling, moving it out scale fixes this for some reason.
        // height: height,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };
const game = new Phaser.Game(config);

// The game variables
let createThis;
let alreadyPicked = [];
let chips = 200;
let cardArray = [
    "AceSpades", "AceClubs", "AceHearts", "AceDiamonds",
    "2Spades", "2Clubs", "2Hearts", "2Diamonds",
    "3Spades", "3Clubs", "3Hearts", "3Diamonds",
    "4Spades", "4Clubs", "4Hearts", "4Diamonds",
    "5Spades", "5Clubs", "5Hearts", "5Diamonds",
    "6Spades", "6Clubs", "6Hearts", "6Diamonds",
    "7Spades", "7Clubs", "7Hearts", "7Diamonds",
    "8Spades", "8Clubs", "8Hearts", "8Diamonds",
    "9Spades", "9Clubs", "9Hearts", "9Diamonds",
    "10Spades", "10Clubs", "10Hearts", "10Diamonds",
    "JackSpades", "JackClubs", "JackHearts", "JackDiamonds",
    "QueenSpades", "QueenClubs", "QueenHearts", "QueenDiamonds",
    "KingSpades", "KingClubs", "KingHearts", "KingDiamonds",
];
// The players cards
let playersCardLocation = new Phaser.Math.Vector2();
let playersCardLocation2 = new Phaser.Math.Vector2();
let playersCard1;
let playersCard2;
let onTable = 0;
let playersTotal = 0;
let playerHasAce = 0;
let cardsDelt = 0;

let playersHitCards = []
let playersHitCardLocations = [
    new Phaser.Math.Vector2(), 
    new Phaser.Math.Vector2(), 
    new Phaser.Math.Vector2(), 
    new Phaser.Math.Vector2(),
    new Phaser.Math.Vector2(),
    new Phaser.Math.Vector2(),
    new Phaser.Math.Vector2(),
]; // Probability of you hitting more than 7 times is very very low, an average card value under 3 is needed.

// The dealers cards
let dealersCardLocation = new Phaser.Math.Vector2();
let dealersCardLocation2 = new Phaser.Math.Vector2();
let hiddenCard;
let dealersCard1;
let dealersCard2;
let dealersTotal = 0;
let dealerHasAce = 0;

let dealersHitCards = []
let dealersHitCardLocations = [
    new Phaser.Math.Vector2(), 
    new Phaser.Math.Vector2(), 
    new Phaser.Math.Vector2(), 
    new Phaser.Math.Vector2(),
    new Phaser.Math.Vector2(),
    new Phaser.Math.Vector2(),
    new Phaser.Math.Vector2(),
]; // Probability of you hitting more than 7 times is very very low, an average card value under 3 is needed.

// The buttons
let hit;
let stand;
// Ensure Hit cannot be pressed after stand has already been pressed.
let stood = false;

// loading in the assets we will use
function preload() {
    this.load.image("background", "assets/background.jpg");
    // loading all the different cards
    // Aces
    this.load.image("AceSpades", "assets/cards/AS.png");
    this.load.image("AceClubs", "assets/cards/AC.png");
    this.load.image("AceHearts", "assets/cards/AH.png");
    this.load.image("AceDiamonds", "assets/cards/AD.png");
    // 2s
    this.load.image("2Spades", "assets/cards/2S.png");
    this.load.image("2Clubs", "assets/cards/2C.png");
    this.load.image("2Hearts", "assets/cards/2H.png");
    this.load.image("2Diamonds", "assets/cards/2D.png");
    // 3s
    this.load.image("3Spades", "assets/cards/3S.png");
    this.load.image("3Clubs", "assets/cards/3C.png");
    this.load.image("3Hearts", "assets/cards/3H.png");
    this.load.image("3Diamonds", "assets/cards/3D.png");
    // 4s
    this.load.image("4Spades", "assets/cards/4S.png");
    this.load.image("4Clubs", "assets/cards/4C.png");
    this.load.image("4Hearts", "assets/cards/4H.png");
    this.load.image("4Diamonds", "assets/cards/4D.png");
    // 5s
    this.load.image("5Spades", "assets/cards/5S.png");
    this.load.image("5Clubs", "assets/cards/5C.png");
    this.load.image("5Hearts", "assets/cards/5H.png");
    this.load.image("5Diamonds", "assets/cards/5D.png");
    // 6s
    this.load.image("6Spades", "assets/cards/6S.png");
    this.load.image("6Clubs", "assets/cards/6C.png");
    this.load.image("6Hearts", "assets/cards/6H.png");
    this.load.image("6Diamonds", "assets/cards/6D.png");
    // 7s
    this.load.image("7Spades", "assets/cards/7S.png");
    this.load.image("7Clubs", "assets/cards/7C.png");
    this.load.image("7Hearts", "assets/cards/7H.png");
    this.load.image("7Diamonds", "assets/cards/7D.png");
    // 8s
    this.load.image("8Spades", "assets/cards/8S.png");
    this.load.image("8Clubs", "assets/cards/8C.png");
    this.load.image("8Hearts", "assets/cards/8H.png");
    this.load.image("8Diamonds", "assets/cards/8D.png");
    // 9s
    this.load.image("9Spades", "assets/cards/9S.png");
    this.load.image("9Clubs", "assets/cards/9C.png");
    this.load.image("9Hearts", "assets/cards/9H.png");
    this.load.image("9Diamonds", "assets/cards/9D.png");
    // 10s
    this.load.image("10Spades", "assets/cards/10S.png");
    this.load.image("10Clubs", "assets/cards/10C.png");
    this.load.image("10Hearts", "assets/cards/10H.png");
    this.load.image("10Diamonds", "assets/cards/10D.png");
    // Jacks
    this.load.image("JackSpades", "assets/cards/JS.png");
    this.load.image("JackClubs", "assets/cards/JC.png");
    this.load.image("JackHearts", "assets/cards/JH.png");
    this.load.image("JackDiamonds", "assets/cards/JD.png");
    // Queens
    this.load.image("QueenSpades", "assets/cards/QS.png");
    this.load.image("QueenClubs", "assets/cards/QC.png");
    this.load.image("QueenHearts", "assets/cards/QH.png");
    this.load.image("QueenDiamonds", "assets/cards/QD.png");
    // Kings
    this.load.image("KingSpades", "assets/cards/KS.png");
    this.load.image("KingClubs", "assets/cards/KC.png");
    this.load.image("KingHearts", "assets/cards/KH.png");
    this.load.image("KingDiamonds", "assets/cards/KD.png");
    // Face Down Card
    this.load.image("FaceDown", "assets/cards/blue_back.png");

    this.load.image("stand", "assets/button_stand.png");
    this.load.image("hit", "assets/button_hit.png");

  }

// creation of objects and rendering of initial objects
function create() {
    // initialize values for hit card locations
    playersHitCardLocations[0].y = height -110*scale;
    playersHitCardLocations[0].x = width/2-100*scale;

    playersHitCardLocations[1].y = height - 110*scale;
    playersHitCardLocations[1].x = playersHitCardLocations[0].x + 40*scale;

    playersHitCardLocations[2].y = height - 110*scale;
    playersHitCardLocations[2].x = playersHitCardLocations[1].x + 40*scale;

    playersHitCardLocations[3].y = height - 110*scale;
    playersHitCardLocations[3].x = playersHitCardLocations[2].x + 40*scale;

    playersHitCardLocations[4].y = height - 110*scale;
    playersHitCardLocations[4].x = playersHitCardLocations[3].x + 40*scale;

    playersHitCardLocations[5].y = height - 110*scale;
    playersHitCardLocations[5].x = width/2-100*scale;

    playersHitCardLocations[6].y = height - 110*scale;
    playersHitCardLocations[6].x = width/2-100*scale;

    // now dealers hit cards
    // initialize values for hit card locations
    dealersHitCardLocations[0].y = height -270*scale;
    dealersHitCardLocations[0].x = width/2-100*scale;

    dealersHitCardLocations[1].y = height - 270*scale;
    dealersHitCardLocations[1].x = dealersHitCardLocations[0].x + 40*scale;

    dealersHitCardLocations[2].y = height - 270*scale;
    dealersHitCardLocations[2].x = dealersHitCardLocations[1].x + 40*scale;

    dealersHitCardLocations[3].y = height - 270*scale;
    dealersHitCardLocations[3].x = dealersHitCardLocations[2].x + 40*scale;

    dealersHitCardLocations[4].y = height - 270*scale;
    dealersHitCardLocations[4].x = dealersHitCardLocations[3].x + 40*scale;

    dealersHitCardLocations[5].y = height - 270*scale;
    dealersHitCardLocations[5].x = width/2-100*scale;

    dealersHitCardLocations[6].y = height - 270*scale;
    dealersHitCardLocations[6].x = width/2-100*scale;


    let background = this.add.image(width/2, height/2, "background");
   
    background.setScale(scale*0.5).setScrollFactor(0);

    hit = this.add.sprite(width - 60*scale, height - 30*scale, "hit").setScale(scale*0.5).setInteractive();
    stand = this.add.sprite(60*scale, height - 30*scale, "stand").setScale(scale*0.5).setInteractive();

    // deal a random card to the player
    playersCardLocation.y = height;
    playersCardLocation.x = width/2-100*scale;
    playersCard1 = displayCard(drawCard(alreadyPicked), this, "player");
    this.physics.moveToObject(playersCard1, playersCardLocation, 9000);
    onTable ++;

    // deal the dealer a facedown card
    dealersCardLocation.y = 105*scale;
    dealersCardLocation.x = width/2-100*scale;
    hiddenCard= this.physics.add.image(width + scale*50 , 0 - scale*50, "FaceDown").setOrigin(0,1).setScale(cardScale); //the facedown card we actually show
    this.physics.moveToObject(hiddenCard, dealersCardLocation, 9000);
    dealersCard1 = displayCard(drawCard(alreadyPicked), this, "dealer"); //the dealers card but kept hidden off screen

    // deal a second random card to the player
    playersCardLocation2.y = height;
    playersCardLocation2.x = playersCardLocation.x + 70*scale;
    playersCard2 = displayCard(drawCard(alreadyPicked), this, "player");
    this.physics.moveToObject(playersCard2, playersCardLocation2, 9000);
    onTable ++;

    // deal a second random card to the dealer
    dealersCardLocation2.y = 105*scale;
    dealersCardLocation2.x = playersCardLocation.x + 70*scale;
    dealersCard2 = displayCard(drawCard(alreadyPicked), this, "dealer");
    this.physics.moveToObject(dealersCard2, dealersCardLocation2, 9000);
    onTable ++;
    
    console.log(playersTotal);
    console.log("Player has : " + playerHasAce + " Aces");

    createThis = this;
    // Handling clicking of hit button
    hit.on('pointerdown', function (pointer) {

        this.setTint(0x3178eb);

    });

    hit.on("pointerout", function (pointer) {
        this.clearTint();
    });

    // This is where the button functionality will be called, this ensures it runs once and you can cancel a click by dragging off button
    hit.on("pointerup", function (pointer) {
        this.clearTint();
        if(checkBustPlayer() == false && stood == false)
        {
        playersHitCards.push(displayCard(drawCard(alreadyPicked), createThis , "player"));
        //createThis.physics.moveToObject(playersHitCards[playersHitCards.length - 1], playersHitCardLocations[playersHitCards.length - 1], 900); //This won't work for some reason
        playersHitCards[playersHitCards.length -1].setX(playersHitCardLocations[playersHitCards.length - 1].x).setY(playersHitCardLocations[playersHitCards.length - 1].y);
        checkBustPlayer();
        }
        
        console.log(playersTotal);
        scoreText.setText("score: " + playersTotal);
        if(playerHasAce)
        {
            scoreText.setText("score: " + playersTotal + "/" + (playersTotal-10));
        }
        console.log("Player has : " + playerHasAce + " Aces");
    });

    //Handling Clicking of Stand button
    stand.on('pointerdown', function (pointer) {

        this.setTint(0x3178eb);

    });

    stand.on("pointerout", function (pointer) {
        this.clearTint();
    });

    // This is where the button functionality will be called, this ensures it runs once and you can cancel a click by dragging off button
    stand.on("pointerup", function (pointer) {
        this.clearTint();
        dealersCard1.setX(dealersCardLocation.x).setY(dealersCardLocation.y);
        stood = true;
        dealerHit();
        whoWon();
        console.log("pointer released");
    });

    //adding a score
    scoreText = this.add.text(width - 100*scale, height - 80*scale, "score: 0", {
        fontSize: "38px",
        fontStyle: "bold",
        fill: "#000",
      });

      scoreText.setText("score: " + playersTotal );
      if(playerHasAce)
      {
        scoreText.setText("score: " + playersTotal + "/" + (playersTotal-10));
      }
}

// The actual game loop, where any updates are made/events are handled.
function update() {

    
    // stopping the 4 cards that are always dealt, maybe I should change this to not run once these have been stopped, for better efficiency.
    if(cardsDelt < 30 )
    {
    stopObject(playersCard1, playersCardLocation);
    stopObject(hiddenCard, dealersCardLocation);
    stopObject(playersCard2, playersCardLocation2);
    stopObject(dealersCard2, dealersCardLocation2);
    }

    // making sure we stop each new card thats added if the player decides to Hit
    playersHitCards.forEach((card, index) => {
        stopObject(card, playersHitCardLocations[index]);
    });
    
}


// A recursive function that serves to pick a numeral representation of a card, redrawing if that card has been drawn already since the last shuffle.
function drawCard(alreadyPicked){
	let card = Math.floor(Math.random() * 208) + 1;
	while(alreadyPicked.includes(card))
	{
		card = drawCard(alreadyPicked);
    }
    //alreadyPicked.push(card); // add the card to the array so its probability of being drawn again is reduced.
	return card;
}

// Takes in number between 1 and 208 (inclusive) and draws a corresponding card.
function displayCard(number, table, who) {
    let cardNumber = Math.ceil(number/4);
    let card =  table.physics.add.image(width + scale*50 , 0 - scale*50, cardArray[cardNumber-1]).setOrigin(0,1).setScale(cardScale);
    let cardValue;
    alreadyPicked.push(number); // add the card to the array so its probability of being drawn again is reduced.
    switch(Math.ceil(cardNumber/4)){
        case 1:
            cardValue = 11;
            break;
        case 2:
            cardValue = 2;
            break;
        case 3:
            cardValue = 3;
            break;
        case 4:
            cardValue = 4;
            break;
        case 5:
            cardValue = 5;
            break;
        case 6:
            cardValue = 6;
            break;
        case 7:
            cardValue = 7;
            break;
        case 8:
            cardValue = 8;
            break;
        case 9:
            cardValue = 9;
            break;
        default:
            cardValue = 10;
    } 
    if(who == "dealer")
    {
        dealersTotal = dealersTotal + cardValue;
        if(cardValue == 11){
            dealerHasAce = dealerHasAce + 1;
        }
    }else 
    {
        playersTotal = playersTotal + cardValue;
        if(cardValue == 11){
            playerHasAce = playerHasAce + 1;
        }
    }
    return card;
}

function stopObject(theObject, location)
{
    // console.log(theObject);
    let hasStopped = false;
    let distance = Phaser.Math.Distance.Between(theObject.x, theObject.y, location.x, location.y);
        if (playersCard1.body.speed > 0)
        {
            //  4 is our distance tolerance, i.e. how close the source can get to the target
            //  before it is considered as being there. The faster it moves, the more tolerance is required.
            if (distance < 160)
            {
                theObject.body.reset(location.x, location.y);
                cardsDelt ++;
            }
        }
}

function checkBustPlayer()
{
    if(playersTotal > 21 && playerHasAce < 1)
    {
        youLose();
        return true;
    }else if(playersTotal > 21 && playerHasAce > 0)
    {
        playersTotal = playersTotal - 10;
        playerHasAce = playerHasAce - 1;
        return false;
    }else{
        return false;
    }
}

function dealerIsBust()
{
    if(dealersTotal > 21 && dealerHasAce < 1)
    {
        return true;
    }else if(dealersTotal > 21 && dealerHasAce > 0)
    {
        dealersTotal = dealersTotal - 10;
        dealerHasAce = dealerHasAce - 1;
        dealerHit();
        return false;
    }else{
        return false;
    }
}

function youLose()
{
    createThis.add.text(width/2, height/2, "YOU LOSE!", {
        fontSize: "58px",
        fontStyle: "bold",
        fill: "#000",
      });;
}

//temp sleep function ****TO be removed if not used ****
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function dealerHit()
{
    while(dealersTotal < 17)
        {
            dealersHitCards.push(displayCard(drawCard(alreadyPicked), createThis , "dealer"));
        }
        dealersHitCards.forEach((card, index) => {
            card.setX(dealersHitCardLocations[index].x).setY(dealersHitCardLocations[index].y);
        });
        whoWon();
}

function whoWon()
{
    if(dealersTotal < playersTotal)
        {
            createThis.add.text(width/2, height/2, "YOU WIN!", {
                fontSize: "58px",
                fontStyle: "bold",
                fill: "#000",
              });;
        }else if(dealersTotal > playersTotal && dealersTotal < 22)
        {
            youLose();
        }else if(dealersTotal == playersTotal)
        {
            createThis.add.text(width/2, height/2, "DRAW!", {
                fontSize: "58px",
                fontStyle: "bold",
                fill: "#000",
              });;
        }else if(dealerIsBust())
        {
            createThis.add.text(width/2, height/2, "YOU WIN!", {
                fontSize: "58px",
                fontStyle: "bold",
                fill: "#000",
              });;
        }
}
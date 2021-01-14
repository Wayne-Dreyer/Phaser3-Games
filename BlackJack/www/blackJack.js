//This is a basic implementation of the casino card game blackJack.
// It is based off a 4 deck shoe, totalling 208 cards, 16 of each value, made of 4 each of each suite.
// For now there will be no implementation of double down, insurance or split, just hit or stay
// the dealer will hit on 16 or less, and stay on 17 or more.
//The shoe will be reshuffled when more than 52 cards have been drawn from it. 

//The game constants
const width = window.innerWidth;
const height = window.innerHeight;
const scaleX = width/800;
const scaleY = height/600;
const scale = Math.max(scaleX, scaleY);

// Phaser configuration
const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    scale: {
        mode: Phaser.DOM.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.DOM.CENTER_BOTH,
        //width: width, this breaks the scaling, moving it out scale fixes this for some reason.
        //height: height,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1550*scaleY },
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

//The game variables
let alreadyPicked = [];

//loading in the assets we will use
function preload() {
    this.load.image("background", "assets/background.jpg");
    
  }

//creation of objects and rendering of initial objects
function create() {
    let background = this.add.image(width/2, height/2 - scaleY*50, "background");
   
    background.setScale(scale*0.5).setScrollFactor(0);
}

//The actual game loop, where any updates are made/events are handled.
function update() {

}


//A recursive function that serves to pick a numeral representation of a card, redrawing if that card has been drawn already since the last shuffle.
function drawCard(alreadyPicked){
	let card = Math.floor(Math.random() * 208) + 1;
	while(alreadyPicked.includes(card))
	{
		card = drawCard(alreadyPicked);
	}
	return card;
}
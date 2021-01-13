const width = window.innerWidth;
const height = window.innerHeight;
const scaleX = width/800;
const scaleY = height/600;
const scale = Math.max(scaleX, scaleY);
const gameSpeed = -300;
const gap = 1.0;

// Our game variables
let player;
let cursors;
let scoreText;
let score = 0;
let bottomPipes;
let topPipes;
let incremented;
let totalPipes;

// Phaser congiguration
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

  function preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("ground", "assets/floor.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("bottomPipe", "assets/bottomPipe.png");
    this.load.image("topPipe", "assets/topPipe.png")
  }

  function create() {
    /*********************The world ****************************/
    //images are referenced by thier centre not corner hence we place center of sky to 400, 300.
    let background = this.add.image(width/2, height/2 - scaleY*50, "background");
   
    background.setScale(scale).setScrollFactor(0);
    

    //create the ground group, a group of static objects
    let ground = this.physics.add.staticGroup();

    //create a pipe group, these are dynamic objects that are an unstoppable force, not effected by gravity.
    totalPipes = Math.floor((width +40*scaleX)/550)
     bottomPipes = this.physics.add.group({
          immovable: true,
          allowGravity: false,
          key: "bottomPipe",
          repeat: totalPipes,
          setXY: {x: width, y: ( Math.floor(Math.random() * (height-scaleY*250)) + scaleY*100) +scaleY*270*gap, stepX: 550 },
      });

      topPipes = this.physics.add.group({
        immovable: true,
        allowGravity: false,
        key: "topPipe",
        repeat: totalPipes,
        setXY: {x: width, y: ( Math.floor(Math.random() * (height-scaleY*250)) + scaleY*100) +scaleY*270*gap, stepX: 550 },
    });

      let ii = 0
      bottomPipes.children.iterate(function (child){
        child.set
        child.setScale(0.07*scaleY);
        child.setVelocityX(gameSpeed);
        child.setY(( Math.floor(Math.random() * (height-scaleY*250)) + scaleY*100) +scaleY*270*gap);
        topPipes.getChildren()[ii].setScale(0.07*scaleY).setVelocityX(gameSpeed).setY(( child.y) -scaleY*270*gap*2);
        ii ++;
      }) 

    // create the floor, but scale the image 2x and tell the physics to refresh for this scale we just did
    ground.create(width/2, height-(10/(scale)), "ground").setScale(scale*2, scale).refreshBody();

    

    /****************The player/bird ***************************/

    //Here we create the sprite, which is by default a dynamic physics object
    player = this.physics.add.image(width/2.6, height/2.3, "bird").setScale(scaleY);

    //We prevent the player from exiting the bounds of the game by using world bounds colliders
    player.setCollideWorldBounds(true);


    //adding a collider for the player and the ground
    this.physics.add.collider(player, ground);

    //adding a collision detection with the player and the pipes
    this.physics.add.collider(player, bottomPipes, youFailed, null, this);
    this.physics.add.collider(player, topPipes, youFailed, null, this);
    

    //creating a cursor group to handle input
    cursors = this.input.keyboard.createCursorKeys();


    //adding a score
    scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

  }

  //This is the update/game loop where we check for events happening
  function update() {
    
    //recycling the pipe assets so we dont create more and more, this should be changed to an array of pipes or similar
    respawn();

    //This handles the flapping
    if (cursors.space.isDown ) {
      player.setVelocityY(-320*scaleY); //up is negative???
    }
  }

  function youFailed(player)
  {
    console.log("you died");
    this.physics.pause();

    player.setTint(0xff0000);
    gameOver = true;
  }

  function respawn()
  {
    bottomPipes.children.iterate(function (child) {
      if(child.x < -20*scaleX)
      {
        child.x = child.x + totalPipes*550 + 550;
        child.y = ( Math.floor(Math.random() * (height-scaleY*250)) + scaleY*100) +scaleY*270*gap;
        respawnTopPipes(child.y)
      } 
    })

    
  }

  function respawnTopPipes(yValue)
  {
    topPipes.children.iterate(function (child) {
      if(child.x < -20*scaleX)
      {
        child.x = child.x + totalPipes*550 + 550;;
        child.y = yValue - scaleY*270*gap*2;
      } 
    })
  }



  
var width = window.innerWidth;
var height = window.innerHeight;

//Our game variables
var player;
var cursors;
var stars;
var scoreText;
var score = 0;
var bombs;
let scaleX = width/800;
let scaleY = height/600;
let scale = Math.max(scaleX, scaleY);

var config = {
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
        gravity: { y: 300*scaleY },
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
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  function create() {
    /*********************The world ****************************/
    //images are referenced by thier centre not corner hence we place center of sky to 400, 300.
    let background = this.add.image(width/2, height/2, "sky");
   
    background.setScale(scale).setScrollFactor(0);
    

    //create the platforms group, a group of static objects
    let platforms = this.physics.add.staticGroup();

    //create the floor, but scale the image 2x and tell the physics to refresh for this scale we just did
    platforms.create(width/2, height-(10/(scaleY)), "ground").setScale(scale*2).refreshBody();

    platforms.create(width*0.85, height/1.6, "ground").setScale(scale).refreshBody();
    platforms.create(width/15, height/2.3, "ground").setScale(scale).refreshBody();
    platforms.create(width/1.16, height/2.928, "ground").setScale(scale).refreshBody();;

    /****************The player ***************************/

    //Here we create the sprite, which is by default a dynamic physics object
    player = this.physics.add.sprite(100, height/1.33, "dude").setScale(scaleY);

    player.setBounce(0.2);
    //We prevent the player from exiting the bounds of the game by using world bounds colliders
    player.setCollideWorldBounds(true);

    //animation for running left, frames references the frames in the spritesheet
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10, //the framerate/speed of the animation
      repeat: -1, //-1 ensures it loops
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      framerate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    //adding a collider for the player and platforms
    this.physics.add.collider(player, platforms);

    //creating a cursor group to handle input
    cursors = this.input.keyboard.createCursorKeys();

    //creating some stars to give our game some purpose
    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 0.015*width, y: 0, stepX: 0.0875*width },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
      child.setScale(scaleY);
    });

    //handling star collisions
    this.physics.add.collider(stars, platforms);

    //Collisions/overlap with the player
    this.physics.add.overlap(player, stars, collectStar, null, this); //calls collectStar when an overlap is detected

    //adding a score
    scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    /*********************Bombs **************************/
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
  }

  //This is the update loop where we check for events happening
  function update() {
    //the if else block to handle side to side motion
    if (cursors.left.isDown) {
      player.setVelocityX(-160*scaleX);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160*scaleX);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn");
    }
    //Now lets handle the jumping
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-350*scaleY); //up is negative???
    }
  }

  function collectStar(player, star) {
    //here we disable its physics body and its parent game element
    star.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);

    //bomb releasing
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(width/2, width)
          : Phaser.Math.Between(0, width/2);

      var bomb = bombs.create(x, 16, "bomb").setScale(scaleY);
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-0.25*width, 0.25*width), 20);
    }
  }

  function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play("turn");

    gameOver = true;
  }
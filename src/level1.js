import Phaser from "phaser";

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Level1() {
        Phaser.Scene.call(this, { key: 'Level1' , active: true  })
    },

    preload: function () {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/bofmap6.json');
        // tiles in spritesheet
        this.load.spritesheet('tilemap', 'assets/tilemap.png', {frameWidth: 30, frameHeight: 30});
        // simple coin image
        this.load.image('coin', 'assets/coinGold.png');
        // player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('spider', 'assets/spider.png', 'assets/spider.json');
        this.load.atlas('snake', 'assets/Snake2.png', 'assets/snake.json');
        this.load.atlas('bof', 'assets/bof.png', 'assets/bof.json');
    },

   create: function() {
      // load the map
      this.map = this.make.tilemap({key: 'map'});

      // tiles for the ground layer
      var groundTiles = this.map.addTilesetImage('tilemap');
      // create the ground layer
      this.groundLayer = this.map.createDynamicLayer('ground', groundTiles, 0, 0);
      // the player will collide with this layer
      this.groundLayer.setCollisionByExclusion([-1]);

      // create the platforms layer
      this.platformLayer = this.map.createDynamicLayer('platforms', groundTiles, 0, 0);
      // the player will collide with this layer
      this.platformLayer.setCollisionByExclusion([-1]);

      console.log(this.platformLayer);

      this.platformBoundaries = this.map.createDynamicLayer('invisiblewalls', groundTiles, 0, 0);
      // the player will collide with this layer
      this.platformBoundaries.setCollisionByExclusion([-1]);

      // set the boundaries of our game world
      this.physics.world.bounds.width = this.groundLayer.width;
      this.physics.world.bounds.height = this.groundLayer.height;

      // create the player sprite
      this.player = this.physics.add.sprite(200, 900, 'bof');
      this.player.setBounce(0.2); // our player will bounce from items
      this.player.setCollideWorldBounds(true); // don't go out of the map


      // create the spider sprite
      /*
      spider = this.physics.add.sprite(400, 200, 'spider');
      spider.setBounce(0.2); // our player will bounce from items
      spider.setCollideWorldBounds(true); // don't go out of the map
      spider.body.onWorldBounds = true;
      spider.setVelocityX(20);
      spider.flipX = false;
      console.log(spider);
      */

      // create the spider sprite
      /*
      this.snake = this.physics.add.sprite(320, 208, 'snake');
      this.snake.setBounce(0.2); // our player will bounce from items
      this.snake.setCollideWorldBounds(true); // don't go out of the map
      this.snake.body.onWorldBounds = true;
      this.snake.setVelocityX(20);
      this.snake.flipX = false;
      console.log(this.snake);
      */

      // Let's get the spike objects, these are NOT sprites
      var spiders = this.map.getObjectLayer('spiders')['objects'];
      this.spidergroup = this.physics.add.group();

      // Now we create spikes in our sprite group for each object in our map
      spiders.forEach(spider => {
        // Add new spikes to our sprite group, change the start y position to meet the platform
        this.spidergroup.create(spider.x, spider.y-18, 'spider');
      });
      this.spidergroup.setVelocityX(20);

      var snakes = this.map.getObjectLayer('snakes')['objects'];
      this.snakegroup = this.physics.add.group();

      // Snakes
      console.log("snakes")
      console.log(snakes);
      snakes.forEach(snake => {
        console.log(snake.y);
        // Add new spikes to our sprite group, change the start y position to meet the platform
        this.snakegroup.create(snake.x, snake.y-18, 'snake');
      });
      this.snakegroup.setVelocityX(20);

      // spider walk animation
      this.anims.create({
          key: 'spiderr',
          frames: this.anims.generateFrameNames('spider', {prefix: 'sprite_', start: 0, end: 12}),
          frameRate: 10,
          repeat: -1
      });
      this.spidergroup.playAnimation('spiderr');
      //this.anims.play('spiderr');

      // snake animation
      this.anims.create({
          key: 'snake',
          frames: this.anims.generateFrameNames('snake', {prefix: 'sprite_', start: 0, end: 20}),
          frameRate: 10,
          repeat: -1
      });
      this.snakegroup.playAnimation('snake');
      //this.anims.play('snake');

      // small fix to our player images, we resize the physics body object slightly
      this.player.body.setSize(this.player.width, this.player.height-8);

      // player will collide with the level tiles
      this.physics.add.collider(this.groundLayer, this.player);
      this.physics.add.collider(this.platformLayer, this.player);
      this.physics.add.collider(this.groundLayer, this.spidergroup);
      this.physics.add.collider(this.platformBoundaries, this.spidergroup,this.reverseSprite,null,this);
      this.physics.add.collider(this.platformLayer, this.spidergroup);
      this.physics.add.collider(this.platformLayer, this.snakegroup);
      this.physics.add.collider(this.groundLayer, this.snakegroup);
      this.physics.add.collider(this.platformBoundaries, this.snakegroup);

      // when the player overlaps with a tile with index 17, collectCoin
      // will be called


      // player walk animation
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames('bof', {prefix: 'sprite_', start: 1, end: 2}),
          frameRate: 10,
          repeat: -1
      });
      // idle with only one frame, so repeat is not neaded
      this.anims.create({
          key: 'idle',
          frames: [{key: 'bof', frame: 'sprite_0'}],
          frameRate: 10,
      });


      this.cursors = this.input.keyboard.createCursorKeys();

      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      // make the camera follow the player
      this.cameras.main.startFollow(this.player);

      // set background color, so the sky is not black
      this.cameras.main.setBackgroundColor('#ccccff');

      // this text will show the score
      this.text = this.add.text(20, 570, '0', {
          fontSize: '20px',
          fill: '#ffffff'
      });
      // fix the text to the camera
      this.text.setScrollFactor(0);
  },

  // this function will be called when the player touches a coin
  collectCoin: function(sprite, tile) {
      return false;
  },

  update: function(time, delta) {
      //this.scene.pause();
      /*
      if(spider.body.position.x > this.physics.world.bounds.width-10) {
        console.log("position");
        console.log(spider.body.position.x);
      }*/
      /*
      if(spider.body.position.x >= spider.body.prev.x) {
        console.log("right");
        spider.setVelocityX(20);
        spider.flipX = false;
      } else {
        console.log("left");
        spider.setVelocityX(-20);
        spider.flipX = true;
      }*/

      if (this.cursors.left.isDown)
      {
          this.player.body.setVelocityX(-200);
          this.player.anims.play('walk', true); // walk left
          this.player.flipX = true; // flip the sprite to the left
      }
      else if (this.cursors.right.isDown)
      {
          this.player.body.setVelocityX(200);
          this.player.anims.play('walk', true);
          this.player.flipX = false; // use the original sprite looking to the right
      } else {
          this.player.body.setVelocityX(0);
          this.player.anims.play('idle', true);
      }
      // jump
      if (this.cursors.up.isDown && this.player.body.onFloor())
      {
          this.player.body.setVelocityY(-500);
      }
  },

  enemyHitsPlatform: function() {

  },

  render: function() {

      // Sprite debug info
      game.debug.spriteInfo(spidergroup, 32, 32);

  },

  reverseSprite: function() {
    var spidersright =  this.spidergroup.children.entries.filter(child => child.body.blocked.right)
    spidersright.forEach(spider => spider.flipX = true);
    spidersright.forEach(spider => spider.setVelocityX(-20));

    var spidersleft =  this.spidergroup.children.entries.filter(child => child.body.blocked.left)
    spidersleft.forEach(spider => spider.flipX = false);
    spidersleft.forEach(spider => spider.setVelocityX(20));

  }

});

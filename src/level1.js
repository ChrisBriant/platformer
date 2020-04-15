import Phaser from "phaser";

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Level1() {
        Phaser.Scene.call(this, { key: 'Level1' , active: true  })
    },

    preload: function () {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/bof4.json');
        // tiles in spritesheet
        this.load.spritesheet('world1tileset2', 'assets/world1tileset2.png', {frameWidth: 32, frameHeight: 32});
        // player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('worm', 'assets/worm.png', 'assets/worm.json');
    },

   create: function() {
      // load the map
      this.map = this.make.tilemap({key: 'map'});

      // tiles for the ground layer
      this.tiles = this.map.addTilesetImage('world1tileset2')

      this.platformLayer = this.map.createDynamicLayer('BG', this.tiles, 0, 0);
      // create the platforms layer
      this.platformLayer = this.map.createDynamicLayer('platformLayer', this.tiles, 0, 0);
      // the player will collide with this layer
      this.platformLayer.setCollisionByExclusion([-1]);


      this.platformBoundaries = this.map.createDynamicLayer('invisiblewalls', this.tiles, 0, 0);
      this.platformBoundaries.setCollisionByExclusion([-1])
      
      // set the boundaries of our game world
      this.physics.world.bounds.width = this.tiles.width;
      this.physics.world.bounds.height = this.tiles.height;

      // create the player sprite
      console.log(this.map.heightInPixels);
      //this.player = this.physics.add.sprite(100,this.tiles.height - 64, 'player');
      this.player = this.physics.add.sprite(100,this.map.heightInPixels-64, 'player');
      this.player.setBounce(0.2); // our player will bounce from items
      this.player.setCollideWorldBounds(true); // don't go out of the map


      // create the worm sprite
      var worms = this.map.getObjectLayer('worms')['objects'];
      this.wormgroup = this.physics.add.group();

      worms.forEach(worm => {
        this.wormgroup.create(worm.x, worm.y-18, 'worm');
      });
      this.wormgroup.setVelocityX(20);

      // spider walk animation
      this.anims.create({
          key: 'wormmove',
          frames: this.anims.generateFrameNames('worm', {prefix: 'worm ',suffix: '.aseprite', start: 0, end: 6}),
          frameRate: 10,
          repeat: -1
      });
      this.wormgroup.playAnimation('worm');
      //this.anims.play('spiderr');

      /*
      // snake animation
      this.anims.create({
          key: 'snake',
          frames: this.anims.generateFrameNames('snake', {prefix: 'sprite_', start: 0, end: 20}),
          frameRate: 10,
          repeat: -1
      });
      this.snakegroup.playAnimation('snake');
      //this.anims.play('snake');
      */
      // small fix to our player images, we resize the physics body object slightly
      this.player.body.setSize(this.player.width, this.player.height-8);

      // player will collide with the level tiles
      this.physics.add.collider(this.platformLayer, this.wormgroup);
      this.physics.add.collider(this.platformLayer, this.player);
      this.physics.add.collider(this.platformBoundaries, this.player)
      this.physics.add.collider(this.platformBoundaries, this.wormgroup,this.reverseSprite,null,this);

      // when the player overlaps with a tile with index 17, collectCoin
      // will be called


      // player walk animation
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 0, end: 16}),
          frameRate: 10,
          repeat: -1
      });
      // player walk animation
      this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 16, end: 16}),
          frameRate: 10,
          repeat: 0
      });
      // player walk animation
      this.anims.create({
          key: 'jump',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 19, end: 19}),
          frameRate: 10,
          repeat: 0
      });
      // player walk animation
      this.anims.create({
          key: 'tailwhip',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 20, end: 27}),
          frameRate: 10,
          repeat: -1
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
          this.player.body.setVelocityY(-400);
      }
  },

  enemyHitsPlatform: function() {

  },

  render: function() {

      // Sprite debug info
      game.debug.spriteInfo(spidergroup, 32, 32);

  },

  reverseSprite: function() {
    var wormsright =  this.wormgroup.children.entries.filter(child => child.body.blocked.right)
    wormsright.forEach(worm => worm.flipX = true);
    wormsright.forEach(worm => worm.setVelocityX(-20));

    var wormsleft =  this.wormgroup.children.entries.filter(child => child.body.blocked.left)
    wormsleft.forEach(worm => worm.flipX = false);
    wormsleft.forEach(worm => worm.setVelocityX(20));

  }

});

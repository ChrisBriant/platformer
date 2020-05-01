import Phaser from "phaser";
//import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Level1_2() {
        Phaser.Scene.call(this, { key: 'Level1_2' , active: true  })
    },

    preload: function () {
        this.load.rexWebFont({
          google: {
              families: ['Fontdiner Swanky','Bangers']
          },
          // testString: undefined,
          // testInterval: 20,
        });
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/World1/level1-2.json');
        // tiles in spritesheet
        this.load.spritesheet('level1-2TileSet', 'assets/World1/level1-2TileSet.png', {frameWidth: 32, frameHeight: 32});
        // player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('worm', 'assets/worm.png', 'assets/worm.json');
        this.load.atlas('cauli', 'assets/cauliflower.png', 'assets/cauliflower.json');
        this.load.atlas('tulip', 'assets/tulip.png', 'assets/tulip.json');
        this.load.atlas('mouse', 'assets/mouse.png', 'assets/mouse.json');
        this.load.atlas('seed', 'assets/seed.png', 'assets/seed.json');
        this.load.atlas('diamond', 'assets/diamond.png', 'assets/diamond.json');
        this.load.atlas('bullet', 'assets/bullet.png', 'assets/bullet.json');
        this.load.image('tailbombicon', 'assets/tailbombtile.png');
        this.load.image('lifeicon', 'assets/life.png');
        this.load.image('playerbullet', 'assets/tailbomb.png');
        //For player death
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },

   create: function() {
     //Control variables
     this.playerIsDead = false;
     this.playerAttack = false;
     this.canShoot = false;
     this.score = 0;
     this.enemyVelocityX = 20;
     this.crouching = false;
     this.shooting = false;
     this.bouncing = false;
     this.attackTimers = [];
     this.playDeathText = false;
     this.playerRespawnX = 0;
     this.playerRespawnY = 0;
     this.invulnerable = false;

     //Sprite groups for enemy deaths
     this.deadworms = this.physics.add.group();

      // load the map
      this.map = this.make.tilemap({key: 'map'});

      // tiles for the ground layer
      this.tiles = this.map.addTilesetImage('level1-2TileSet')

      this.platformLayer = this.map.createDynamicLayer('BG', this.tiles, 0, 0);
      // create the platforms layer
      this.platformLayer = this.map.createDynamicLayer('platformLayer', this.tiles, 0, 0);
      // the player will collide with this layer
      this.platformLayer.setCollisionByExclusion([-1]);

      this.ladders = this.map.createDynamicLayer('ladders', this.tiles, 0, 0);
      // the player will collide with this layer
      this.ladders.setCollisionByExclusion([-1]);


      this.platformBoundaries = this.map.createDynamicLayer('invisiblewalls', this.tiles, 0, 0);
      this.platformBoundaries.setCollisionByExclusion([-1])

      // set the boundaries of our game world
      this.physics.world.bounds.width = this.tiles.widthInPixels;
      this.physics.world.bounds.height = this.tiles.heightInPixels;

      // create the player sprite
      console.log(this.map.heightInPixels);
      //Default
      this.player = this.physics.add.sprite(100,this.map.heightInPixels-64, 'player');
      //Near tailbomb
      //this.player = this.physics.add.sprite(325,5796, 'player');
      //Near cauliflower
      //this.player = this.physics.add.sprite(173,7172, 'player');

      //this.player = this.physics.add.sprite(449,1998, 'player')
      //Near tuplips
      //this.player = this.physics.add.sprite(275,2084, 'player');
      //Near Mouse
      //this.player = this.physics.add.sprite(190,836, 'player');
      this.player.facingRight = true;
      this.player.setBounce(0.2); // our player will bounce from items
      this.player.setCollideWorldBounds(true); // don't go out of the map
      this.player.lives = 1;

      //var thewormtest = this.physics.add.sprite(450,this.map.heightInPixels-300, 'worm')
      //thewormtest.body.setSize(200,200);
      //this.physics.add.collider(thewormtest,this.platformLayer);

      //Projectiles
      /*
      this.seedgroupright = this.physics.add.group();
      this.anims.create({
          key: 'seedright',
          frames: this.anims.generateFrameNames('seed', {prefix: 'seed ',suffix: '.aseprite', start: 0, end: 3}),
          frameRate: 10,
          repeat: -1
      });
      this.seedgroupright.playAnimation('seedright');

      this.seedgroupleft = this.physics.add.group();
      this.anims.create({
          key: 'seedleft',
          frames: this.anims.generateFrameNames('seed', {prefix: 'seed ',suffix: '.aseprite', start: 0, end: 3}),
          frameRate: 10,
          repeat: -1
      });
      this.seedgroupleft.playAnimation('seedleft');
      console.log(this.anims);


      this.bulletgroupright = this.physics.add.group();
      this.anims.create({
          key: 'bulletright',
          frames: this.anims.generateFrameNames('bullet', {prefix: 'bullet ',suffix: '.aseprite', start: 0, end: 4}),
          frameRate: 10,
          repeat: -1
      });
      this.bulletgroupright.playAnimation('bulletright');
      //this.bulletgroupright.setGravity(0);

      this.bulletgroupleft = this.physics.add.group();
      this.anims.create({
          key: 'bulletleft',
          frames: this.anims.generateFrameNames('bullet', {prefix: 'bullet ',suffix: '.aseprite', start: 0, end: 4}),
          frameRate: 10,
          repeat: -1
      });
      this.bulletgroupleft.playAnimation('bulletleft');

      this.playerbullet = this.physics.add.group();

      console.log(this.anims);

      //Collectibles
      var tailbombs = this.map.getObjectLayer('tailbombicon')['objects'];
      this.tailbombicongroup = this.physics.add.group();

      tailbombs.forEach(icon => {
        var tailbomb = this.tailbombicongroup.create(icon.x, icon.y-18, 'tailbombicon');
        tailbomb.setBounce(0.4);
      });

      var lives = this.map.getObjectLayer('lives')['objects'];
      this.lifeicongroup = this.physics.add.group();

      lives.forEach(icon => {
        var life = this.lifeicongroup.create(icon.x, icon.y-18, 'lifeicon');
        life.setBounce(0.4);
      });

      var diamonds = this.map.getObjectLayer('diamonds')['objects'];
      this.diamondgroup = this.physics.add.group();

      diamonds.forEach(icon => {
        var diamond = this.diamondgroup.create(icon.x, icon.y-18, 'diamond');
        diamond.body.setAllowGravity(false);
      });
      //Rotate diamond
      this.anims.create({
          key: 'diamond',
          frames: this.anims.generateFrameNames('diamond', {prefix: 'diamond2 ',suffix: '.aseprite', start: 0, end: 12}),
          frameRate: 10,
          repeat: -1
      });
      this.diamondgroup.playAnimation('diamond');

      //bounce icons every so often
      this.iconBounceTimer = this.time.addEvent({
        delay: 2000,
        callback: function() {
          this.tailbombicongroup.setVelocityY(-200);
          this.lifeicongroup.setVelocityY(-200);
        },
        callbackScope: this,
        loop: true
      });

      // create the worm sprite
      var worms = this.map.getObjectLayer('worms')['objects'];
      this.wormgroup = this.physics.add.group();

      worms.forEach(worm => {
        var wormsprite = this.wormgroup.create(worm.x, worm.y-18, 'worm');
        wormsprite.hitpoints = 0;
        wormsprite.scoreval = 20;
        wormsprite.invulnerabilityTimer = 0;
        wormsprite.setVelocityX(10);
        wormsprite.flipX = true;
      });
      this.wormgroup.setVelocityX(20);

      // worm walk animation
      this.anims.create({
          key: 'wormmove',
          frames: this.anims.generateFrameNames('worm', {prefix: 'worm ',suffix: '.aseprite', start: 0, end: 6}),
          frameRate: 10,
          repeat: -1
      });
      this.wormgroup.playAnimation('wormmove');


      // create the cauliflower sprite
      var caulis = this.map.getObjectLayer('cauliflowers')['objects'];
      this.cauligroup = this.physics.add.group();

      caulis.forEach(cauli => {
        var caulisprite = this.cauligroup.create(cauli.x, cauli.y-18, 'cauli');
        caulisprite.hitpoints = 1;
        caulisprite.scoreval = 40;
        caulisprite.invulnerabilityTimer = 0;
        //caulisprite.setBounceX(0.25);
        //caulisprite.setDragX(4);
      });
      this.cauligroup.setVelocityX(20);

      // worm walk animation
      this.anims.create({
          key: 'caulimove',
          frames: this.anims.generateFrameNames('cauli', {prefix: 'cauliflower ',suffix: '.aseprite', start: 0, end: 8}),
          frameRate: 10,
          repeat: -1
      });
      this.cauligroup.playAnimation('caulimove');


      // create the tulip sprites
      var tulips = this.map.getObjectLayer('tulips')['objects'];
      this.tulipgroup = this.physics.add.group();

      tulips.forEach(tulip => {
        var tulipsprite = this.tulipgroup.create(tulip.x, tulip.y-18, 'tulip');
        tulipsprite.hitpoints = 0;
        tulipsprite.scoreval = 80;
        tulipsprite.on('animationcomplete',function () {
            if(tulipsprite.anims.currentAnim.key == 'tulipshoot') {
              this.tulipgroup.playAnimation('tulipmove');
              var rightseed = this.seedgroupright.create(tulipsprite.x+16, tulipsprite.y-24, 'seed');
              rightseed.setVelocity(100,-400);
              var leftseed = this.seedgroupleft.create(tulipsprite.x-16, tulipsprite.y-24, 'seed');
              leftseed.setVelocity(-100,-400);
            }
        }, this );
      });
      this.tulipgroup.setVelocityX(0);



      // tulip movement
      this.anims.create({
          key: 'tulipmove',
          frames: this.anims.generateFrameNames('tulip', {prefix: 'tulip ',suffix: '.aseprite', start: 0, end: 8}),
          frameRate: 10,
          repeat: -1
      });
      //Tulip shoots seeds
      this.anims.create({
          key: 'tulipshoot',
          frames: this.anims.generateFrameNames('tulip', {prefix: 'tulip ',suffix: '.aseprite', start: 9, end: 20}),
          frameRate: 10,
          repeat: 0
      });
      this.tulipgroup.playAnimation('tulipmove');

      //Shoot every so often
      this.tulipShootTimer = this.time.addEvent({
        delay: 5000,
        callback: function() {
            this.tulipgroup.playAnimation('tulipshoot',true);
        },
        callbackScope: this,
        loop: true
      });

      //Mouse
      var mice = this.map.getObjectLayer('mice')['objects'];
      this.mousegroup = this.physics.add.group();

      mice.forEach(mouse => {
        var mousesprite = this.mousegroup.create(mouse.x, mouse.y-18, 'mouse');
        mousesprite.hitpoints = 2;
        mousesprite.scoreval = 100;
        mousesprite.on('animationcomplete',function () {
            if(mousesprite.anims.currentAnim.key == 'mouseshoot') {
              this.mousegroup.playAnimation('mousemove');
              if(mousesprite.body.velocity.x > 0) {
                var rightbullet = this.physics.add.sprite(mousesprite.x+32, mousesprite.y-16, 'bullet')
                rightbullet.body.setAllowGravity(false);
                var moveTo = this.plugins.get('rexMoveTo').add(rightbullet, {
                    speed: 80
                });
                moveTo.on('complete', function(gameObject, moveTo){ gameObject.destroy(); });
                moveTo.moveTo(this.map.widthInPixels,mousesprite.y-16)
              }  else {
                var leftbullet = this.bulletgroupleft.create(mousesprite.x-32, mousesprite.y-16, 'bullet');
                leftbullet.body.setAllowGravity(false);
                var moveTo = this.plugins.get('rexMoveTo').add(leftbullet, {
                    speed: 80
                });
                moveTo.on('complete', function(gameObject, moveTo){ gameObject.destroy(); });
                moveTo.moveTo(0,mousesprite.y-16);
              }
            }
        }, this );
      });
      this.mousegroup.setVelocityX(-20);

      // mouse movement
      this.anims.create({
          key: 'mousemove',
          frames: this.anims.generateFrameNames('mouse', {prefix: 'mouse ',suffix: '.aseprite', start: 0, end: 8}),
          frameRate: 10,
          repeat: -1
      });
      //mouse shoots seeds
      this.anims.create({
          key: 'mouseshoot',
          frames: this.anims.generateFrameNames('mouse', {prefix: 'mouse ',suffix: '.aseprite', start: 9, end: 22}),
          frameRate: 10,
          repeat: 0
      });
      this.mousegroup.playAnimation('mousemove');

      //Shoot every so often
      this.mouseShootTimer = this.time.addEvent({
        delay: 5000,
        callback: function() {
            this.mousegroup.playAnimation('mouseshoot',true);
        },
        callbackScope: this,
        loop: true
      });



      // small fix to our player images, we resize the physics body object slightly
      this.player.body.setSize(this.player.width, this.player.height-8);

      */
      // player will collide with the level tiles
      this.playerColliders = [];

      /*
      this.physics.add.collider(this.platformLayer, this.wormgroup);
      this.physics.add.collider(this.platformLayer, this.cauligroup);
      this.physics.add.collider(this.platformLayer, this.tulipgroup);
      this.physics.add.collider(this.platformLayer, this.mousegroup);
      this.physics.add.collider(this.platformLayer, this.tailbombicongroup);
      this.physics.add.collider(this.platformLayer, this.lifeicongroup);
      this.physics.add.collider(this.platformLayer, this.seedgroupright,this.destroySprite,null,this);
      this.physics.add.collider(this.platformLayer, this.seedgroupleft,this.destroySprite,null,this);
      */
      this.physics.add.collider(this.platformLayer, this.player);
      this.physics.add.collider(this.player,this.ladders,this.climb,null,this);
      //this.playerColliders.push(this.physics.add.collider(this.platformLayer, this.player));
      this.physics.add.collider(this.platformBoundaries, this.wormgroup,this.reverseSprite,null,this);
      this.physics.add.collider(this.platformBoundaries, this.cauligroup,this.reverseSprite,null,this);
      this.physics.add.collider(this.platformBoundaries, this.mousegroup,this.reverseSprite,null,this);
      //Enemy collisions
      /*
      this.playerColliders.push(this.physics.add.collider(this.wormgroup, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.cauligroup, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.tulipgroup, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.mousegroup, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.bulletgroupleft, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.bulletgroupright, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.seedgroupleft, this.player, this.hitPlayer,null,this));
      this.playerColliders.push(this.physics.add.collider(this.seedgroupright, this.player, this.hitPlayer,null,this));
      //Player bullets colliders
      this.physics.add.collider(this.playerbullet, this.wormgroup,this.enemyShot,null,this);
      this.physics.add.collider(this.playerbullet, this.cauligroup,this.enemyShot,null,this);
      this.physics.add.collider(this.playerbullet, this.tulipgroup,this.enemyShot,null,this);
      this.physics.add.collider(this.playerbullet, this.mousegroup,this.enemyShot,null,this);
      //Player on over icon
      */

      // when the player overlaps with a tile with index 17, collectCoin
      // will be called
      /*
      this.physics.add.overlap(this.player, this.tailbombicongroup,function(player,sprite) {
        sprite.destroy();
        this.canShoot = true;
      },null,this);
      this.physics.add.overlap(this.player, this.lifeicongroup,function(player,sprite) {
        sprite.destroy();
        this.player.lives++;
      },null,this);
      this.physics.add.overlap(this.player, this.diamondgroup,function(player,sprite) {
        sprite.destroy();
        this.score+=10;
      },null,this);
      */

      // player walk animation
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 0, end: 16}),
          frameRate: 10,
          repeat: -1
      });
      //Stop crouching when the key changes
      this.player.on('animationcomplete',function () {
          if(this.player.anims.currentAnim.key == 'walk') {
            this.crouching=false;
          }
      }, this );
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
      // player death animation
      this.anims.create({
          key: 'death',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 28, end: 33}),
          frameRate: 10,
          repeat: 0
      });
      // player crouch animation
      this.anims.create({
          key: 'crouchdown',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 46, end: 52}),
          frameRate: 10,
          repeat: 0
      });
      this.anims.create({
          key: 'crouchup',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 63, end: 69}),
          frameRate: 10,
          repeat: 0
      });
      //Stop crouching when the key changes
      this.player.on('animationcomplete',function () {
          if(this.player.anims.currentAnim.key == 'crouchup') {
            this.crouching=false;
          }
      }, this );
      this.anims.create({
          key: 'standshoot',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 34, end: 45}),
          frameRate: 10,
          repeat: 0
      });
      this.anims.create({
          key: 'crouchshoot',
          frames: this.anims.generateFrameNames('player', {prefix: 'bof ', suffix: '.aseprite', start: 53, end: 62}),
          frameRate: 10,
          repeat: 0
      });
      console.log('player');
      console.log(this.player);
      this.player.on('animationcomplete',function () {
          if(this.player.anims.currentAnim.key == 'standshoot' || this.player.anims.currentAnim.key == 'crouchshoot') {
            this.shooting=false;
            if(this.player.facingRight) {
              if (this.player.anims.currentAnim.key == 'standshoot'){
                var rightbullet = this.playerbullet.create(this.player.x+32, this.player.y-14, 'playerbullet');
              } else {
                var rightbullet = this.playerbullet.create(this.player.x+32, this.player.y+20, 'playerbullet');
              }
              rightbullet.body.setAllowGravity(false);
              var moveTo = this.plugins.get('rexMoveTo').add(rightbullet, {
                  speed: 80
              });
              moveTo.on('complete', function(gameObject, moveTo){ gameObject.destroy(); console.log(gameObject) });
              if (this.player.anims.currentAnim.key == 'standshoot'){
                moveTo.moveTo(this.map.widthInPixels,this.player.y-14)
              } else {
                moveTo.moveTo(this.map.widthInPixels,this.player.y+20);
              }
            } else {
              if (this.player.anims.currentAnim.key == 'standshoot'){
                var leftbullet = this.playerbullet.create(this.player.x-32, this.player.y-14, 'playerbullet');
              } else {
                var leftbullet = this.playerbullet.create(this.player.x-32, this.player.y+20, 'playerbullet');
              }
              leftbullet.body.setAllowGravity(false);
              var moveTo = this.plugins.get('rexMoveTo').add(leftbullet, {
                  speed: 80
              });
              moveTo.on('complete', function(gameObject, moveTo){ gameObject.destroy(); });
              if (this.player.anims.currentAnim.key == 'standshoot'){
                moveTo.moveTo(0,this.player.y-14);
              } else {
                moveTo.moveTo(0,this.player.y+20);
              }
            }
          }
      }, this );





      this.cursors = this.input.keyboard.createCursorKeys();
      //this.dkey = this.input.keyboard.addKeys(Phaser.Input.Keyboard.KeyCodes.W);
      //console.log(this.dkey);
      var thePlayer = this.player;
      this.input.keyboard.on('keydown_ENTER', function (event) {
          console.log("Player Location");
          console.log(thePlayer.x);
          console.log(thePlayer.y);
      });

      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      // make the camera follow the player
      this.cameras.main.startFollow(this.player);

      // set background color, so the sky is not black
      this.cameras.main.setBackgroundColor('#ccccff');

      // this text will show the score
      this.scoretext = this.add.text(120, 10, 'Score ' + this.score, {
          fontSize: '20px',
          fill: '#ffffff'
      });
      // fix the text to the camera
      this.scoretext.setScrollFactor(0);

      //Add the screen text
      this.lifetext = this.add.text(10, 10, 'Lives ' + this.player.lives, {
          fontSize: '20px',
          fill: '#ffffff'
      });
      this.lifetext.setScrollFactor(0);

      //Death text
      this.deathtextcounter = 0;
      //this.lvltxt;
      //var thisscene = this;
      /*
      this.lvltext = this.add.text(100, 100, 'LEVEL TEXT ', {
          fontSize: '20px',
          fill: '#ffffff'
      });

      */
      //var lvltxt = this.lvltxt;

      /*
      WebFont.load({
          google: {
              families: [ 'Faster One', 'Finger Paint', 'Nosifer','Fontdiner Swanky' ]
          },
          active: function () {
            console.log("ACTIVE");
            console.log(thisscene.lvltxt);
            /*


          }
      });
      */
      this.lvltxt = this.add.text(200, -100, 'You Died', { fontFamily: 'Fontdiner Swanky', fontSize: 60, color: '#7b4585' });
      this.lvltxt.setStroke('#bbbe4b',8);
      this.lvltxt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
      this.lvltxt.setScrollFactor(0);

  },


  update: function(time, delta) {
      //Update on screen text
      this.lifetext.setText("Lives " + this.player.lives);
      this.scoretext.setText("Score " + this.score);

      if(!this.playerIsDead) {
        //For shooting
        if(this.cursors.shift.isDown && !this.crouching && this.canShoot) {
          this.player.anims.play('standshoot', true);
          this.shooting = true;
        } else if (this.cursors.shift.isDown && this.crouching && this.canShoot) {
          this.player.anims.play('crouchshoot', true);
        } else {

          if(this.cursors.down.isDown && !this.crouching) {
            //Crouching
            this.player.body.setVelocityX(0);
            this.player.anims.play('crouchdown', true);
            this.crouching = true;
          } else if (this.cursors.down.isUp && this.crouching) {
            this.player.body.setVelocityX(0);
            this.player.anims.play('crouchup', true);
          } else {
            //Normal Movement
            if (this.cursors.left.isDown)
            {
                this.player.body.setVelocityX(-200);
                if(!this.playerAttack) {
                  this.player.anims.play('walk', true); // walk left
                }
                this.player.flipX = true; // flip the sprite to the left
                this.player.facingRight = false;
            }
            else if (this.cursors.right.isDown)
            {
                this.player.body.setVelocityX(200);
                if(!this.playerAttack) {
                  this.player.anims.play('walk', true);
                }
                this.player.flipX = false; // use the original sprite looking to the right
                this.player.facingRight = true;
            } else {
                this.player.body.setVelocityX(0);
                if(!this.playerAttack && !this.crouching && !this.shooting) {
                  this.player.anims.play('idle', true);
                }
            }
          }
        }
        // jump
        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-400);
        }
        //Attack
        if (this.cursors.space.isDown) {
          if(!this.playerAttack) {
            this.player.anims.play('tailwhip',true);
            this.attackTimer = this.time.addEvent({
              delay: 1000,
              callback: function() { this.playerAttack = false; console.log("finishedattack") },
              callbackScope: this,
              loop: false
            });
          }
          this.playerAttack = true;
          //Stop the attack from running
          console.log(this.attackTimer);
        }

        //Destroy any sprites falling off the screen
        var destroyWorms = this.deadworms.children.entries.filter(child => child.y > this.map.heightInPixels);
        if(destroyWorms.length > 0) {
          destroyWorms.forEach(worm => worm.destroy());
        }

        /*
        var spritesWithIncorrectVelocity = this.cauligroup.children.entries.filter(child => child.body.velocity.x != this.enemyVelocityX || child.body.velocity.x != (this.enemyVelocityX * -1));
        for(var i=0;i<spritesWithIncorrectVelocity .length;i++) {
          if(spritesWithIncorrectVelocity.length > 0) {
            console.log("Sprites Exist")
          }
          if (spritesWithIncorrectVelocity[i].body.velocity.x < this.enemyVelocityX) {
            spritesWithIncorrectVelocity[i].setAccelerationX(20);
          } else if (spritesWithIncorrectVelocity[i].body.velocity.x > this.enemyVelocityX) {
            spritesWithIncorrectVelocity[i].setAccelerationX(-20);
          } else {
            spritesWithIncorrectVelocity[i].setAccelerationX(0);
          }
        }*/

        //Bounce back sprites
        /*
        if(this.bouncing.length > 0) {
          for(var i=0;i<this.bouncing.length;i++) {
            if(this.bouncing[i].bounceTimer == 0) {
              var vel = this.bouncing[i].body.velocity.x;
              this.bouncing[i].setVelocityX(vel*-1);
              this.bouncing.pop(this.bouncing[i])
            } else {
              this.bouncing[i].bounceTimer--;
            }
          }
        }*/
      } else {
        if(this.playDeathText) {
          if(this.deathtextcounter < 190) {
            this.deathtextcounter += 5;
            this.lvltxt.setPosition(200,this.deathtextcounter);
          }
          if(this.cursors.space.isDown) {
            if(this.player.lives <=0) {
              this.scene.start('PlayerDied');
            }
            this.deadplayer.destroy();
            this.playerIsDead = false;
            this.player.setVelocityY(0);
            //this.playerColliders.forEach(collider =>
              //collider.active = true
            //);

            //reset text
            console.log(this.player);
            this.invulnerable = true;
            this.invulnerableTimer = this.time.addEvent({
              delay: 2000,
              callback: function() { this.invulnerable = false; },
              callbackScope: this,
              loop: false
            });
            this.deathtextcounter = 0;
            this.playDeathText = false;
            this.lvltxt.setPosition(200,-100);
            this.player.anims.play('idle',true);
            this.playerColliders.forEach(collider => collider.active = true);
            //respawn the player - recreate the colliders

            /*
            this.playerColliders = [];
            //this.playerColliders.push(this.physics.add.collider(this.platformLayer, this.player));
            this.playerColliders.push(this.physics.add.collider(this.wormgroup, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.cauligroup, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.tulipgroup, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.mousegroup, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.bulletgroupleft, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.bulletgroupright, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.seedgroupleft, this.player, this.hitPlayer,null,this));
            this.playerColliders.push(this.physics.add.collider(this.seedgroupright, this.player, this.hitPlayer,null,this));
            */

            //this.player.setPosition(this.playerRespawnX,this.playerRespawnY);
            this.player.x = this.playerRespawnX;
            this.player.y = this.playerRespawnY-34;
            this.player.setVisible(true);
            //this.playerColliders.forEach(collider => collider.active = true);
          }
        }
        console.log(this.playerRespawnY);

      }

  },

  enemyHitsPlatform: function() {

  },

  render: function() {

      // Sprite debug info
      game.debug.spriteInfo(spidergroup, 32, 32);

  },

  /*
  reverseSprite: function() {
    var wormsright =  this.wormgroup.children.entries.filter(child => child.body.blocked.right)
    wormsright.forEach(worm => worm.flipX = true);
    wormsright.forEach(worm => worm.setVelocityX(-20));

    var wormsleft =  this.wormgroup.children.entries.filter(child => child.body.blocked.left)
    wormsleft.forEach(worm => worm.flipX = false);
    wormsleft.forEach(worm => worm.setVelocityX(20));

  },*/

  reverseSprite: function(sprite,boundary) {
    if(sprite.body.blocked.right) {
      sprite.setVelocityX(-20);
      sprite.flipX = false;
    } else {
      sprite.setVelocityX(20);
      sprite.flipX = true;
    }
  },

  hitPlayer: function(player,worm) {
    //Get the enemy sprite texture
    var enemyTexture = worm.texture;
    console.log(enemyTexture);

    if(enemyTexture.key === 'bullet' ||  enemyTexture.key === 'seed') {
      worm.setVisible(false);
      var playerDeathX = player.x;
      var playerDeathY = player.y;
      this.playerRespawnX = player.x;
      this.playerRespawnY = player.y;
      this.player.setVisible(false);
      this.player.lives -= 1;
      this.deadplayer = this.physics.add.sprite(player.x,player.y, 'player');
      this.deadplayer.setVelocityY(-400)
      this.deadplayer.setVelocityX(0)
      this.deadplayer.anims.play('death',true);
      this.playerIsDead = true;
      this.timer = this.time.addEvent({
        delay: 2000,
        callback: function() { this.playDeathText=true; },
        callbackScope: this,
        loop: true
      });
      //this.input.keyboard.removeCapture(37,38,39,40);
      this.playerColliders.forEach(collider => collider.active = false);
      //this.player.checkCollision.none = true;
      this.player.setVelocityX(0);
      this.player.setVelocityY(-400);
    } else {
      if(this.playerAttack) {
        if(worm.hitpoints == 0) {
          //Die
          var sprite = this.deadworms.create(worm.x, worm.y, 'worm');
          sprite.anims.play(enemyTexture.key+'move');
          this.score += worm.scoreval;
          //this.deadworms.playAnimation(enemyTexture.key+'move');
          this.deadworms.setVelocity(0,-400);
          worm.destroy();
        } else {
            console.log(worm);
            //var wormvel = worm.body.velocity.x;
            worm.hitpoints -= 1;


            if(!this.bouncing) {
              this.bouncing = true;

              this.enemyBounceBackTimer = this.time.addEvent({
                delay: 500,
                callback: function() {
                    if(worm.hitpoints > 0) {
                      worm.setVelocityX(worm.body.velocity.x * -1);
                      this.bouncing = false;
                    }
                },
                callbackScope: this,
                loop: false
              });
            }
        }
      } else {
        if(!this.invulnerable) {
          //Run death sequence
          var playerDeathX = player.x;
          var playerDeathY = player.y;
          this.playerIsDead = true;
          this.playerRespawnX = player.x;
          this.playerRespawnY = player.y;
          this.player.setVisible(false);
          this.player.lives -= 1;
          this.deadplayer = this.physics.add.sprite(player.x,player.y, 'player');
          this.deadplayer.setVelocityY(-400)
          this.deadplayer.setVelocityX(0)
          this.deadplayer.anims.play('death',true);
          this.timer = this.time.addEvent({
            delay: 2000,
            callback: function() { this.playDeathText = true; },
            callbackScope: this,
            loop: true
          });
          //this.input.keyboard.removeCapture(37,38,39,40);
          this.playerColliders.forEach(collider => collider.active = false);
          //this.player.checkCollision.none = true;
          this.player.setVelocityX(0);
          this.player.setVelocityY(-400);
        }
      }
    }
  },

  //Set the attack mode
  playerAttack: function() {
    this.playerAttack = true;
    //Stop the attack from running
    this.attackTimer = this.time.addEvent({
      delay: 2000,
      callback: function() { this.playerAttack = false; },
      callbackScope: this,
      loop: true
    });
  },

  //Destroy a projectile sprite if it hits an obsticle
  destroySprite: function(sprite,platform) {
    sprite.destroy();
  },

  enemyShot: function(bullet,sprite) {
    var enemyTexture = sprite.texture;
    bullet.setVisible(false);

    if(sprite.hitpoints <= 0) {
      //Die
      this.deadworms.create(sprite.x, sprite.y, enemyTexture.key);
      this.deadworms.playAnimation(enemyTexture.key+'move');
      this.deadworms.setVelocity(0,-400);
      this.score += sprite.scoreval;
      sprite.destroy();
    } else {
      sprite.hitpoints--;
    }
  },

  climb: function(ladder,player) {
    console.log("climb");
  }

});

import Phaser from "phaser";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var spider;
var spidergroup;
var cursors;
var groundLayer, coinLayer, platformLayer, platformBoundaries;
var text;
var score = 0;

function preload() {

    // map made with Tiled in JSON format
    //this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet
    //this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/bofmap5.json');
    // tiles in spritesheet
    this.load.spritesheet('tilemap', 'assets/tilemap.png', {frameWidth: 30, frameHeight: 30});
    // simple coin image
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    this.load.atlas('spider', 'assets/spider.png', 'assets/spider.json');
    this.load.atlas('bof', 'assets/bof.png', 'assets/bof.json');
}

function create() {
    // load the map
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tilemap');
    // create the ground layer
    groundLayer = map.createDynamicLayer('ground', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // create the platforms layer
    platformLayer = map.createDynamicLayer('platforms', groundTiles, 0, 0);
    // the player will collide with this layer
    platformLayer.setCollisionByExclusion([-1]);

    console.log(platformLayer);

    platformBoundaries = map.createDynamicLayer('invisiblewalls', groundTiles, 0, 0);
    // the player will collide with this layer
    platformBoundaries.setCollisionByExclusion([-1]);

    // coin image used as tileset
    //var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    //coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    //this.physics.world.bounds.width = 800;
    //this.physics.world.bounds.height = 600;

    // create the player sprite
    player = this.physics.add.sprite(200, 200, 'bof');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map


    //Create the line for the spider to follow NOT USED
    /*
    var curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(400, 1600), new Phaser.Math.Vector2(700, 1600));
    var graphics = this.add.graphics();
    graphics.lineStyle(1, 0x000000, 0.5);
    curve.draw(graphics);
    */

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

    // Let's get the spike objects, these are NOT sprites
    var spiders = map.getObjectLayer('spiders')['objects'];
    spidergroup = this.physics.add.group();

    // Now we create spikes in our sprite group for each object in our map
    console.log(spiders);
    spiders.forEach(spider => {
      console.log(spider.y);
      // Add new spikes to our sprite group, change the start y position to meet the platform
      spidergroup.create(spider.x, spider.y, 'spider');
    });
    console.log(spidergroup);

    //Below doesn't work
    /*
    spider.body.world.on('worldbounds', function(body) {
      // Checks if it's the sprite that you'listening for
      if (body.gameObject === this) {
        // Make the enemy change direction
        this.setVelocityX(-20);
      }
    }, spider);
    */

    // spider walk animation
    this.anims.create({
        key: 'spiderr',
        frames: this.anims.generateFrameNames('spider', {prefix: 'sprite_', start: 0, end: 12}),
        frameRate: 10,
        repeat: -1
    });
    //spider.anims.play('spiderr');


    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);

    // player will collide with the level tiles
    this.physics.add.collider(groundLayer, player);
    this.physics.add.collider(platformLayer, player);
    this.physics.add.collider(groundLayer, spidergroup);
    this.physics.add.collider(platformBoundaries, spidergroup);
    this.physics.add.collider(platformLayer, spider,enemyHitsPlatform,null,this);

    //coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin
    // will be called
    //this.physics.add.overlap(player, coinLayer);

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


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);

    //console.log(platformLayer);
}

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
}

function update(time, delta) {
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

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-500);
    }
}

function enemyHitsPlatform() {

}

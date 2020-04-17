import Phaser from "phaser";
import Level1 from "./level1.js"
import PlayerDied from "./playerdied.js"

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: true
        }
    },
    scene: [Level1,PlayerDied]
}

var game = new Phaser.Game(config);

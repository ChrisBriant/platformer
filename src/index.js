import Phaser from "phaser";
import Level1 from "./level1.js"
import PlayerDied from "./playerdied.js"
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';
import WebfontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';

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
    plugins: {
        global: [{
            key: 'rexMoveTo',
            plugin: MoveToPlugin,
            start: true
        },
        {
            key: 'rexWebfontLoader',
            plugin: WebfontLoaderPlugin,
            start: true
        }
        ]
    },
    scene: [Level1,PlayerDied]
}

var game = new Phaser.Game(config);

//var moveTo = scene.plugins.get('rexMoveTo').add(gameObject, config);

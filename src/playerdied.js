import Phaser from "phaser";

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function PlayerDied() {
        Phaser.Scene.call(this, { key: 'PlayerDied' });
    },

    preload: function ()
    {
      this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    },

    create: function ()
    {
      var thisscene = this;
      this.counter = 0;
      this.fountactive = false;
      this.lvltxt;

      WebFont.load({
          google: {
              families: [ 'Faster One', 'Finger Paint', 'Nosifer','Fontdiner Swanky' ]
          },
          active: function () {
            thisscene.fontactive = true;
            thisscene.lvltxt = thisscene.add.text(360, 0, 'You Died', { fontFamily: 'Fontdiner Swanky', fontSize: 60, color: '#7b4585' });
            thisscene.lvltxt.setStroke('#bbbe4b',8);
            thisscene.lvltxt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
          }
      });

      this.cursors = this.input.keyboard.createCursorKeys();



    },

    update: function()
    {
      if(this.fontactive) {
        if(this.counter < 190) {
          this.counter += 5;
          this.lvltxt.setPosition(360,this.counter);
        }
      }

      if (this.cursors.space.isDown) {
        this.scene.start('Level1');
      }
    },

    nextScene: function() {
      this.scene.start('MainGame');
    }

});

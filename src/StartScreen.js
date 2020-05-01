import Phaser from "phaser";

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function PlayerDied() {
        Phaser.Scene.call(this, { key: 'StartScreen' });
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
            thisscene.lvltxt = thisscene.add.text(200, 200, 'Press Start', { fontFamily: 'Fontdiner Swanky', fontSize: 60, color: '#7b4585' });
            thisscene.lvltxt.setStroke('#bbbe4b',8);
            thisscene.lvltxt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
          }
      });

      this.cursors = this.input.keyboard.createCursorKeys();



    },

    update: function()
    {

      if (this.cursors.space.isDown) {
        alert("space");
        this.scene.start('Level1');
      }
    },

});

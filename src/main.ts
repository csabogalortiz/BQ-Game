import Phaser from 'phaser';
import Game from './scenes/Game';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // Use the FIT scale mode
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      debug:true,
      // este hay que quitarlo es el que muestra las cajas
    },
  },
  scene: [Game],

  backgroundColor: '#CDD6F1'
};

const game = new Phaser.Game(config);

import Phaser from 'phaser';
import Game from './scenes/Game';
import UI from './scenes/UI';
import LevelComplete from './scenes/LevelComplete';
import StartScene from './scenes/StartScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // Use the FIT scale mode
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      debug:false,
      // este hay que quitarlo es el que muestra las cajas
    },
  },
  scene: [StartScene, Game, UI,LevelComplete],

  backgroundColor: '#738CD7'
};

const game = new Phaser.Game(config);

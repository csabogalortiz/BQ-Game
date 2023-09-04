import Phaser from 'phaser';
import Game from './scenes/Game';
import UI from './scenes/UI';
import LevelComplete from './scenes/LevelComplete';
import StartScene from './scenes/StartScene';
import Carbon from './scenes/CarbonBar';
import FarmerLevel from './scenes/FarmerLevel';

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
  scene: [StartScene,UI, Game, FarmerLevel,  LevelComplete],

  backgroundColor: '#738CD7'
};

const game = new Phaser.Game(config);

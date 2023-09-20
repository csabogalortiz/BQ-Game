import Phaser from "phaser";
import Game from "./scenes/Game";
import UI from "./scenes/UI";
import LevelComplete from "./scenes/LevelComplete";
import StartScene from "./scenes/StartScene";
import Carbon from "./scenes/CarbonBar";
import FarmerLevel from "./scenes/FarmerLevel";
import CoOpLevel from "./scenes/CoOpLevel";
import { levelData } from "./scenes/GameData";
import VictoryScreen from "./scenes/VictoryScreen";
import LevelCoOpComplete from "./scenes/LevelCoOpComplete";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // Use the FIT scale mode
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { x: 0, y: 2.5 },
      // este hay que quitarlo es el que muestra las cajas
    },
  },

  scene: [
    StartScene,
    UI,
    Game,
    CoOpLevel,
    FarmerLevel,
    LevelComplete,
    LevelCoOpComplete,
    VictoryScreen,
  ],

  backgroundColor: "#738CD7",
};

const game = new Phaser.Game(config);
(game.config as any).levelData = levelData;

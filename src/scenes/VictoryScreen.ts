import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";
import WebFontFile from "./WebFontFile";
import { levelData } from "./GameData";

export default class VictoryScreen extends Phaser.Scene {
  private finalPoints!: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "victoryScreen",
    });
  }

  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
    this.load.image("dataImage", "./assets/data.png");
  }

  create() {
    this.finalPoints = this.add.text(340, 45, "Your Final Points are:", {
      fontFamily: '"Press Start 2P"',
      fontSize: "20px",
      color: "#FFFFFF",
    });

    const levelNumber = 1; // Replace this with the desired level number
    const currentLevelData = levelData.find(
      (data) => data.levelNumber === levelNumber
    );

    if (currentLevelData) {
      //   const textToShow = JSON.stringify(this.game.config.levelData[0]);
      const farmLevelText = `Farm Level Compliance: ${this.game.config.levelData[0].compliance}, Data Collected: ${this.game.config.levelData[0].dataCollected}`;
      const coOpLevelText = `CoOp Level Compliance: ${this.game.config.levelData[1].compliance}, Data Collected: ${this.game.config.levelData[1].dataCollected}`;
      const aggregatorText = `CoOp Level Compliance: ${this.game.config.levelData[2].compliance}, Data Collected: ${this.game.config.levelData[2].dataCollected}`;

      const farmLevelTextDisplay = this.add.text(140, 110, farmLevelText, {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        color: "#FFFFFF",
      });

      const coOpLevelTextDisplay = this.add.text(140, 310, coOpLevelText, {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        color: "#FFFFFF",
      });

      const aggregatorLevelTextDisplay = this.add.text(
        140,
        410,
        aggregatorText,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "16px",
          color: "#FFFFFF",
        }
      );
    }
  }
}

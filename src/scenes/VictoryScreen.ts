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
    this.load.image("victoryScreen", "./assets/victoryScreen.png");
    this.load.atlas(
      "agent-victory",
      "./assets/agent-victory.png",
      "./assets/agent-victory.json"
    );
  }

  create() {
    const { width, height } = this.scale;

    // Create the background image sprite
    const backgroundImage = this.add.sprite(
      width * 0.5,
      height * 0.5,
      "victoryScreen"
    );

    // Set the size of the background image to cover the entire camera viewport
    backgroundImage.displayWidth = width;
    backgroundImage.displayHeight = height;

    // Send the background image to the back layer
    backgroundImage.setDepth(-1);

    this.anims.create({
      key: "agent-victory",
      frameRate: 0.27,
      frames: this.anims.generateFrameNames("agent-victory", {
        start: 1,
        end: 4,
        prefix: "agent-victory",
        suffix: ".png",
      }),
      repeat: -1,
    });

    // Play the animation on a sprite
    const agentSprite = this.add.sprite(
      width * 0.86,
      height * 0.75,
      "agent-victory"
    );
    agentSprite.anims.play("agent-victory");
    agentSprite.setScale(1.2);

    const levelNumber = 1; // Replace this with the desired level number
    const currentLevelData = levelData.find(
      (data) => data.levelNumber === levelNumber
    );

    if (currentLevelData) {
      //   const textToShow = JSON.stringify(this.game.config.levelData[0]);
      const farmLevelText = ` ${this.game.config.levelData[0].compliance}`;
      const farmLevelTextData = ` ${this.game.config.levelData[0].dataCollected}`;
      const coOpLevelText = ` ${this.game.config.levelData[1].compliance}`;
      const coOpLevelTextData = `  ${this.game.config.levelData[1].dataCollected}`;
      const aggregatorText = ` ${this.game.config.levelData[2].compliance}`;
      const aggregatorTextData = ` ${this.game.config.levelData[2].dataCollected}`;

      const farmLevelTextDisplay = this.add.text(440, 320, farmLevelText, {
        fontFamily: '"Press Start 2P"',
        fontSize: "40px",
        color: "#FFFFFF",
      });

      const farmLevelTextDisplayData = this.add.text(
        630,
        320,
        farmLevelTextData,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "43px",
          color: "#FFFFFF",
        }
      );

      // -----------------------------

      const coOpLevelTextDisplay = this.add.text(440, 390, coOpLevelText, {
        fontFamily: '"Press Start 2P"',
        fontSize: "40px",
        color: "#FFFFFF",
      });

      const coOpLevelTextDisplayData = this.add.text(
        592,
        390,
        coOpLevelTextData,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "40px",
          color: "#FFFFFF",
        }
      );
      // -----------------------------

      const aggregatorLevelTextDisplay = this.add.text(
        440,
        450,
        aggregatorText,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "40px",
          color: "#FFFFFF",
        }
      );

      const aggregatorLevelTextDisplayData = this.add.text(
        630,
        450,
        aggregatorTextData,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "40px",
          color: "#FFFFFF",
        }
      );
    }
  }
}

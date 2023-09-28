import Phaser from "phaser";
import PlayerController from "./PlayerController";
import ObstaclesController from "./ObstaclesController";
import TrucksController from "./TrucksController";

export default class FarmerInstructions extends Phaser.Scene {
  constructor() {
    super("farmerInstructions");
  }

  preload() {
    this.load.image("farmerInstructions", "./assets/farmerInstructions.png");
    this.load.image("play_button", "./assets/play_button.png");
    this.load.atlas(
      "player",
      "./assets/player_sprite_sheet.png",
      "./assets/player_sprite_sheet.json"
    );
  }

  create() {
    const { width, height } = this.scale;

    // Create the background image sprite
    const backgroundImage = this.add.sprite(
      width * 0.5,
      height * 0.5,
      "farmerInstructions"
    );

    // Set the size of the background image to cover the entire camera viewport
    backgroundImage.displayWidth = width;
    backgroundImage.displayHeight = height;

    // Send the background image to the back layer
    backgroundImage.setDepth(-1);

    // // Create the animation
    // this.anims.create({
    //   key: "player-celebrate",
    //   frameRate: 4,
    //   frames: this.anims.generateFrameNames("player", {
    //     start: 1,
    //     end: 4,
    //     prefix: "Player_Celebrate-0",
    //     suffix: ".png",
    //   }),
    //   repeat: -1,
    // });

    // // Play the animation on a sprite
    // const playerSprite = this.add.sprite(width * 0.5, height * 0.75, "player");
    // playerSprite.anims.play("player-celebrate");
    // playerSprite.setScale(1.6);

    // // Boton!

    const phaseButton = this.add
      .sprite(width * 0.53, height * 0.92, "play_button")
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.scene.start("farmLevel");
      });
  }
}

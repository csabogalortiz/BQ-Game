import Phaser from "phaser";

export default class StartInstructions extends Phaser.Scene {
  constructor() {
    super("startInstructions");
  }

  preload() {
    // this.load.image("tiles", "assets/startInstructions.png");
    // this.load.tilemapTiledJSON("tilemap", "assets/startInstructions.json");

    // // this.load.image("ohno", "assets/ohno.png");
    // // this.load.image(
    // //   "aggregator_signBubble",
    // //   "assets/info_bubble_aggregator_1.png"
    // // );
    this.load.image("startInstructionsBK", "./assets/StartInstructionsBK.png");
    this.load.image("play_orange", "./assets/play-orange.png");
    this.load.atlas(
      "player",
      "./assets/player_sprite_sheet.png",
      "./assets/player_sprite_sheet.json"
    );
    this.load.atlas("agent", "./assets/agent.png", "./assets/agent.json");
  }

  create() {
    const { width, height } = this.scale;

    const backgroundImage = this.add.sprite(
      width * 0.5,
      height * 0.5,
      "startInstructionsBK"
    );

    // Set the size of the background image to cover the entire camera viewport
    backgroundImage.displayWidth = width;
    backgroundImage.displayHeight = height;

    // Send the background image to the back layer
    backgroundImage.setDepth(-1);

    // const map = this.make.tilemap({ key: "tilemap" });
    // const tileset = map.addTilesetImage("startWorld", "tiles");
    // const ground = map.createLayer("ground", tileset);

    // Create the animation
    this.anims.create({
      key: "player-celebrate",
      frameRate: 2,
      frames: this.anims.generateFrameNames("player", {
        start: 2,
        end: 4,
        prefix: "Player_Celebrate-0",
        suffix: ".png",
      }),
      repeat: -1,
    });

    // Play the animation on a sprite
    const playerSprite = this.add.sprite(width * 0.5, height * 0.34, "player");
    playerSprite.anims.play("player-celebrate");
    playerSprite.setScale(1.2);

    this.anims.create({
      key: "agent-talk",
      frameRate: 0.27,
      frames: this.anims.generateFrameNames("agent", {
        start: 1,
        end: 6,
        prefix: "Agent-Talk-",
        suffix: ".png",
      }),
      repeat: -1,
    });

    // Play the animation on a sprite
    const agentSprite = this.add.sprite(width * 0.6, height * 0.21, "agent");
    agentSprite.anims.play("agent-talk");
    agentSprite.setScale(1.2);

    // ------------------- AGENT -------------------

    // Boton!

    const playButton = this.add
      .sprite(width * 0.53, height * 0.46, "play_orange")
      .setScale(0.36) // Adjust the scale value as needed
      .setAlpha(0) // Initially set the alpha to 0 to make it invisible
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.scene.start("farmerInstructions");
      });

    // Create a tween to fade the button in after a delay
    this.tweens.add({
      targets: playButton,
      alpha: 1, // Target alpha (fully visible)
      duration: 1000, // Duration of the tween in milliseconds
      delay: 3000, // Delay before the tween starts in milliseconds
      ease: "Linear", // Easing function (you can choose another ease if needed)
    });
  }
}

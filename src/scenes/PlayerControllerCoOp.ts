import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import ObstaclesController from "./ObstaclesController";
import PlayerController from "./PlayerController";

export default class PlayerControllerCoOp extends PlayerController {
  public scene!: Phaser.Scene;
  public sprite!: Phaser.Physics.Matter.Sprite;
  public cursors!: CursorKeys;
  public stateMachine!: StateMachine;
  public obstacles!: ObstaclesController;
  public compliance = 0;
  public carbon = 99;
  private ohNoCoOpBubble!: Phaser.GameObjects.Image;
  private ohNoCoOpCollided = false;

  private increaseCompliance(amount: number) {
    this.compliance = Math.min(100, this.compliance + amount);
    // You can also update any UI elements related to compliance here
    events.emit("compliance-changed", this.compliance);
    events.on("player-celebrate-coop", this.handlePlayerCelebrateCoop, this);
    if (this.config.levelData[1].compliance >= 99) {
      // Emit the "player-celebrate" event when compliance is 99 or more
      events.emit("player-celebrate-coop");
    }
  }

  private decreaseCompliance(amount: number) {
    this.compliance = Math.max(0, this.compliance - amount);
    // You can also update any UI elements related to compliance here
    events.emit("compliance-changed", this.compliance);
  }

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    cursors: CursorKeys,
    obstacles: ObstaclesController,
    config: any
  ) {
    super(scene, sprite, cursors, obstacles, config);
    this.stateMachine.addState("player-celebrate-coop", {
      onEnter: this.playerCelebrateCoopOnEnter.bind(this), // Bind this context
    });

    events.on("increase-compliance", (amount: number) => {
      this.increaseCompliance(amount);
    });

    events.on("decrease-compliance", (amount: number) => {
      this.decreaseCompliance(amount);
    });

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType;

      // Check for collision with brown, red, and green boxes
      if (
        this.obstacles.is("brownBox", body) ||
        this.obstacles.is("redBoxes", body) ||
        this.obstacles.is("greenBoxes", body)
      ) {
        // Check if the player is currently in the "jump" state
        if (this.stateMachine.isCurrentState("jump")) {
          // Set the player's state back to "idle"
          this.stateMachine.setState("idle");
        }

        // Return early to prevent setting other states
        return;
      }

      if (this.obstacles.is("redSection", body)) {
        this.stateMachine.setState("redSection-hit");

        return;
      }

      if (this.obstacles.is("greenSection", body)) {
        this.stateMachine.setState("greenSection-hit");

        return;
      }

      if (this.obstacles.is("ohNoCoOp", body)) {
        console.log("onoCOOOOP hit!!");

        // Check if the bubble hasn't been created yet
        if (!this.ohNoCoOpCollided) {
          this.stateMachine.setState("player-surprise");
          this.ohNoCoOpBubble = this.scene.add.image(
            this.sprite.x,
            this.sprite.y - this.sprite.height / 2,
            "ohNoCoOp"
          );
          this.ohNoCoOpBubble.setOrigin(0.5, 1);
          this.ohNoCoOpBubble.setScale(0.5);
          this.ohNoCoOpBubble.setDepth(1);
          this.ohNoCoOpBubble.alpha = 0.8;

          // Set the flag to indicate that the bubble has been created
          this.ohNoCoOpCollided = true;

          // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
          this.scene.time.delayedCall(3000, () => {
            if (this.ohNoCoOpBubble) {
              this.ohNoCoOpBubble.destroy();
            }
            this.stateMachine.setState("idle");
          });
        }

        return;
      }

      if (this.obstacles.is("platform", body)) {
        this.stateMachine.setState("idle");

        return;
      }

      if (this.obstacles.is("powerCoOp", body)) {
        // Emit an event to indicate that the player collected the BQPower
        events.emit("player-collect-powerCoOp");

        // Destroy the BQPower
      }

      // Colison con un truck ojo: trucks hit no se va a usar - dejamos la colision  y la animacion pero no se usa

      const gameObject = body.gameObject;

      if (!gameObject) {
        return;
      }

      if (gameObject instanceof Phaser.Physics.Matter.TileBody) {
        if (this.stateMachine.isCurrentState("jump")) {
          this.stateMachine.setState("idle");
        }
        return;
      }

      const sprite = gameObject as Phaser.Physics.Matter.Sprite;
      const type = sprite.getData("type");

      switch (type) {
        case "data": {
          events.emit("data-collected");

          this.config.levelData[1].dataCollected++;
          sprite.destroy();
          break;
        }
      }
    });
    if (this.config.levelData[1].compliance >= 99) {
      this.stateMachine.setState("player-celebrate-coop");
    }
  }

  private playerCelebrateCoopOnEnter() {
    this.sprite.play("player-celebrate0");
    this.sprite.play("player-celebrate1");

    this.sprite.setOnCollide(() => {});
    this.scene.time.delayedCall(2000, () => {
      this.scene.scene.start("level-coop-complete");
    });
  }

  private handlePlayerCelebrateCoop() {
    // Handle the 'player-celebrate' event here
    // For example, you can trigger a celebration animation for the player
    this.stateMachine.setState("player-celebrate-coop");
  }

  // update(dt: number) {
  //   this.stateMachine.update(dt);
  // }
}

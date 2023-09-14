import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class BQPowerController {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Matter.Sprite;
  private stateMachine: StateMachine;
  private isCollected: boolean = false;

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
    this.scene = scene;
    this.sprite = sprite;

    // Create the sprite with the initial position
    this.createAnimations();

    this.stateMachine = new StateMachine(this, "bqPower");

    // Adding States -------------------
    this.stateMachine
      .addState("bq-power-idle", {
        onEnter: this.idleOnEnter,
      })
      .addState("bq-power-collected", {
        onEnter: this.collectedOnEnter,
      })
      .setState("bq-power-idle");

    events.on("player-collect-bqpower", this.handleCollectBQPower, this);
  }

  destroy() {
    events.off("player-collect-bqpower", this.handleCollectBQPower, this);
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  // BQPower Animations ---------------------------------------------
  private createAnimations() {
    this.sprite.anims.create({
      key: "bqPower-up-down",
      frames: [{ key: "bqPower", frame: "BQPowerup_1.png" }],
      frameRate: 1, // Adjust the frame rate as needed
      repeat: -1, // Repeat the animation indefinitely
    });
  }

  // States Handlers
  private idleOnEnter() {
    this.sprite.play("bqPower-up-down");
    // Create a tween to move the sprite up and down.
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 30, // Adjust the vertical movement distance
      duration: 1000, // Adjust the duration of each movement cycle
      yoyo: true, // Makes the tween go back and forth (up and down)
      repeat: -1, // Repeat indefinitely
    });
  }
  private collectedOnEnter() {
    this.isCollected = true;
    this.sprite.setAlpha(0); // Make the BQPower sprite invisible

    // Trigger any actions you want when the BQPower is collected
    // For example, revealing the hidden box with ID and coordinates
    events.emit("bqpower-collected", this.sprite.x, this.sprite.y);
  }

  private handleCollectBQPower() {
    if (!this.isCollected) {
      this.stateMachine.setState("bq-power-collected");
      events.emit("bqpower-collected", this.sprite.x, this.sprite.y);
    }
  }
}

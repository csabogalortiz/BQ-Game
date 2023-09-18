import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";
type MoveDirection = "left" | "right";

export default class BrownBoxController extends Phaser.Physics.Matter.Image {
  private startX: number;
  private startY: number;
  private moveDirection: MoveDirection;
  private brownBox: Phaser.Physics.Matter.Image;
  private moveTween?: Phaser.Tweens.Tween;

  constructor(
    scene,
    x,
    y,
    texture,
    options,
    moveDirection: MoveDirection = "left"
  ) {
    super(scene.matter.world, x, y, texture, 0, options);

    scene.add.existing(this);

    this.setFriction(1, 0, Infinity);

    this.startX = x;
    this.startY = y;
    this.moveDirection = moveDirection;
    this.brownBox = this;
  }

  moveHorizontally() {
    // Move to the right only
    this.moveTween = this.scene.tweens.addCounter({
      from: 0,
      to: 800, // Adjust the speed as needed
      duration: 3500,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value;
        const dx = x - this.x;
        this.x = x;
        this.setVelocityX(dx);
      },
    });
  }

  moveHorizontallyLeft() {
    // Move to the left only
    this.moveTween = this.scene.tweens.addCounter({
      from: 0,
      to: -800, // Adjust the speed as needed, use a negative value to move left
      duration: 3500,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value;
        const dx = x - this.x;
        this.x = x;
        this.setVelocityX(dx);
      },
    });
  }

  getBody(): MatterJS.BodyType {
    return this.brownBox.body as MatterJS.BodyType;
  }

  handleBQPowerCollected() {
    if (this.moveTween) {
      this.moveTween.stop();
    }

    // Create a fade-out tween
    this.scene.tweens.add({
      targets: this,
      alpha: 0, // Fade out by reducing alpha to 0
      duration: 1000, // Adjust the duration as needed
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

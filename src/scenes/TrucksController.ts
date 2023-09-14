import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class TrucksController {
  // Properties
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Matter.Sprite;
  private stateMachine: StateMachine;
  private moveTime = 0;

  private isStomped: boolean = false;

  //   private obstacles: ObstaclesController
  //   private cursors: CursorKeys
  //   private player: PlayerController

  //   Constructor -----

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
    this.scene = scene;
    this.sprite = sprite;

    this.createAnimations();

    this.stateMachine = new StateMachine(this, "trucks");

    // Adding States -------------------
    this.stateMachine
      .addState("red-idle", {
        onEnter: this.idleOnEnter,
      })
      .addState("red-left", {
        onEnter: this.moveLeftOnEnter,
        onUpdate: this.moveLeftOnUpdate,
      })

      .addState("red-right", {
        onEnter: this.moveRightOnEnter,
        onUpdate: this.moveRightOnUpdate,
      })

      .addState("crushed")

      .addState("green-idle", {
        onEnter: this.greenIdleOnEnter,
      })

      .addState("green-left", {
        onEnter: this.greenLeftOnEnter,
        onUpdate: this.greenLeftOnUpdate,
      })

      .addState("green-right", {
        onEnter: this.greenRightOnEnter,
        onUpdate: this.greenRightOnUpdate,
      })

      .setState("red-idle");

    events.on("trucks-stomped", this.handleTrucksStomped, this);
  }

  destroy() {
    events.off("trucks-stomped", this.handleTrucksStomped, this);
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  // Truck Animations ---------------------------------------------
  private createAnimations() {
    // Red truck animations
    this.sprite.anims.create({
      key: "red-idle",
      frames: [
        {
          key: "trucks",
          frame: "trucks_red_left-1.png",
        },
      ],
    });

    this.sprite.anims.create({
      key: "red-left",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("trucks", {
        start: 1,
        end: 3,
        prefix: "trucks_red_left-",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "red-right",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("trucks", {
        start: 1,
        end: 3,
        prefix: "trucks_red_right-",
        suffix: ".png",
      }),
      repeat: -1,
    });

    // Green truck animations
    this.sprite.anims.create({
      key: "green-idle",
      frames: [
        {
          key: "trucks",
          frame: "trucks_green_left-1.png",
        },
      ],
    });

    this.sprite.anims.create({
      key: "green-left",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("trucks", {
        start: 1,
        end: 3,
        prefix: "trucks_green_left-",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "green-right",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("trucks", {
        start: 1,
        end: 3,
        prefix: "trucks_green_right-",
        suffix: ".png",
      }),
      repeat: -1,
    });
  }

  // States Handlers

  private idleOnEnter() {
    this.sprite.play("red-idle");
    const r = Phaser.Math.Between(1, 1000);
    if (r < 50) {
      this.stateMachine.setState("red-left");
    } else {
      this.stateMachine.setState("red-right");
    }
  }

  private moveLeftOnEnter() {
    this.moveTime = 0;
    this.sprite.anims.play("red-left");
  }

  private moveLeftOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(-2);

    if (this.moveTime > 2000) {
      this.stateMachine.setState("red-right");
    }
  }

  private moveRightOnEnter() {
    this.moveTime = 0;
    this.sprite.anims.play("red-right");
  }

  private moveRightOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(2);
    if (this.moveTime > 2000) {
      this.stateMachine.setState("red-left");
    }
  }
  private greenIdleOnEnter() {
    this.sprite.play("green-idle");
    this.stateMachine.setState("green-right"); // Transition to 'green-right'
  }

  private greenRightOnEnter() {
    this.moveTime = 0;
    this.sprite.anims.play("green-right");
  }

  private greenRightOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(2);

    if (this.moveTime > 2000) {
      this.stateMachine.setState("green-left"); // Transition to 'green-left'
    }
  }

  private greenLeftOnEnter() {
    this.moveTime = 0;
    this.sprite.anims.play("green-left");
  }
  private greenLeftOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(-2);

    if (this.moveTime > 2000) {
      this.stateMachine.setState("green-right"); // Transition to 'green-right'
    }
  }

  private handleTrucksStomped(trucks: Phaser.Physics.Matter.Sprite) {
    if (this.sprite !== trucks || this.isStomped) {
      return;
    }
    events.off("trucks-stomped", this.handleTrucksStomped, this);

    // Change the truck's state and animation to green
    this.stateMachine.setState("green-idle");
    this.sprite.play("green-idle");

    // Update the isStomped flag to prevent further stomping
    this.isStomped = true;

    // Optionally, you can reset any timers or movement-related properties
  }
}

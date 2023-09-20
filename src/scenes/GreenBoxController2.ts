import Phaser from "phaser";
import StateMachine from "~/statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";
type MoveDirection = "left" | "right";

export default class GreenBoxController2 {
  private scene: Phaser.Scene;
  public sprite: Phaser.Physics.Matter.Sprite;
  private moveTime = 0;
  private obstacles: ObstaclesController;
  private hasPowerCoOpCollected = true;
  private hasCollidedWithWinn = false;
  private hasCollidedWithLoose = false;
  private isInContactWithGreenBox = false;
  public hasCollided: boolean = false;
  public config: any;

  private stateMachine: StateMachine;
  private body: MatterJS.BodyType;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    obstacles: ObstaclesController,
    moveDirection: MoveDirection = "left",
    config: any
  ) {
    this.body = sprite.body as MatterJS.BodyType;
    this.scene = scene;
    this.sprite = sprite;
    this.obstacles = obstacles;
    this.isInContactWithGreenBox = false;
    this.config = config;

    this.createAnimations();
    this.stateMachine = new StateMachine(this, "greenBox");

    this.stateMachine
      .addState("move-left", {
        onEnter: this.moveLeftOnEnter,
        onUpdate: this.moveLeftOnUpdate,
      })

      .addState("move-right", {
        onEnter: this.moveRightOnEnter,
        onUpdate: this.moveRightOnUpdate,
      })

      .addState("spike-hit", {
        onEnter: this.spikeHitOnEnter,
      })

      .addState("winn-hit", {
        onEnter: this.winnHitOnEnter,
      })

      .addState("still", {
        onEnter: this.stillOnEnter,
      });

    if (moveDirection == "left") {
      this.stateMachine.setState("move-left");
    } else {
      this.stateMachine.setState("move-right");
    }
    events.on("powerCoOp-collected", this.handlePowerCoOpCollected, this);

    // el set state to set the initial state of the state machine.

    // *********** Collisions ***********************************

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType;

      const looseArea = this.sprite.x > 1685 && this.sprite.y > 800;

      if (!this.hasCollidedWithLoose && looseArea) {
        this.stateMachine.setState("spike-hit");
        this.hasCollidedWithLoose = true; // Set the flag to true
        return;
      }

      const winnableArea = this.sprite.x < 1050 && this.sprite.y > 800;

      if (!this.hasCollidedWithWinn && winnableArea) {
        this.stateMachine.setState("winn-hit");
        this.hasCollidedWithWinn = true; // Set the flag to true
        return;
      }

      const gameObject = body.gameObject;

      if (!gameObject) {
        return;
      }

      const sprite = gameObject as Phaser.Physics.Matter.Sprite;
    });
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }
  getBody(): MatterJS.BodyType {
    return this.body;
  }

  public invertDirection() {
    if (this.stateMachine.isCurrentState("move-left")) {
      this.stateMachine.setState("move-right");
      this.sprite.setX(this.sprite.x + 10);
    } else if (this.stateMachine.isCurrentState("move-right")) {
      this.stateMachine.setState("move-left");
      this.sprite.setX(this.sprite.x - 10);
    }
  }

  private moveLeftOnEnter() {
    this.moveTime = 0;
    this.sprite.play("move-left");
  }

  private moveLeftOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(-1);
    if (this.moveTime > 5000) {
      this.stateMachine.setState("move-right");
    }
  }

  private moveRightOnEnter() {
    this.moveTime = 0;
    this.sprite.play("move-right");
  }

  private moveRightOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(1);
    if (this.moveTime > 5000) {
      this.stateMachine.setState("move-left");
    }
  }

  private stillOnEnter() {
    this.sprite.setVelocityX(0);

    setTimeout(() => {
      this.sprite.setY(3000);
    }, 5000);
  }

  // **** Spike
  private spikeHitOnEnter() {
    this.sprite.setVelocityY(-12);

    console.log("spike-hit");

    const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
    const endColor = Phaser.Display.Color.ValueToColor(0xff0000);
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 100,
      repeat: 2,
      yoyo: true,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          startColor,
          endColor,
          100,
          value
        );
        const color = Phaser.Display.Color.GetColor(
          colorObject.r,
          colorObject.g,
          colorObject.b
        );
        this.sprite.setTint(color);
      },

      onComplete: () => {
        // Decrease compliance by 2%
        events.emit("decrease-compliance", 2);
        this.config.levelData[1].compliance -= 2; // Notify the player controller to decrease compliance
        this.stateMachine.setState("still");
        if (this.config.levelData[1].compliance >= 99) {
          // Emit the "player-celebrate" event
          events.emit("player-celebrate-coop");
        }
      },
    });
  }

  private winnHitOnEnter() {
    this.sprite.setVelocityY(-4);

    console.log("winn-hit");

    const startColor = Phaser.Display.Color.ValueToColor(0xfff800);
    const endColor = Phaser.Display.Color.ValueToColor(0x36c636);
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 100,
      repeat: 1,
      yoyo: true,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          startColor,
          endColor,
          100,
          value
        );
        const color = Phaser.Display.Color.GetColor(
          colorObject.r,
          colorObject.g,
          colorObject.b
        );
        this.sprite.setTint(color);
      },

      onComplete: () => {
        // Increase compliance by 5%
        events.emit("increase-compliance", 80);

        this.config.levelData[1].compliance += 80;

        this.stateMachine.setState("still");

        if (this.config.levelData[1].compliance >= 99) {
          // Emit the "player-celebrate" event
          events.emit("player-celebrate-coop");
        }
      },
    });
    return;
  }

  private createAnimations() {
    this.sprite.anims.create({
      key: "move-left",
      frames: [{ key: "greenBoxes", frame: "greenBox.png" }],
    });

    this.sprite.anims.create({
      key: "move-right",
      frames: [{ key: "greenBoxes", frame: "greenBox.png" }],
    });
  }

  public handlePowerCoOpCollected() {
    // Set the flag to true when powerCoOp is collected
    this.hasPowerCoOpCollected = true;
    this.sprite.setVisible(true);
  }
}

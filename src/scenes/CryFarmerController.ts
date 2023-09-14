import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class CryFarmerController {
  // Properties
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Matter.Sprite;
  private stateMachine: StateMachine;
  private moveTime = 0;

  // private isStomped: boolean = false;

  //   private obstacles: ObstaclesController
  //   private cursors: CursorKeys
  //   private player: PlayerController

  //   Constructor -----

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
    this.scene = scene;
    this.sprite = sprite;

    this.createAnimations();

    this.stateMachine = new StateMachine(this, "cryFarmer");

    // Adding States -------------------
    this.stateMachine

      .addState("cryFarmer-idle", {
        onEnter: this.cryIdleOnEnter,
      })

      .addState("cryFarmer-left", {
        onEnter: this.cryLeftOnEnter,
        onUpdate: this.cryLeftOnUpdate,
      })

      .addState("cryFarmer-right", {
        onEnter: this.cryRightOnEnter,
        onUpdate: this.cryRightOnUpdate,
      })

      .addState("crushed")

      .setState("cryFarmer-idle");

    // events.on('farmer-stomped', this.handleTrucksStomped, this)
  }

  // destroy () {
  //     events.off('farmer-stomped', this.handleTrucksStomped, this)
  // }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  // Truck Animations ---------------------------------------------
  private createAnimations() {
    this.sprite.anims.create({
      key: "cryFarmer-idle",
      frames: [
        {
          key: "cryFarmer",
          frame: "Cry_Farmer_Idle.png",
        },
      ],
    });

    this.sprite.anims.create({
      key: "cryFarmer-left",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("cryFarmer", {
        start: 1,
        end: 2,
        prefix: "Cry_Farmer_Left_",
        suffix: ".png",
      }),
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "cryFarmer-right",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("cryFarmer", {
        start: 1,
        end: 2,
        prefix: "Cry_Farmer_Right_",
        suffix: ".png",
      }),
      repeat: -1,
    });
  }

  // States Handlers

  // Cry Farmer

  private cryIdleOnEnter() {
    this.sprite.play("cryFarmer-idle");
    const r = Phaser.Math.Between(1, 1000);
    if (r < 50) {
      this.stateMachine.setState("cryFarmer-left");
    } else {
      this.stateMachine.setState("cryFarmer-right");
    }
  }

  private cryLeftOnEnter() {
    this.moveTime = 0;
    this.sprite.anims.play("cryFarmer-left");
  }

  private cryLeftOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(-1);

    if (this.moveTime > 2000) {
      this.stateMachine.setState("cryFarmer-right");
    }
  }

  private cryRightOnEnter() {
    this.moveTime = 0;
    this.sprite.anims.play("cryFarmer-right");
  }

  private cryRightOnUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.setVelocityX(1);
    if (this.moveTime > 2000) {
      this.stateMachine.setState("cryFarmer-left");
    }
  }

  // private handleFarmerStomped(trucks: Phaser.Physics.Matter.Sprite) {
  //     if (this.sprite !== trucks || this.isStomped) {
  //         return;
  //     }
  //     events.off('farmer-stomped', this.handleFarmerStomped, this);

  //     // Change the truck's state and animation to green
  //     this.stateMachine.setState('green-idle');
  //     this.sprite.play('green-idle');

  //     // Update the isStomped flag to prevent further stomping
  //     this.isStomped = true;

  //     // Optionally, you can reset any timers or movement-related properties
  // }
}

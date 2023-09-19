import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import ObstaclesController from "./ObstaclesController";
import PlayerController from "./PlayerController";

export default class PlayerControllerFarm extends PlayerController {
  public scene!: Phaser.Scene;
  public sprite!: Phaser.Physics.Matter.Sprite;
  public cursors!: CursorKeys;
  public stateMachine!: StateMachine;
  public obstacles!: ObstaclesController;
  public compliance = 0;
  public carbon = 99;
  public lastTrucks?: Phaser.Physics.Matter.Sprite;
  public stompedTrucks: Map<Phaser.Physics.Matter.Sprite, boolean> = new Map();
  private isSurprised = false;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    cursors: CursorKeys,
    obstacles: ObstaclesController,
    config: any
  ) {
    super(scene, sprite, cursors, obstacles, config);

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType;

      if (this.obstacles.is("nonCompliantLand", body)) {
        this.stateMachine.setState("nonCompliantLand-hit");

        return;
      }

      if (this.obstacles.is("ohnoFarm", body)) {
        this.stateMachine.setState("player-surprise");
        const ohNoFarm = this.scene.add.image(
          this.sprite.x,
          this.sprite.y - this.sprite.height / 2,
          "ohnoFarm"
        );
        ohNoFarm.setOrigin(0.5, 1);
        ohNoFarm.setScale(0.5);
        ohNoFarm.setDepth(1);
        ohNoFarm.alpha = 0.8;

        // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
        this.scene.time.delayedCall(4000, () => {
          ohNoFarm.destroy();
          this.stateMachine.setState("idle");
        });

        return;
      }

      if (this.obstacles.is("ohnoWater", body)) {
        this.stateMachine.setState("player-surprise");
        const ohNoWater = this.scene.add.image(
          this.sprite.x,
          this.sprite.y - this.sprite.height / 2,
          "ohnoWater"
        );
        ohNoWater.setOrigin(0.5, 1);
        ohNoWater.setScale(0.5);
        ohNoWater.setDepth(1);
        ohNoWater.alpha = 0.8;

        // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
        this.scene.time.delayedCall(4000, () => {
          ohNoWater.destroy();
          this.stateMachine.setState("idle");
        });

        return;
      }
      if (this.obstacles.is("ohnoRadio", body)) {
        this.stateMachine.setState("player-surprise");
        const ohNoRadio = this.scene.add.image(
          this.sprite.x,
          this.sprite.y - this.sprite.height / 2,
          "ohnoRadio"
        );
        ohNoRadio.setOrigin(0.5, 1);
        ohNoRadio.setScale(0.5);
        ohNoRadio.setDepth(1);
        ohNoRadio.alpha = 0.8;

        // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
        this.scene.time.delayedCall(4000, () => {
          ohNoRadio.destroy();
          this.stateMachine.setState("idle");
        });

        return;
      }

      if (this.obstacles.is("ohnoDeforest", body)) {
        this.stateMachine.setState("player-surprise");
        const ohNoDeforest = this.scene.add.image(
          this.sprite.x,
          this.sprite.y - this.sprite.height / 2,
          "ohnoDeforest"
        );
        ohNoDeforest.setOrigin(0.5, 1);
        ohNoDeforest.setScale(0.5);
        ohNoDeforest.setDepth(1);
        ohNoDeforest.alpha = 0.8;

        // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
        this.scene.time.delayedCall(4000, () => {
          ohNoDeforest.destroy();
          this.stateMachine.setState("idle");
        });

        return;
      }

      if (this.obstacles.is("farmSign", body)) {
        const offsetY = -80;
        const sign = this.scene.add.image(
          body.position.x,
          body.position.y + offsetY,
          "farm_signBubble"
        );

        sign.setOrigin(0.5, 1);
        sign.setScale(0.4);
        sign.setDepth(1);
        sign.alpha = 0.8;

        // Remove the 'sign' image after a certain duration (e.g., 4 seconds)
        this.scene.time.delayedCall(4000, () => {
          sign.destroy();
        });
      }

      if (this.obstacles.is("bqPowerSign", body)) {
        const offsetY = -80;
        const sign = this.scene.add.image(
          body.position.x,
          body.position.y + offsetY,
          "info_bubble_bqPower"
        );

        sign.setOrigin(0.5, 1);
        sign.setScale(0.4);
        sign.setDepth(1);
        sign.alpha = 0.8;

        // Remove the 'sign' image after a certain duration (e.g., 4 seconds)
        this.scene.time.delayedCall(4000, () => {
          sign.destroy();
        });
      }

      if (this.obstacles.is("farmBox", body)) {
        const boxSprite = body.gameObject as Phaser.Physics.Matter.Sprite;
        const boxBottom = boxSprite.y + boxSprite.height / 2;

        if (this.sprite.y > boxBottom) {
          console.log("box hit!!");
          events.emit("box-hit", boxSprite);
        }
      }

      if (this.obstacles.is("blueBox", body)) {
        const blueBoxSprite = body.gameObject as Phaser.Physics.Matter.Sprite;
        const blueBoxBottom = blueBoxSprite.y + blueBoxSprite.height / 2;

        if (this.sprite.y > blueBoxBottom) {
          console.log("Bluebox hit!!");
          events.emit("blueBox-hit", blueBoxSprite);
        }
      }

      let colorTween: Phaser.Tweens.Tween | null = null;

      if (this.obstacles.is("bqPower", body)) {
        // Emit an event to indicate that the player collected the BQPower
        events.emit("player-collect-bqpower");

        const startColor = Phaser.Display.Color.ValueToColor(0xffa500); // Orange
        const endColor = Phaser.Display.Color.ValueToColor(0x0000ff); // Blue

        colorTween = this.scene.tweens.addCounter({
          from: 0,
          to: 100,
          duration: 200, // 30 seconds
          repeat: -1, // Repeat indefinitely
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
            this.sprite.setTint(color); // Apply the color to the player sprite
          },
        });

        this.scene.time.delayedCall(10000, () => {
          if (colorTween) {
            colorTween.stop(); // Stop the color-changing tween
            this.sprite.clearTint(); // Clear the tint to return to the original color
          }
        });
        return;
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
          this.config.levelData[0].dataCollected++;
          sprite.destroy();
          break;
        }

        case "coordinates": {
          events.emit("coordinates-collected", gameObject); // Emit event to notify UI about collected coordinates
          this.setCompliance(this.compliance + 11);
          this.config.levelData[0].compliance += 11;
          gameObject.destroy();
          break;
        }
        case "id": {
          events.emit("id-collected", gameObject); // Emit event to notify UI about collected ID
          this.setCompliance(this.compliance + 11);
          this.config.levelData[0].compliance += 11;
          gameObject.destroy();
          break;
        }
      }
    });
  }
}

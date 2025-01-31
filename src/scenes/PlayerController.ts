import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";
import { Scene } from "phaser";
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

interface IBound {
  height: number;
}

export default class PlayerController {
  // Properties
  protected scene: Phaser.Scene;
  protected sprite: Phaser.Physics.Matter.Sprite;
  protected cursors: CursorKeys;
  protected stateMachine: StateMachine;
  protected obstacles: ObstaclesController;
  protected compliance = 0;
  protected carbon = 99;
  public config: any;
  protected lastTrucks?: Phaser.Physics.Matter.Sprite;
  protected stompedTrucks: Map<Phaser.Physics.Matter.Sprite, boolean> =
    new Map();

  //   Constructor -----

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    cursors: CursorKeys,
    obstacles: ObstaclesController,
    config: any
  ) {
    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursors;
    this.obstacles = obstacles;
    this.config = config;

    this.createAnimations();

    this.stateMachine = new StateMachine(this, "player");

    // Adding States -------------------
    this.stateMachine
      .addState("idle", {
        onEnter: this.idleOnEnter,
        onUpdate: this.idleOnUpdate,
      })
      .addState("walk", {
        onEnter: this.walkOnEnter,
        onUpdate: this.walkOnUpdate,
        onExit: this.walkOnExit,
      })
      .addState("jump", {
        onEnter: this.jumpOnEnter,
        onUpdate: this.jumpOnUpdate,
      })

      .addState("nonCompliantLand-hit", {
        onEnter: this.nonCompliantLandOnEnter,
      })
      .addState("redSection-hit", {
        onEnter: this.redSectionHitOnEnter,
      })

      .addState("platform-hit", {
        onEnter: this.platformHitOnEnter,
      })

      .addState("greySection-hit", {
        onEnter: this.greySectionHitOnEnter,
      })

      .addState("greenSection-hit", {
        onEnter: this.greenSectionHitOnEnter,
      })

      .addState("trucks-hit", {
        onEnter: this.trucksHitOnEnter,
      })

      .addState("trucks-stomp", {
        onEnter: this.trucksStompOnEnter,
      })

      .addState("player-celebrate", {
        onEnter: this.playerCelebrateOnEnter,
      })
      .addState("player-surprise", {
        onEnter: this.playerSurpriseOnEnter,
      })

      .setState("idle");

    // ------------------------------------------Collisions ------------------------------------------------------------------

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType;

      if (this.obstacles.is("ohno", body)) {
        this.stateMachine.setState("player-surprise");
        const ohNO = this.scene.add.image(
          this.sprite.x,
          this.sprite.y - this.sprite.height / 2,
          "ohno"
        );
        ohNO.setOrigin(0.5, 1);
        ohNO.setScale(0.5);
        ohNO.setDepth(1);
        ohNO.alpha = 0.8;

        // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
        this.scene.time.delayedCall(1300, () => {
          ohNO.destroy();
          this.stateMachine.setState("idle");
        });

        return;
      }

      if (this.obstacles.is("sign", body)) {
        const offsetY = -80;
        const sign = this.scene.add.image(
          body.position.x,
          body.position.y + offsetY,
          "aggregator_signBubble"
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

      if (this.obstacles.is("platform", body)) {
        // Change the state to 'idle' when colliding with a platform
        this.stateMachine.setState("platform-hit");
        return;
      }

      // Colison con un truck ojo: trucks hit no se va a usar - dejamos la colision  y la animacion pero no se usa

      if ((this, obstacles.is("trucks", body))) {
        this.lastTrucks = body.gameObject;

        if (this.sprite.y < body.position.y) {
          this.stateMachine.setState("trucks-stomp");
        } else {
          console.log("trucks hit!!");
          this.stateMachine.setState("trucks-hit");
        }
        return;
      }

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
          this.config.levelData[2].dataCollected++;
          sprite.destroy();
          break;
        }

        case "red-bean": {
          events.emit("redBean-collected");
          sprite.destroy();
          break;
        }
      }
    });
  }

  // Updating States ------------------------
  update(dt: number) {
    this.stateMachine.update(dt);
  }

  protected setCompliance(value: number) {
    this.compliance = Phaser.Math.Clamp(value, 0, 100);
    events.emit("compliance-changed", this.compliance);
    console.log("Compliance:", this.compliance); // Add this line to check compliance value

    if (this.compliance >= 80) {
      console.log("Player Celebrate!"); // Add this line to check if this block is reached
      this.stateMachine.setState("player-celebrate");
    }

    // to do- check for death
  }

  private setCarbon(value: number) {
    this.carbon = Phaser.Math.Clamp(value, 0, 100);
    events.emit("carbon-changed", this.carbon);
    console.log("Carboon:", this.carbon); // Add this line to check compliance value

    if (this.carbon > 80) {
      console.log("Carbon Changed!!"); // Add this line to check if this block is reached
      this.stateMachine.setState("player-celebrate");
    }

    // to do- check for death
  }

  private idleOnEnter() {
    this.sprite.play("player-idle");
  }

  private idleOnUpdate() {
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.stateMachine.setState("walk");
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (spaceJustPressed) {
      this.stateMachine.setState("jump");
    }
  }

  private walkOnEnter() {
    this.sprite.play("player-walk");
  }

  private walkOnUpdate() {
    const speed = 10;
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(speed);
    } else {
      this.sprite.setVelocityX(0);
      this.stateMachine.setState("idle");
    }
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (spaceJustPressed) {
      this.stateMachine.setState("jump");
    }
  }

  private walkOnExit() {
    this.sprite.stop();
  }

  private jumpOnEnter() {
    this.sprite.play("player-jump");
    this.sprite.setVelocityY(-22);
  }

  private jumpOnUpdate() {
    const speed = 5;
    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(speed);
    }
  }

  private playerCelebrateOnEnter() {
    this.sprite.play("player-celebrate0");
    this.sprite.play("player-celebrate1");

    this.sprite.setOnCollide(() => {});
    this.scene.time.delayedCall(2000, () => {
      this.scene.scene.start("level-complete");
    });
  }

  private playerSurpriseOnEnter() {
    this.sprite.play("player-surprise");
  }

  // -------------------  Handling Obstacles States

  private nonCompliantLandOnEnter() {
    console.log("noncompliantHit!");
    this.sprite.setVelocityY(-12);

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
    });

    this.stateMachine.setState("idle");
    this.setCompliance(this.compliance - 1);
  }

  private redSectionHitOnEnter() {
    // console.log('red-section-hit!')
    this.stateMachine.setState("idle");
  }

  private greenSectionHitOnEnter() {
    console.log("player-green-section-hit!");
    this.stateMachine.setState("idle");
  }

  private greySectionHitOnEnter() {
    console.log("player-section-hit!");
    this.stateMachine.setState("idle");
  }

  private platformHitOnEnter() {
    console.log("platform-hit!");
    this.stateMachine.setState("idle");
  }
  private trucksHitOnEnter() {
    if (this.lastTrucks) {
      if (this.sprite.x < this.lastTrucks.x) {
        this.sprite.setVelocityX(-20);
      } else {
        this.sprite.setVelocityY(20);
      }
    } else {
      this.sprite.setVelocityY(-20);
    }

    const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
    const endColor = Phaser.Display.Color.ValueToColor(0x454cff);

    this.stateMachine.setState("idle");
  }

  private trucksStompOnEnter() {
    if (this.lastTrucks && !this.stompedTrucks.get(this.lastTrucks)) {
      const onTrucksStomped = (truck: Phaser.Physics.Matter.Sprite) => {
        if (truck === this.lastTrucks) {
          this.stompedTrucks.set(this.lastTrucks, true);
          events.removeListener("trucks-stomped", onTrucksStomped);
        }
      };
      // Add the event listener
      events.addListener("trucks-stomped", onTrucksStomped);
      this.sprite.setVelocityY(-12);
      const startColor = Phaser.Display.Color.ValueToColor(0xffffff);
      const endColor = Phaser.Display.Color.ValueToColor(0x58e21e);
      // Add the tweens
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
      });

      // Emit the event
      events.emit("trucks-stomped", this.lastTrucks);
      // Change the state and update compliance and carbon
      this.stateMachine.setState("idle");
      this.setCompliance(this.compliance + 23);
      this.config.levelData[2].compliance += 23;
      const carbonDecreaseAmount = 23; //
      this.setCarbon(this.carbon - carbonDecreaseAmount);
      // Clean up the lastTrucks reference
      this.lastTrucks = undefined;
    } else {
      this.stateMachine.setState("idle");
    }
  }

  // -----------------------------  Player Animations ---------------------------------------------
  private createAnimations() {
    this.sprite.anims.create({
      key: "player-idle",
      frames: [{ key: "player", frame: "Player_Idle.png" }],
    });

    this.sprite.anims.create({
      key: "player-walk",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("player", {
        start: 1,
        end: 2,
        prefix: "Player_Walk-0",
        suffix: ".png",
      }),
      repeat: -1,
    });

    // Player Celebrate

    this.sprite.anims.create({
      key: "player-celebrate0",
      frames: [{ key: "player", frame: "Player_Celebrate-01.png" }],
    }),
      this.sprite.anims.create({
        key: "player-celebrate1",
        frameRate: 4,
        frames: this.sprite.anims.generateFrameNames("player", {
          start: 2,
          end: 4,
          prefix: "Player_Celebrate-0",
          suffix: ".png",
        }),
        repeat: -1,
      });

    this.sprite.anims.create({
      key: "player-jump",
      frameRate: 4,
      frames: this.sprite.anims.generateFrameNames("player", {
        start: 1,
        end: 2,
        prefix: "Player_Jump-0",
        suffix: ".png",
      }),
    });

    this.sprite.anims.create({
      key: "player-surprise",
      frames: [{ key: "player", frame: "Player_Talk-02.png" }],
    });
  }
}

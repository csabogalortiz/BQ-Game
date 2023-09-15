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
  public compliance = 10;
  public carbon = 99;
  private increaseCompliance(amount: number) {
    this.compliance = Math.min(100, this.compliance + amount);
    // You can also update any UI elements related to compliance here
    events.emit("compliance-changed", this.compliance);
  }

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    cursors: CursorKeys,
    obstacles: ObstaclesController
  ) {
    super(scene, sprite, cursors, obstacles);

    events.on("increase-compliance", (amount: number) => {
      this.increaseCompliance(amount);
    });

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType;

      if (this.obstacles.is("redSection", body)) {
        this.stateMachine.setState("redSection-hit");

        return;
      }

      if (this.obstacles.is("greenSection", body)) {
        this.stateMachine.setState("greenSection-hit");

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
          sprite.destroy();
          break;
        }

        case "coordinates": {
          events.emit("coordinates-collected", gameObject); // Emit event to notify UI about collected coordinates
          this.setCompliance(this.compliance + 11);
          gameObject.destroy();
          break;
        }
        case "id": {
          events.emit("id-collected", gameObject); // Emit event to notify UI about collected ID
          this.setCompliance(this.compliance + 11);
          gameObject.destroy();
          break;
        }

        // case 'compliance':
        //     {
        //         const value = sprite.getData('compliancePoints') ?? 10
        //         this.compliance += value
        //         events.emit('compliance-changed', this.compliance)
        //         sprite.destroy()
        //         break
        //     }
      }
    });
  }
}

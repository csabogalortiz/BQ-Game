import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";


export default class TrucksController 
{
      // Properties
      private sprite: Phaser.Physics.Matter.Sprite
      private stateMachine: StateMachine
      private moveTime = 0 
    //   private obstacles: ObstaclesController
      //   private cursors: CursorKeys
      //   private player: PlayerController


//   Constructor -----

constructor(sprite: Phaser.Physics.Matter.Sprite) {
    this.sprite = sprite

    // this.createAnimations()

    this.stateMachine = new StateMachine(this, 'trucks')

    // Adding States -------------------
    this.stateMachine
    .addState('idle', {
        onEnter: this.idleOnEnter,
    })
    .addState('move-left', {
        onEnter: this.moveLeftOnEnter,
        onUpdate: this.moveLeftOnUpdate
    })

    .addState('move-right', {
        onEnter: this.moveRightOnEnter,
        onUpdate: this.moveRightOnUpdate
    })


        .setState('idle')

    }

    update(dt: number) {
        this.stateMachine.update(dt)
    }

    // States Handlers

    private idleOnEnter() {

        const r = Phaser.Math.Between(1, 1000)
        if (r < 50) {
            this.stateMachine.setState('move-left')
        } else {
            this.stateMachine.setState('move-right')
        }
            }


    private moveLeftOnEnter () { 
        this.moveTime =0 
    }

    private moveLeftOnUpdate (dt: number) { 
      this.moveTime += dt 
      this.sprite.setVelocityX(-1)

      if (this.moveTime > 2000) {
          this.stateMachine.setState('move-right')
      }
    }

    private moveRightOnEnter () { 
        this.moveTime =0 
    }

    private moveRightOnUpdate (dt: number) { 
        this.moveTime += dt 
        this.sprite.setVelocityX(1)

        if (this.moveTime > 2000) {
            this.stateMachine.setState('move-left')
        }
       
    }

}
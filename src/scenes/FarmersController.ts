import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";



export default class FaController 
{
      // Properties
      private scene: Phaser.Scene
      private sprite: Phaser.Physics.Matter.Sprite
      private stateMachine: StateMachine
      private moveTime = 0
        
    // private isStomped: boolean = false;

    //   private obstacles: ObstaclesController
      //   private cursors: CursorKeys
      //   private player: PlayerController

      

//   Constructor -----

constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
   this.scene = scene
    this.sprite = sprite

    this.createAnimations()

    this.stateMachine = new StateMachine(this, 'farmers')

    // Adding States -------------------
    this.stateMachine
    .addState('farmer-idle', {
        onEnter: this.idleOnEnter,
    })
    .addState('farmer-left', {
        onEnter: this.moveLeftOnEnter,
        onUpdate: this.moveLeftOnUpdate
    })

    .addState('farmer-right', {
        onEnter: this.moveRightOnEnter,
        onUpdate: this.moveRightOnUpdate
    })

    .addState('crushed')

    
        .setState('farmer-idle')

        // events.on('farmer-stomped', this.handleTrucksStomped, this)

    }

    // destroy () {
    //     events.off('farmer-stomped', this.handleTrucksStomped, this)
    // }

    update(dt: number) {
        this.stateMachine.update(dt)
    }

     // Truck Animations ---------------------------------------------
     private createAnimations() {
        this.sprite.anims.create({
            key: 'farmer-idle',
            frames: [{
                key: 'farmers', frame: 'Happy_Farmer_Idle.png'
            }]
        });
    
        this.sprite.anims.create({
            key: 'farmer-left',
            frameRate: 4,
            frames: this.sprite.anims.generateFrameNames('farmers', {
                start: 1,
                end: 2,
                prefix: 'Happy_Farmer_Walk_Left_',
                suffix: '.png'
            }),
            repeat: -1
        });
    
        this.sprite.anims.create({
            key: 'farmer-right',
            frameRate: 4,
            frames: this.sprite.anims.generateFrameNames('farmers', {
                start: 1,
                end: 2,
                prefix: 'Happy_Farmer_Walk_Right_',
                suffix: '.png'
            }),
            repeat: -1
        });


       
    }
    
    

    // States Handlers

    private idleOnEnter() {
        this.sprite.play('farmer-idle')
        const r = Phaser.Math.Between(1, 1000)
        if (r < 50) {
            this.stateMachine.setState('farmer-left')
        } else {
            this.stateMachine.setState('farmer-right')
        }
            }


    private moveLeftOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('farmer-left')
    }

    private moveLeftOnUpdate (dt: number) { 
      this.moveTime += dt 
      this.sprite.setVelocityX(-1)

      if (this.moveTime > 2000) {
          this.stateMachine.setState('farmer-right')
      }
    }

    private moveRightOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('farmer-right')
    }

    private moveRightOnUpdate (dt: number) { 
        this.moveTime += dt
        this.sprite.setVelocityX(1)
        if (this.moveTime > 2000) {
            this.stateMachine.setState('farmer-left')

        }
    }




// Cry Farmer

}
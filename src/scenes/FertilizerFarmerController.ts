import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";



export default class FertilizerFarmerController 
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

    this.stateMachine = new StateMachine(this, 'fertilizerFarmer')

    // Adding States -------------------
    this.stateMachine
    .addState('fertilizerFarmer-idle', {
        onEnter: this.idleOnEnter,
    })
    .addState('fertilizerFarmer-left', {
        onEnter: this.moveLeftOnEnter,
        onUpdate: this.moveLeftOnUpdate
    })

    .addState('fertilizerFarmer-right', {
        onEnter: this.moveRightOnEnter,
        onUpdate: this.moveRightOnUpdate
    })

    .addState('crushed')

    
        .setState('fertilizerFarmer-idle')

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
            key: 'fertilizerFarmer-idle',
            frames: [{
                key: 'fertilizerFarmer', frame: 'Fertilizer_Farmer_Idle.png'
            }]
        });
    
        this.sprite.anims.create({
            key: 'fertilizerFarmer-left',
            frameRate: 4,
            frames: this.sprite.anims.generateFrameNames('fertilizerFarmer', {
                start: 1,
                end: 2,
                prefix: 'Fertilizer_Farmer_Walk_Left_',
                suffix: '.png'
            }),
            repeat: -1
        });
    
        this.sprite.anims.create({
            key: 'fertilizerFarmer-right',
            frameRate: 4,
            frames: this.sprite.anims.generateFrameNames('fertilizerFarmer', {
                start: 1,
                end: 2,
                prefix: 'Fertilizer_Farmer_Walk_Right_',
                suffix: '.png'
            }),
            repeat: -1
        });


       
    }
    
    

    // States Handlers

    private idleOnEnter() {
        this.sprite.play('fertilizerFarmer-idle')
        const r = Phaser.Math.Between(1, 1000)
        if (r < 50) {
            this.stateMachine.setState('fertilizerFarmer-left')
        } else {
            this.stateMachine.setState('fertilizerFarmer-right')
        }
            }


    private moveLeftOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('fertilizerFarmer-left')
    }

    private moveLeftOnUpdate (dt: number) { 
      this.moveTime += dt 
      this.sprite.setVelocityX(-1)

      if (this.moveTime > 2000) {
          this.stateMachine.setState('fertilizerFarmer-right')
      }
    }

    private moveRightOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('fertilizerFarmer-right')
    }

    private moveRightOnUpdate (dt: number) { 
        this.moveTime += dt
        this.sprite.setVelocityX(1)
        if (this.moveTime > 2000) {
            this.stateMachine.setState('fertilizerFarmer-left')

        }
    }




// Cry Farmer

}
import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class RedBoxController {
    public scene: Phaser.Scene;
    public sprite: Phaser.Physics.Matter.Sprite;
    public stateMachine: StateMachine;
    private moveTime = 0;
    public obstacles: ObstaclesController
    private transitionDelay = 1000; // Delay in milliseconds before transitioning to 'greenbox-left'
    private hasPowerCoOpCollected = false;
    private greenSectionCollided = false;

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite,  obstacles: ObstaclesController) {
        this.scene = scene
         this.sprite = sprite
         this.obstacles = obstacles
         this.sprite.setVisible(false); 



        //  this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
        //     const body = data.bodyB as MatterJS.BodyType
    
        //     if (this.obstacles.is('greySection', body)) {
        //         console.log('Grey section hit by green box:', this.sprite.name);
        //         this.stateMachine.setState('greySection-hit');
        //         return;
        //     }
        
        //     if (this.obstacles.is('greenSection', body)) {
        //         console.log('Green section hit by green box:', this.sprite.name);
        //         this.stateMachine.setState('greenSection-hit');
        //         return;
        //     }
        // })    
     
         this.createAnimations()
     
         this.stateMachine = new StateMachine(this, 'redBox')
     
         // Adding States -------------------
         this.stateMachine
         .addState('redBox-idle', {
             onEnter: this.idleOnEnter,
         })
         .addState('redBox-left', {
             onEnter: this.redBoxLeftOnEnter,
             onUpdate: this.redBoxLeftOnUpdate
         })
     
         .addState('redBox-right', {
             onEnter: this.redBoxRightOnEnter,
             onUpdate: this.redBoxRightOnUpdate
         })


        .addState('greySection-hit', {
            onEnter: this.greySectionHitOnEnter,

        })
     
             .setState('redBox-right')
             events.on('powerCoOp-collected', this.handlePowerCoOpCollected, this);
     
     
             // events.on('farmer-stomped', this.handleTrucksStomped, this)
     
         }
    update(dt: number) {
        if (this.hasPowerCoOpCollected) {
            this.stateMachine.update(dt);
        }
    }

    

    // Box Animations ---------------------------------------------
    private createAnimations() {
        this.sprite.anims.create({
            key: 'redBox-idle',
            frames: [{ key: 'redBox', frame: 'redBox.png' }],
        });

        this.sprite.anims.create({
            key: 'redBox-right',
            frames: [{ key: 'redBox', frame: 'redBox.png' }],
        });

        this.sprite.anims.create({
            key: 'redBox-left',
            frames: [{ key: 'redBox', frame: 'redBox.png' }],
        });


    }

    // States Handlers
    private idleOnEnter() {
        this.stateMachine.setState('redBox-right');
            }


    private redBoxLeftOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('redBox-left')
    }

    private redBoxLeftOnUpdate (dt: number) { 
      this.moveTime += dt 
      this.sprite.setVelocityX(-1)

    //   if (this.moveTime > 2000) {
    //       this.stateMachine.setState('greenBox-right')
    //   }
    }

    private redBoxRightOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('redBox-right')
    }

    private redBoxRightOnUpdate (dt: number) { 
        this.moveTime += dt
        this.sprite.setVelocityX(1)
        // if (this.moveTime > 2000) {
        //     this.stateMachine.setState('redBox-left')

        // }
}


private greySectionHitOnEnter() {

    console.log('ROJO-GREYYYYY-section-hit!')
    this.stateMachine.setState('redBox-right');

}

public handlePowerCoOpCollected() {
    // Set the flag to true when powerCoOp is collected
    this.hasPowerCoOpCollected = true;
    this.sprite.setVisible(true);
}
}

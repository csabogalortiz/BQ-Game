import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class BrownBoxController {
    public scene: Phaser.Scene;
    public sprite: Phaser.Physics.Matter.Sprite;
    public stateMachine: StateMachine;
    private moveTime = 0;
    public obstacles: ObstaclesController
    private transitionDelay = 1000; // Delay in milliseconds before transitioning to 'greenbox-left'
    private direction: 'left' | 'right'; 

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obstacles: ObstaclesController, initialDirection: 'left' | 'right') {
        this.scene = scene
         this.sprite = sprite
         this.obstacles = obstacles
         this.direction = initialDirection;




         this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType
    
            if (this.obstacles.is('greySection', body)) {

                this.stateMachine.setState('greySection-hit')
            
          
                return
            }
        })    
     
         this.createAnimations()
     
         this.stateMachine = new StateMachine(this, 'brownBox')

         if (initialDirection === 'left') {
            this.stateMachine.setState('brownBox-left');
        } else {
            this.stateMachine.setState('brownBox-right');
        }
     
         // Adding States -------------------
         this.stateMachine
        //  .addState('brownBox-idle', {
        //      onEnter: this.idleOnEnter,
        //  })
         .addState('brownBox-left', {
             onEnter: this.brownBoxLeftOnEnter,
             onUpdate: this.brownBoxLeftOnUpdate
         })
     
         .addState('brownBox-right', {
             onEnter: this.brownBoxRightOnEnter,
             onUpdate: this.brownBoxRightOnUpdate
         })


        .addState('brownBox-hit', {
            onEnter: this.brownSectionHitOnEnter,

        })
     
     
         
             .setState('brownBox-idle')
     
             // events.on('farmer-stomped', this.handleTrucksStomped, this)
     
         }
         update(dt: number) {
            // Handle movement based on the current direction
            if (this.direction === 'left') {
                this.moveLeft(dt); // Pass dt as a parameter here
            } else {
                this.moveRight(dt); // Pass dt as a parameter here
            }
        
            this.stateMachine.update(dt);
        }
        
        private moveLeft(dt: number) { // Add dt as a parameter here
            this.moveTime += dt;
            this.sprite.setVelocityX(-1);
            // Check if you need to change direction based on the moveTime or other conditions
        }
        
        private moveRight(dt: number) { // Add dt as a parameter here
            this.moveTime += dt;
            this.sprite.setVelocityX(1);
            // Check if you need to change direction based on the moveTime or other conditions
        }
    

    // Box Animations ---------------------------------------------
    private createAnimations() {
        this.sprite.anims.create({
            key: 'brownBox-idle',
            frames: [{ key: 'brownBox', frame: 'brownBox.png' }],
        });

        this.sprite.anims.create({
            key: 'brownBox-right',
            frames: [{ key: 'brownBox', frame: 'brownBox.png' }],
        });

        this.sprite.anims.create({
            key: 'brownBox-left',
            frames: [{ key: 'brownBox', frame: 'brownBox.png' }],
        });


    }

    // States Handlers
    private idleOnEnter() {

            }


    private brownBoxLeftOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('brownBox-left')
    }

    private brownBoxLeftOnUpdate (dt: number) { 
      this.moveTime += dt 
      this.sprite.setVelocityX(-1)

    //   if (this.moveTime > 2000) {
    //       this.stateMachine.setState('greenBox-right')
    //   }
    }

    private brownBoxRightOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('brownBox-right')
    }

    private brownBoxRightOnUpdate (dt: number) { 
        this.moveTime += dt
        this.sprite.setVelocityX(1)
        // if (this.moveTime > 2000) {
        //     this.stateMachine.setState('redBox-left')

        // }
}


private brownSectionHitOnEnter() {
    this.stateMachine.setState('brownBox-right');

}
}

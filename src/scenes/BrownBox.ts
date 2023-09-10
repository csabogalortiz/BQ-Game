
import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";
type MoveDirection = "left" | "right";

export default class BrownBoxController extends Phaser.Physics.Matter.Image {

    private startX: number;
    private startY: number;
    private moveDirection: MoveDirection;
    private brownBox: Phaser.Physics.Matter.Image;
    private moveTween?: Phaser.Tweens.Tween;

    constructor(scene, x, y, texture, options, moveDirection: MoveDirection = "left")
	{
        super(scene.matter.world, x, y, texture, 0, options)
    
        scene.add.existing(this)
    
        this.setFriction(1, 0, Infinity)
    
        this.startX = x
        this.startY = y
        this.moveDirection = moveDirection;
        this.brownBox = this;

        // if (moveDirection === "right") {
        //     // If the moveDirection is "right," flip the platform horizontally
        //     this.flipX = true;
        // }
    }

    moveHorizontally() {
        // Move to the right only
        this.moveTween = this.scene.tweens.addCounter({
            from: 0,
            to: 800, // Adjust the speed as needed
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween, target) => {
                const x = this.startX + target.value;
                const dx = x - this.x;
                this.x = x;
                this.setVelocityX(dx);
            },
        });
    }
    

    

    getBody(): MatterJS.BodyType {
        return this.brownBox.body as MatterJS.BodyType;
    }

    handleBQPowerCollected() {
       
        if (this.moveTween) {
            this.moveTween.stop();
        }
    
        // Create a fade-out tween 
        this.scene.tweens.add({
            targets: this,
            alpha: 0, // Fade out by reducing alpha to 0
            duration: 1000, // Adjust the duration as needed
            onComplete: () => {
                // Destroy the box after it fades out
                this.destroy();
            }
        });
    }
}








































// import Phaser from "phaser";
// import StateMachine from "../statemachine/StateMachine";
// import { sharedInstance as events } from "./EventCenter";
// import ObstaclesController from "./ObstaclesController";

// export default class BrownBoxController {
//     public scene: Phaser.Scene;
//     public sprite: Phaser.Physics.Matter.Sprite;
//     public stateMachine: StateMachine;
//     private moveTime = 0;
//     public obstacles: ObstaclesController
//     private transitionDelay = 1000; // Delay in milliseconds before transitioning to 'greenbox-left'
//     private direction: 'left' | 'right'; 

//     constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obstacles: ObstaclesController, initialDirection: 'left' | 'right') {
//         this.scene = scene
//          this.sprite = sprite
//          this.obstacles = obstacles
//          this.direction = initialDirection;




//          this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
//             const body = data.bodyB as MatterJS.BodyType
    
//             if (this.obstacles.is('greySection', body)) {

//                 this.stateMachine.setState('greySection-hit')
            
          
//                 return
//             }
//         })    
     
//         //  this.createAnimations()
     
//          this.stateMachine = new StateMachine(this, 'brownBox')

//          if (initialDirection === 'left') {
//             this.stateMachine.setState('brownBox-left');
//         } else {
//             this.stateMachine.setState('brownBox-right');
//         }
     
//          // Adding States -------------------
//          this.stateMachine
     
//          }
//          update(dt: number) {
//             // Handle movement based on the current direction
//             if (this.direction === 'left') {
//                 this.moveLeft(dt); // Pass dt as a parameter here
//             } else {
//                 this.moveRight(dt); // Pass dt as a parameter here
//             }
        
//             this.stateMachine.update(dt);
//         }
        
//         private moveLeft(dt: number) { // Add dt as a parameter here
//             this.moveTime += dt;
//             this.sprite.setVelocityX(-1);
//             // Check if you need to change direction based on the moveTime or other conditions
//         }
        
//         private moveRight(dt: number) { // Add dt as a parameter here
//             this.moveTime += dt;
//             this.sprite.setVelocityX(1);
//             // Check if you need to change direction based on the moveTime or other conditions
//         }

//         destroy() {
//             // Release any resources associated with the brown box here
        
       
//         }
    

//         // Inside the BrownBoxController class
// handlePowerCoOpCollected() {
//     // Stop any movement or animation of the brown box
//     this.sprite.setVelocity(0);
//     this.sprite.anims.stop();

//     // Create a fade-out tween for the brown box
//     this.scene.tweens.add({
//         targets: this.sprite,
//         alpha: 0, // Fade out by reducing alpha to 0
//         duration: 1000, // Adjust the duration as needed
//         onComplete: () => {
//             // Destroy the brown box after it fades out
//             this.sprite.destroy(); // Destroy the sprite
//             if (this.sprite.body) {
//                 this.scene.matter.world.remove(this.sprite.body); // Remove the physics body from the Matter.js world
//             }
//         }
//     });
// }


//     // Box Animations ---------------------------------------------
// //     private createAnimations() {
// //         this.sprite.anims.create({
// //             key: 'brownBox-idle',
// //             frames: [{ key: 'brownBox', frame: 'brownBox.png' }],
// //         });

// //         this.sprite.anims.create({
// //             key: 'brownBox-right',
// //             frames: [{ key: 'brownBox', frame: 'brownBox.png' }],
// //         });

// //         this.sprite.anims.create({
// //             key: 'brownBox-left',
// //             frames: [{ key: 'brownBox', frame: 'brownBox.png' }],
// //         });


// //     }

// //     // States Handlers
// //     private idleOnEnter() {

// //             }


// //     private brownBoxLeftOnEnter () { 
// //         this.moveTime =0 
// //         this.sprite.anims.play('brownBox-left')
// //     }

// //     private brownBoxLeftOnUpdate (dt: number) { 
// //       this.moveTime += dt 
// //       this.sprite.setVelocityX(-1)

// //     //   if (this.moveTime > 2000) {
// //     //       this.stateMachine.setState('greenBox-right')
// //     //   }
// //     }

// //     private brownBoxRightOnEnter () { 
// //         this.moveTime =0 
// //         this.sprite.anims.play('brownBox-right')
// //     }

// //     private brownBoxRightOnUpdate (dt: number) { 
// //         this.moveTime += dt
// //         this.sprite.setVelocityX(1)
// //         // if (this.moveTime > 2000) {
// //         //     this.stateMachine.setState('redBox-left')

// //         // }
// // }


// // private brownSectionHitOnEnter() {
// //     this.stateMachine.setState('brownBox-right');

// // }
// }

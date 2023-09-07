import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class GreenBoxController {
    public scene: Phaser.Scene;
    public sprite: Phaser.Physics.Matter.Sprite;
    public stateMachine: StateMachine;
    public obstacles: ObstaclesController
    private moveTime = 0;
    private transitionDelay = 1000; // Delay in milliseconds before transitioning to 'greenbox-left'

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obstacles: ObstaclesController) {

        
        this.scene = scene
         this.sprite = sprite
         this.obstacles = obstacles
     

         this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType
    
            if (this.obstacles.is('greenSection', body)) {

                this.stateMachine.setState('greenSection-hit')
            
          
                return
            }
    
            if (this.obstacles.is('greySection', body)) {
    
                this.stateMachine.setState('greenBox-idle')
            
                return
            }
    
        })    

         this.createAnimations()
     
         this.stateMachine = new StateMachine(this, 'greenBox')
     
         // Adding States -------------------
         this.stateMachine
         .addState('greenBox-idle', {
             onEnter: this.idleOnEnter,
         })
         .addState('greenBox-left', {
             onEnter: this.greenBoxLeftOnEnter,
             onUpdate: this.greenBoxLeftOnUpdate
         })
     
         .addState('greenBox-right', {
             onEnter: this.greenBoxRightOnEnter,
             onUpdate: this.greenBoxRightOnUpdate
         })

    

         .addState('greySection-hit', {
            onEnter: this.greySectionHitOnEnter,

        })

        .addState('greenSection-hit', {
            onEnter: this.greenSectionHitOnEnter,

        })

     
         
             .setState('greenBox-left')


          
     
             // events.on('farmer-stomped', this.handleTrucksStomped, this)
     
         }
    update(dt: number) {
        this.stateMachine.update(dt);
    }

    // Box Animations ---------------------------------------------
    private createAnimations() {
        this.sprite.anims.create({
            key: 'greenBox-idle',
            frames: [{ key: 'greenBox', frame: 'greenBox.png' }],
        });

        this.sprite.anims.create({
            key: 'greenBox-right',
            frames: [{ key: 'greenBox', frame: 'greenBox.png' }],
        });

        this.sprite.anims.create({
            key: 'greenBox-left',
            frames: [{ key: 'greenBox', frame: 'greenBox.png' }],
        });


    }

    

    // States Handlers
    private idleOnEnter() {
        this.stateMachine.setState('greenBox-left');
            }


    private greenBoxLeftOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('greenBox-left')
    }

    private greenBoxLeftOnUpdate (dt: number) { 
      this.moveTime += dt 
      this.sprite.setVelocityX(-1)

    //   if (this.moveTime > 2000) {
    //       this.stateMachine.setState('greenBox-right')
    //   }
    }

    private greenBoxRightOnEnter () { 
        this.moveTime =0 
        this.sprite.anims.play('greenBox-right')
    }

    private greenBoxRightOnUpdate (dt: number) { 
        this.moveTime += dt
        this.sprite.setVelocityX(1)
        if (this.moveTime > 2000) {
            this.stateMachine.setState('greenBox-left')

        }
}


private greenSectionHitOnEnter() {

    console.log('Caja-Pega-Verde-section-hit!')
    this.stateMachine.setState('greenBox-idle');

}
 
private greySectionHitOnEnter() {

    console.log('BOOOOX-GREYYYYY-section-hit!')
    this.stateMachine.setState('greenBox-idle');

}
}

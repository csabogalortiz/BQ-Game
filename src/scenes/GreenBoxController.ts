import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class GreenBoxController {
    protected scene: Phaser.Scene
    protected sprite: Phaser.Physics.Matter.Sprite
    protected stateMachine: StateMachine
    protected obstacles: ObstaclesController

    // Delay in milliseconds before transitioning to 'greenbox-left'
    private moveTime = 0;
    private hasPowerCoOpCollected = false;


    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obstacles: ObstaclesController) {
        this.scene = scene
        this.sprite = sprite
        this.obstacles= obstacles
        this.sprite.setVisible(false);
        console.log('Sprite:', this.sprite.body);

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType
            console.log('Sprite:', this.sprite.body);
        
            if (this.obstacles.is('greenSection', body)) {
                console.log('Green section hit by green box');
                this.stateMachine.setState('greenSection-hit');
                return;
            }
        
        
        })

        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'greenBox1');
    
        // Set collision handlers for red and green sections
    
        // Adding States -------------------
        this.stateMachine
            .addState('greenBox-idle', {
                onEnter: this.idleOnEnter,
            })
            .addState('greenBox-left', {
                onEnter: this.greenBoxLeftOnEnter,
                onUpdate: this.greenBoxLeftOnUpdate,
                onExit: this.greenBoxLeftOnExit
            })
        
            
            .addState('greenSection-hit', {
                onEnter: this.greenSectionHitOnEnter,
            })

            .setState('greenBox-idle');
    
        events.on('powerCoOp-collected', this.handlePowerCoOpCollected, this);

    }


    update(dt: number) {
      
        // Only create the green box sprite if the event has been triggered
        if (this.hasPowerCoOpCollected) {
            this.stateMachine.update(dt);
        }
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
        

        }
        

        private greenBoxLeftOnExit() {
            this.sprite.stop()
        }
    

        
        private greenSectionHitOnEnter() {

            console.log('green-section-hit!')
            this.stateMachine.setState('greenBox-idle');
    
        }
        
        private createAnimations() {
            this.sprite.anims.create({
                key: 'greenBox-idle',
                frames: [{ key: 'greenBox1', frame: 'greenBox.png' }],
            });
    
            this.sprite.anims.create({
                key: 'greenBox-right',
                frames: [{ key: 'greenBox1', frame: 'greenBox.png' }],
            });
    
            this.sprite.anims.create({
                key: 'greenBox-left',
                frames: [{ key: 'greenBox1', frame: 'greenBox.png' }],
            });
    
    
        }
        
        public handlePowerCoOpCollected() {
            // Set the flag to true when powerCoOp is collected
            this.hasPowerCoOpCollected = true;
            this.sprite.setVisible(true);
        }
    }
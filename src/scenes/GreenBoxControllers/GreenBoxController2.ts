import Phaser from "phaser";
import StateMachine from "./../../statemachine/StateMachine"
import { sharedInstance as events } from "./../EventCenter"
import ObstaclesController from "./../ObstaclesController"

export default class GreenBoxController2 {
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private moveTime = 0
    private obstacles: ObstaclesController
    // private hasPowerCoOpCollected = false;



    private stateMachine: StateMachine
    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obstacles: ObstaclesController) {
        this.scene = scene
        this.sprite = sprite

        this.obstacles = obstacles
        // this.sprite.setVisible(false);


        this.stateMachine = new StateMachine(this, 'greenBox2')

        // The this keyword refers to the current instance of the Hero class. 
        // By passing this as the first argument to the StateMachine constructor, 
        // you are providing the current instance of the Hero class as the context object.


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

            .addState('spike-hit', {
                onEnter: this.spikeHitOnEnter,
            })

            .addState('winn-hit', {
                onEnter: this.winnHitOnEnter,
            })

            .addState('still', {
                onEnter: this.stillOnEnter,
            })


            .setState('idle')

            // events.on('powerCoOp-collected', this.handlePowerCoOpCollected, this);


        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            if (this, obstacles.is('spikes', body)) {
                this.stateMachine.setState('spike-hit')
                return
            }

            if (this.obstacles.is('winn', body)) {
                this.stateMachine.setState('winn-hit');
                return;
            }

        
            const gameObject = body.gameObject

            if (!gameObject) {
                return
            }

            const sprite = gameObject as Phaser.Physics.Matter.Sprite

        });

    }

    update(dt: number) {
        this.stateMachine.update(dt);
        // if (this.hasPowerCoOpCollected) {
        // }
    }


    private idleOnEnter() {

        const r = Phaser.Math.Between(1, 1000)
        if (r < 50) {
            this.stateMachine.setState('move-left')
        } else {
            this.stateMachine.setState('move-right')
        }
    }

    private moveLeftOnEnter() {
        this.moveTime = 0


    }

    private moveLeftOnUpdate(dt: number) {
        this.moveTime += dt
        this.sprite.setVelocityX(-1)
        if (this.moveTime > 4000) {
            this.stateMachine.setState('move-right')

        }

    }

    private moveRightOnEnter() {
        this.moveTime = 0


    }

    private moveRightOnUpdate(dt: number) {
        this.moveTime += dt
        this.sprite.setVelocityX(1)
        if (this.moveTime > 1000) {
            this.stateMachine.setState('move-left')

        }

    }

    private stillOnEnter() {
        this.sprite.setVelocityX(0); // Stop horizontal movement
    }
   

    // **** Spike
    private spikeHitOnEnter() {
        this.sprite.setVelocityY(-12);

        console.log('console: spike-hit')

 
        this.stateMachine.setState('idle')

    }


    private winnHitOnEnter() {
        this.sprite.setVelocityX(0);


        console.log('BOX2: winn-hit')

        // this.stateMachine.setState('still')
        return
    }

    // public handlePowerCoOpCollected() {
    //     // Set the flag to true when powerCoOp is collected
    //     this.hasPowerCoOpCollected = true;
    //     this.sprite.setVisible(true);
    // }
}



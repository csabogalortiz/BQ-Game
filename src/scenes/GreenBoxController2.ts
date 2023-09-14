import Phaser from "phaser";
import StateMachine from "~/statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";



export default class GreenBoxController2 {
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private moveTime = 0
    private obstacles: ObstaclesController
    private hasPowerCoOpCollected = false;
    private hasCollidedWithWinn = false; 


    private stateMachine: StateMachine



    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obstacles: ObstaclesController) {
        this.scene = scene
        this.sprite = sprite

        this.obstacles = obstacles
        this.sprite.setVisible(false);

        this.createAnimations()
        this.stateMachine = new StateMachine(this, 'greenBoxes')

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

            events.on('powerCoOp-collected', this.handlePowerCoOpCollected, this);

        // el set state to set the initial state of the state machine.

        // *********** Collisions ***********************************

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            if (this, obstacles.is('spikes', body)) {
                this.stateMachine.setState('spike-hit')
                return
            }

            const hackIsInWinnableArea = () =>{
                return this.sprite.x < 1050 && this.sprite.y > 900
                }

                
                if (!this.hasCollidedWithWinn && hackIsInWinnableArea ( )) {
                    this.stateMachine.setState('winn-hit');
                    this.hasCollidedWithWinn = true; // Set the flag to true
                    return
            }

        
            const gameObject = body.gameObject

            if (!gameObject) {
                return
            }

            const sprite = gameObject as Phaser.Physics.Matter.Sprite


    

        });

    }




    update(dt: number) {
        if (this.hasPowerCoOpCollected) {
            this.stateMachine.update(dt);
        }
    }


    private idleOnEnter() {
        this.sprite.play('idle')
        const r = Phaser.Math.Between(1, 1000)
        if (r < 50) {
            this.stateMachine.setState('move-left')
        } else {
            this.stateMachine.setState('move-right')
        }
    }

    private moveLeftOnEnter() {
        this.moveTime = 0
        this.sprite.play('move-left')

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
        this.sprite.play('move-right')

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

        console.log('spike-hit')

        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b,

                )
                this.sprite.setTint(color)
            }
        })
        this.stateMachine.setState('idle')



    }


    private winnHitOnEnter() {
        this.sprite.setVelocityY(-4);


        console.log('winn-hit')

        const startColor = Phaser.Display.Color.ValueToColor(0xFFF800)
        const endColor = Phaser.Display.Color.ValueToColor(0x36C636)
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 1,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b,

                )
                this.sprite.setTint(color)
            }
        })
        this.stateMachine.setState('still')
        return
    }


    private createAnimations() {
        this.sprite.anims.create({
            key: 'idle',
            frames: [{ key: 'greenBoxes', frame: 'greenBox.png' }],
        });

        this.sprite.anims.create({
            key: 'move-left',
            frames: [{ key: 'greenBoxes', frame: 'greenBox.png' }],
        });

        this.sprite.anims.create({
            key: 'move-right',
            frames: [{ key: 'greenBoxes', frame: 'greenBox.png' }],
        });

       
    }

    public handlePowerCoOpCollected() {
        // Set the flag to true when powerCoOp is collected
        this.hasPowerCoOpCollected = true;
        this.sprite.setVisible(true);
    }
}




import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";
import { Scene } from "phaser";
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController 
{

    // Properties
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private stateMachine: StateMachine
  private obstacles: ObstaclesController
  private compliance =100

//   Constructor -----

    constructor(scene: Phaser.Scene,  sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obstacles:ObstaclesController) {
        this.scene = scene
        this.sprite = sprite
        this.cursors = cursors
        this.obstacles= obstacles

        this.createAnimations()

        this.stateMachine = new StateMachine(this, 'player')

        // Adding States -------------------
        this.stateMachine
            .addState('idle', {
                onEnter: this.idleOnEnter,
                onUpdate: this.idleOnUpdate
            })
            .addState('walk', {
                onEnter: this.walkOnEnter,
                onUpdate: this.walkOnUpdate,
                onExit: this.walkOnExit
            })
            .addState('jump', {
                onEnter: this.jumpOnEnter,
                onUpdate: this.jumpOnUpdate
            })

            .addState('cloud-hit', {
                onEnter: this.cloudHitOnEnter,
                // onUpdate: this.cloudHitOnUpdate
            })
            .setState('idle')

        // Collisions ----------------
        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            if (this.obstacles.is('fall-clouds', body)
            ) 
        {
            // primero rebota  y luego vuelve al idle state 
           this.stateMachine.setState('cloud-hit')
           this.stateMachine.setState('idle')
            return
        }
            const gameObject = body.gameObject

            if (!gameObject)
			{
				return
			}

			if (gameObject instanceof Phaser.Physics.Matter.TileBody)
			{
				if (this.stateMachine.isCurrentState('jump'))
				{
					this.stateMachine.setState('idle')
				}
				return
			}

			const sprite = gameObject as Phaser.Physics.Matter.Sprite
			const type = sprite.getData('type')

			switch (type)
			{
				case 'bean':
				{
                    events.emit('bean-collected')
					sprite.destroy()
					break
				}

                case 'red-bean':
				{
                    events.emit('redBean-collected')
					sprite.destroy()
					break
				}

                case 'compliance':
                    {
                        const value = sprite.getData('compliancePoints') ?? 10
                        this.compliance += value
                        events.emit('compliance-changed', this.compliance)
                        sprite.destroy()
                        break
                    }
            }



            
            
        })
    }

    // Updating States ------------------------
    update(dt: number) {
        this.stateMachine.update(dt)
    }

    private idleOnEnter() {
        this.sprite.play('player-idle')
    }

   	private idleOnUpdate()
	{
		if (this.cursors.left.isDown || this.cursors.right.isDown)
		{
			this.stateMachine.setState('walk')
		}

		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
		if (spaceJustPressed)
		{
			this.stateMachine.setState('jump')
		}
	}

    private walkOnEnter() {
        this.sprite.play('player-walk')
    }

    private walkOnUpdate() {
        const speed = 5
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        } else {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressed) {
            this.stateMachine.setState('jump')
        }
    }

    private walkOnExit() {
        this.sprite.stop()
    }

    private jumpOnEnter() {
        this.sprite.setVelocityY(-12)
    }

    private jumpOnUpdate() {
        const speed = 5
        if (this.cursors.left.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        } else if (this.cursors.right.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
    }

    private cloudHitOnEnter() {
        this.sprite.setVelocityY(-12);
        this.compliance = Phaser.Math.Clamp(this.compliance - 10, 0, 100)
        events.emit('compliance-changed', this.compliance)

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
    }

    // Player Animations ---------------------------------------------
    private createAnimations() {
        this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player', frame: 'penguin_walk01.png' }]
        })

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('player', {
                start: 1,
                end: 4,
                prefix: 'penguin_walk0',
                suffix: '.png'
            }),
            repeat: -1
        })

     
    }
}

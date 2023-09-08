import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";

export default class PlatformsController extends Phaser.Physics.Matter.Image {

    private startX: number;
    private startY: number;
    constructor(scene, x, y, texture, options)
	{
        super(scene.matter.world, x, y, texture, 0, options)
    
        scene.add.existing(this)
    
        this.setFriction(1, 0, Infinity)
    
        this.startX = x
        this.startY = y
    }

    moveHorizontally()
{
    console.log('platform created')
	this.scene.tweens.addCounter({
		from: 0,
		to: -300,
		duration: 1500,
		ease: Phaser.Math.Easing.Sine.InOut,
		repeat: -1,
		yoyo: true,
		onUpdate: (tween, target) => {
			const x = this.startX + target.value
			const dx = x - this.x
			this.x = x
			this.setVelocityX(dx)
		}
	})
}

moveVertically()
{
	this.scene.tweens.addCounter({
		from: 0,
		to: -300,
		duration: 1500,
		ease: Phaser.Math.Easing.Sine.InOut,
		repeat: -1,
		yoyo: true,
		onUpdate: (tween, target) => {
			const y = this.startY + target.value
			const dy = y - this.y
			this.y = y
			this.setVelocityY(dy)
		}
	})
}
}
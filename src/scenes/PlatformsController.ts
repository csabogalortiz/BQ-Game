import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
import ObstaclesController from "./ObstaclesController";
type MoveDirection = "left" | "right";

export default class PlatformsController extends Phaser.Physics.Matter.Image {

    private startX: number;
    private startY: number;
    private moveDirection: MoveDirection;
    private platform: Phaser.Physics.Matter.Image;
    private moveTween?: Phaser.Tweens.Tween;

    constructor(scene, x, y, texture, options, moveDirection: MoveDirection = "left")
	{
        super(scene.matter.world, x, y, texture, 0, options)
    
        scene.add.existing(this)
    
        this.setFriction(1, 0, Infinity)
    
        this.startX = x
        this.startY = y
        this.moveDirection = moveDirection;
        this.platform = this;

        if (moveDirection === "right") {
            // If the moveDirection is "right," flip the platform horizontally
            this.flipX = true;
        }
    }

    moveHorizontally() {
        this.moveTween = this.scene.tweens.addCounter({
            from: 0,
            to: this.moveDirection === "left" ? -300 : 300, // Adjust the speed and direction as needed
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
            repeat: -1,
            yoyo: true,
            onUpdate: (tween, target) => {
                const x = this.startX + target.value;
                const dx = x - this.x;
                this.x = x;
                this.setVelocityX(dx);
            },
        });
    }

    moveHorizontallyLeft() {
        // Invert the direction by changing the `to` value
        this.moveTween = this.scene.tweens.addCounter({
            from: 0,
            to: this.moveDirection === "right" ? 300 : -300, // Invert the direction
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
            repeat: -1,
            yoyo: true,
            onUpdate: (tween, target) => {
                const x = this.startX + target.value;
                const dx = x - this.x;
                this.x = x;
                this.setVelocityX(dx);
            },
        });
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

    getBody(): MatterJS.BodyType {
        return this.platform.body as MatterJS.BodyType;
    }

    handleBQPowerCollected() {
        // Stop the platform's Tween if it exists
        if (this.moveTween) {
            this.moveTween.stop();
        }
    
        // Create a fade-out tween for the platform
        this.scene.tweens.add({
            targets: this,
            alpha: 0, // Fade out by reducing alpha to 0
            duration: 1000, // Adjust the duration as needed
            onComplete: () => {
                // Destroy the platform after it fades out
                this.destroy();
            }
        });
    }
}

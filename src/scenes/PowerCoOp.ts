import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class PowerCoOp {
    private scene: Phaser.Scene;
    private sprite: Phaser.Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isCollected: boolean = false;


    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
        this.scene = scene;
        this.sprite = sprite;

        // Create the sprite with the initial position
        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'powerCoOp');

        // Adding States -------------------
        this.stateMachine
            .addState('powerCoOp-idle', {
                onEnter: this.idleOnEnter,
            })
            .addState('powerCoOp-collected', {
                onEnter: this.collectedOnEnter,
            })
            .setState('powerCoOp-idle');

        events.on('player-collect-powerCoOp', this.handleCollectPowerCoOp, this);
    }

    destroy() {
        events.off('player-collect-powerCoOp', this.handleCollectPowerCoOp, this);
    }

    update(dt: number) {
        this.stateMachine.update(dt);
    }

    // BQPower Animations ---------------------------------------------
    private createAnimations() {
        this.sprite.anims.create({
            key: 'powerCoOp-up-down',
            frames: [{ key: 'powerCoOp', frame: 'BQPowerup_1.png' }],
            frameRate: 1, // Adjust the frame rate as needed
            repeat: -1, // Repeat the animation indefinitely
        });
    }

    // States Handlers
    private idleOnEnter() {
        this.sprite.play('powerCoOp-up-down');
        // Create a tween to move the sprite up and down.
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 30, // Adjust the vertical movement distance
            duration: 1000, // Adjust the duration of each movement cycle
            yoyo: true, // Makes the tween go back and forth (up and down)
            repeat: -1, // Repeat indefinitely
        });
    }
    private collectedOnEnter() {
        this.isCollected = true;
        this.sprite.setAlpha(0); // Make the BQPower sprite invisible

        // Trigger any actions you want when the BQPower is collected
        // For example, revealing the hidden box with ID and coordinates
        events.emit('powerCoOp-collected', this.sprite.x, this.sprite.y);
    }

    private handleCollectPowerCoOp() {
        if (!this.isCollected) {
            console.log('powerCoopCollected')
            this.stateMachine.setState('powerCoOp-collected');
            events.emit('powerCoOp-collected', this.sprite.x, this.sprite.y);

        }
    }
}

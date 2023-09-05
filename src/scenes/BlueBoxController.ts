import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class BlueBoxController {
    private scene: Phaser.Scene;
    private sprite: Phaser.Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isOpen: boolean = false;
    private hasSpawnedItems: boolean = false;

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
        this.scene = scene;
        this.sprite = sprite;

        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'blueBox');

    // Adding States -------------------
    this.stateMachine
    .addState('blueBox-idle', {
        onEnter: this.idleOnEnter,
    })
    .addState('blueBox-flashing', {
        onEnter: this.boxFlashOnEnter,
    })
    .addState('blueBox-open', {
        onEnter: this.boxOpenOnEnter,
    })
    .setState('blueBox-flashing');

events.on('blueBox-hit', this.handleBoxHit, this);
}

destroy() {
events.off('blueBox-hit', this.handleBoxHit, this);
}

update(dt: number) {
this.stateMachine.update(dt);
}


     // Box Animations ---------------------------------------------
     private createAnimations() {



        this.sprite.anims.create({
            key: 'blueBox-idle',
            frames: [{
                key: 'blueBox', frame: 'blueBox_Idle.png'
            }]
        });
    
        this.sprite.anims.create({
            key: 'blueBox-flashing',
            frameRate: 2,
            frames: this.sprite.anims.generateFrameNames('blueBox', {
                start: 1,
                end: 2,
                prefix: 'blueBox_Flashing_',
                suffix: '.png'
            }),
            repeat: -1
        });
    
    
        this.sprite.anims.create({
            key: 'blueBox-open',
            frameRate: 4,
            frames: this.sprite.anims.generateFrameNames('blueBox', {
                start: 1,
                end: 2,
                prefix: 'blueBox_open_',
                suffix: '.png'
            }),
        });
    }

    // States Handlers
    private idleOnEnter() {
        this.stateMachine.setState('blueBox-flashing');
    }

    private boxFlashOnEnter() {
        this.sprite.play('blueBox-flashing');
    }

    private boxOpenOnEnter() {
        this.sprite.play('blueBox-open');

        if (!this.hasSpawnedItems) {
            this.spawnItems();
            this.hasSpawnedItems = true;
        }
    }

    private spawnItems() {
        // Spawn mushroom
    const coordinates = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y - 30, 'coordinates', 0);
    coordinates.setData('type', 'coordinates'); // Set the type data attribute
    // coordinates.setVelocityY(-10);

    // Spawn coin
    const id = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y - 30, 'id', 0);
    id.setData('type', 'id'); // Set the type data attribute
    // id.setVelocityY(-20);
        // // Remove spawned items after a delay
        // this.scene.time.delayedCall(2000, () => {
        //     coordinates.destroy();
        //     id.destroy();
        // });
        return { coordinates, id };
    }


    private handleBoxHit(blueBox: Phaser.Physics.Matter.Sprite) {
        if (this.sprite !== blueBox || this.isOpen) {
            return;
        }

        events.off('blueBox-hit', this.handleBoxHit, this);

        this.stateMachine.setState('blueBox-open');
        this.isOpen = true;
    }

   

}
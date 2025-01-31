import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class BlueBoxController {
    public scene: Phaser.Scene;
    public sprite: Phaser.Physics.Matter.Sprite;
    public stateMachine: StateMachine;
    public isOpen: boolean = false;
    public hasSpawnedItems: boolean = false;

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
        this.scene = scene;
        this.sprite = sprite;

        this.createAnimations();
        this.sprite.setVisible(false); 

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
events.on('bqpower-collected', this.handleBQPowerCollected, this);
}

destroy() {
events.off('blueBox-hit', this.handleBoxHit, this);
events.off('bqpower-collected', this.handleBQPowerCollected, this);
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
    public idleOnEnter() {
        this.stateMachine.setState('blueBox-flashing');
    }

    public boxFlashOnEnter() {
        this.sprite.play('blueBox-flashing');
    }

    public boxOpenOnEnter() {
        this.sprite.play('blueBox-open');

        if (!this.hasSpawnedItems) {
            this.spawnItems();
            this.hasSpawnedItems = true;
        }
    }

    public spawnItems() {
        // Spawn mushroom
    const coordinates = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y - 280, 'coordinates', 0);
    coordinates.setData('type', 'coordinates'); // Set the type data attribute
    // coordinates.setVelocityY(-10);

    // Spawn coin
    const id = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y - 270, 'id', 0);
    id.setData('type', 'id'); // Set the type data attribute
    // id.setVelocityY(-20);
        // // Remove spawned items after a delay
        // this.scene.time.delayedCall(2000, () => {
        //     coordinates.destroy();
        //     id.destroy();
        // });
        return { coordinates, id };
    }


    public handleBoxHit(blueBox: Phaser.Physics.Matter.Sprite) {
        if (this.sprite !== blueBox || this.isOpen) {
            return;
        }

        events.off('blueBox-hit', this.handleBoxHit, this);

        this.stateMachine.setState('blueBox-open');
        this.isOpen = true;
    }

    public handleBQPowerCollected(x: number, y: number) {
        this.sprite.setVisible(true); // Make the sprite visible when bqPower is collected
    }
   

}
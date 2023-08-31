import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class BoxController {
    private scene: Phaser.Scene;
    private sprite: Phaser.Physics.Matter.Sprite;
    private stateMachine: StateMachine;
    private isOpen: boolean = false;
    private hasSpawnedItems: boolean = false;

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
        this.scene = scene;
        this.sprite = sprite;

        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'farmBox');

    // Adding States -------------------
    this.stateMachine
    .addState('box-idle', {
        onEnter: this.idleOnEnter,
    })
    .addState('box-flashing', {
        onEnter: this.boxFlashOnEnter,
    })
    .addState('box-open', {
        onEnter: this.boxOpenOnEnter,
    })
    .setState('box-flashing');

events.on('box-hit', this.handleBoxHit, this);
}

destroy() {
events.off('box-hit', this.handleBoxHit, this);
}

update(dt: number) {
this.stateMachine.update(dt);
}


     // Box Animations ---------------------------------------------
     private createAnimations() {



        this.sprite.anims.create({
            key: 'box-idle',
            frames: [{
                key: 'farmBox', frame: 'farmBox_Idle.png'
            }]
        });
    
        this.sprite.anims.create({
            key: 'box-flashing',
            frameRate: 2,
            frames: this.sprite.anims.generateFrameNames('farmBox', {
                start: 1,
                end: 2,
                prefix: 'farmBox_Flashing_',
                suffix: '.png'
            }),
            repeat: -1
        });
    
    
        this.sprite.anims.create({
            key: 'box-opens',
            frameRate: 4,
            frames: this.sprite.anims.generateFrameNames('farmBox', {
                start: 1,
                end: 2,
                prefix: 'armBox_open_',
                suffix: '.png'
            }),
        });
    }

    // States Handlers
    private idleOnEnter() {
        this.stateMachine.setState('box-flashing');
    }

    private boxFlashOnEnter() {
        this.sprite.play('box-flashing');
    }

    private boxOpenOnEnter() {
        this.sprite.play('box-open');

        if (!this.hasSpawnedItems) {
            this.spawnItems();
            this.hasSpawnedItems = true;
        }
    }

    private spawnItems() {
        // Spawn mushroom
        const coordinates = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y - 30, 'coordinates', 0);
        // coordinates.setScale(0.5);
        coordinates.setVelocityY(-10);

        // Spawn coin
        const id = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y - 30, 'id', 0);
        // id.setScale(0.5);
        id.setVelocityY(-20);

        // Remove spawned items after a delay
        this.scene.time.delayedCall(2000, () => {
            coordinates.destroy();
            id.destroy();
        });
        return { coordinates, id };
    }


    private handleBoxHit(box: Phaser.Physics.Matter.Sprite) {
        if (this.sprite !== box || this.isOpen) {
            return;
        }

        

        events.off('box-hit', this.handleBoxHit, this);

        this.stateMachine.setState('box-open');
        this.isOpen = true;
    }

   

}
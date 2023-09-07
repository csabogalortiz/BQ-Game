import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class RedBoxController {
    public scene: Phaser.Scene;
    public sprite: Phaser.Physics.Matter.Sprite;
    public stateMachine: StateMachine;
    // private isOpen: boolean = false;
    // private hasSpawnedItems: boolean = false;

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
        this.scene = scene;
        this.sprite = sprite;
        this.sprite.setFrame('redBox.png');
        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'redBox');

    // Adding States -------------------
    this.stateMachine
    .addState('redBox-idle', {
        onEnter: this.idleOnEnter,
    })

    .setState('redBox-idle');

// events.on('box-hit', this.handleBoxHit, this);
}

// destroy() {
// events.off('box-hit', this.handleBoxHit, this);
// }

update(dt: number) {
this.stateMachine.update(dt);
}


     // Box Animations ---------------------------------------------
     private createAnimations() {



        this.sprite.anims.create({
            key: 'redBox-idle',
            frames: [{
                key: 'redBox', frame: 'redBox-45.png'
            }]
        });
    
    }

    // States Handlers
    private idleOnEnter() {
        this.sprite.play('redBox-idle');
    }

    }

   

   
   


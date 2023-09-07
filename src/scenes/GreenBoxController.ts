import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";

export default class GreenBoxController {
    public scene: Phaser.Scene;
    public sprite: Phaser.Physics.Matter.Sprite;
    public stateMachine: StateMachine;
    // private isOpen: boolean = false;
    // private hasSpawnedItems: boolean = false;

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite) {
        this.scene = scene;
        this.sprite = sprite;

       
        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'greenBox');

    // Adding States -------------------
    this.stateMachine
    .addState('greenBox-idle', {
        onEnter: this.idleOnEnter,
    })

    .setState('greenBox-idle');

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
            key: 'greenBox-idle',
            frames: [{
                key: 'greenBox', frame: 'greenBox.png'
            }]
        });
    
    }

    // States Handlers
    private idleOnEnter() {


        this.sprite.play('greenBox-idle');
    }

    }

   

   
   


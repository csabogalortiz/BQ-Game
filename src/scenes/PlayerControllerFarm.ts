import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys
import ObstaclesController from "./ObstaclesController";
import PlayerController from './PlayerController';

export default class PlayerControllerFarm extends PlayerController {

    public scene!: Phaser.Scene
    public sprite!: Phaser.Physics.Matter.Sprite
    public cursors!: CursorKeys
    public stateMachine!: StateMachine
    public obstacles!: ObstaclesController
    public compliance = 10
    public carbon = 99
    public lastTrucks?: Phaser.Physics.Matter.Sprite
    public stompedTrucks: Map<Phaser.Physics.Matter.Sprite, boolean> = new Map();

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obstacles: ObstaclesController) {
    super(scene, sprite, cursors, obstacles);


    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
        const body = data.bodyB as MatterJS.BodyType

        // Colision con una nube
        if (this.obstacles.is('fall-clouds', body)
        ) 
    {
        // primero rebota  y luego vuelve al idle state 
       this.stateMachine.setState('cloud-hit')
      this.stateMachine.setState('idle')
        return
    }

    if (this.obstacles.is('ohnoFarm', body)) {
        this.stateMachine.setState('player-surprise')
        const ohNoFarm = this.scene.add.image(this.sprite.x, this.sprite.y - this.sprite.height / 2, 'ohnoFarm');
        ohNoFarm.setOrigin(0.5, 1);
        ohNoFarm.setScale(0.5);
        ohNoFarm.setDepth(1);
        ohNoFarm.alpha = 0.8;
    
        // Remove the 'ohno' image after a certain duration (e.g., 3 seconds)
        this.scene.time.delayedCall(1300, () => {
            ohNoFarm.destroy();
            this.stateMachine.setState('idle')
            
        });
  
        return
    }

  })
  }}
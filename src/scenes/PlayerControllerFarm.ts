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
    private isSurprised = false;

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obstacles: ObstaclesController) {
    super(scene, sprite, cursors, obstacles);

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
        const body = data.bodyB as MatterJS.BodyType

        // Colision con una nube

    if (this.obstacles.is('ohnoFarm', body)) {
        this.stateMachine.setState('player-surprise')
        const ohNoFarm= this.scene.add.image(this.sprite.x, this.sprite.y - this.sprite.height / 2, 'ohnoFarm');
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

    if (this.obstacles.is('farmSign', body)) {
        const offsetY = -80
        const sign = this.scene.add.image(body.position.x,body.position.y + offsetY,  'farm_signBubble');
        
        sign.setOrigin(0.5, 1);
        sign.setScale(0.4);
        sign.setDepth(1);
        sign.alpha = 0.8;
    
        // Remove the 'sign' image after a certain duration (e.g., 4 seconds)
        this.scene.time.delayedCall(4000, () => {
            sign.destroy();
        });
    }

    

    if (this.obstacles.is('farmBox', body)) {
        const boxSprite = body.gameObject as Phaser.Physics.Matter.Sprite;
        const boxBottom = boxSprite.y + boxSprite.height / 2;
    
        if (this.sprite.y < boxBottom) {
            console.log('box hit!!')
            events.emit('box-hit', boxSprite);
        }
    }
    
    

    // Colison con un truck ojo: trucks hit no se va a usar - dejamos la colision  y la animacion pero no se usa

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
            case 'data':
            {
                events.emit('data-collected')
                sprite.destroy()
                break
            }

            case 'coordinates':
                {
                    sprite.destroy()
                    break
                }

                case 'id':
                    {
                        sprite.destroy()
                        break
                    }
    

            // case 'compliance':
            //     {
            //         const value = sprite.getData('compliancePoints') ?? 10
            //         this.compliance += value
            //         events.emit('compliance-changed', this.compliance)
            //         sprite.destroy()
            //         break
            //     }
        }

        
    })


  }

}
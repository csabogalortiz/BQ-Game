import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "./EventCenter";
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys
import ObstaclesController from "./ObstaclesController";
import PlayerController from './PlayerController';

export default class PlayerControllerCoOp extends PlayerController {

    public scene!: Phaser.Scene
    public sprite!: Phaser.Physics.Matter.Sprite
    public cursors!: CursorKeys
    public stateMachine!: StateMachine
    public obstacles!: ObstaclesController
    public compliance = 10
    public carbon = 99
    
  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obstacles: ObstaclesController) {
    super(scene, sprite, cursors, obstacles);

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
        const body = data.bodyB as MatterJS.BodyType

        if (this.obstacles.is('redSection', body)) {

            this.stateMachine.setState('redSection-hit')
        
      
            return
        }

        if (this.obstacles.is('greenSection', body)) {
            

            this.stateMachine.setState('greenSection-hit')
        
      
            return
        }

        if (this.obstacles.is('platform', body)) {
            

            this.stateMachine.setState('idle')
        
      
            return
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
                        events.emit('coordinates-collected', gameObject); // Emit event to notify UI about collected coordinates
                        this.setCompliance(this.compliance + 11);
                        gameObject.destroy();
                        break;
                    }
                case 'id':
                    {
                        events.emit('id-collected', gameObject); // Emit event to notify UI about collected ID
                        this.setCompliance(this.compliance + 11);
                        gameObject.destroy();
                        break;
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
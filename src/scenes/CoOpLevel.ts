import Phaser from 'phaser';
import PlayerController from './PlayerController';
import PlayerControllerCoOp from './PlayerControllerCoOp';
import ObstaclesController from './ObstaclesController';
import  WebFontFile from './WebFontFile';
import PlayerControllerFarm from './PlayerControllerFarm';
import BoxController from './BoxController';
import FarmUI from './FarmUI';
import CryFarmerController from './CryFarmerController';
import BQPowerController from './BqPower';
import BlueBoxController from './BlueBoxController';
import { sharedInstance as events } from "./EventCenter";
import RedBoxController from './RedBoxController';
import GreenBoxController from './GreenBoxController';
import PlatformsController from './PlatformsController';




export default class CoOpLevel extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController
    private obstacles!: ObstaclesController
    private bqPower: BQPowerController[] = []
    private farmUi!: FarmUI;
    private redBox: RedBoxController [] = []
    private greenBox: GreenBoxController [] = []
    private platform: PlatformsController[] = [];
    private platformSpeed = 1;


    constructor() {
        // Desde donde llamo la escena con un boton- este es el nombre 
        super('coOpLevel');
    }

    init () 
    {
       this.cursors = this.input.keyboard.createCursorKeys()
       this.obstacles = new ObstaclesController()
       this.bqPower = []
       this.redBox = []
       this.greenBox = []
       this.bqPower = []
       this.platform = [];
       this.events.once(Phaser.Scenes.Events.DESTROY, () => {
       this.destroy()

    })
    }

    preload() {
        this.load.atlas('player', 'assets/player_sprite_sheet.png', 'assets/player_sprite_sheet.json');   
        this.load.atlas('redBox', 'assets/redBox.png', 'assets/redBox.json')
        this.load.atlas('greenBox', 'assets/greenBox.png', 'assets/greenBox.json')
        this.load.atlas('bqPower', 'assets/bqPower_sprite_sheet.png', 'assets/bqPower_sprite_sheet.json')
        
        this.load.image('tilesCoOp', 'assets/coOpworld.png');
        this.load.tilemapTiledJSON('tilemapCoOp', 'assets/gameCoOp.json')
        
        this.load.image('data', 'assets/data.png')
        this.load.image('platform', 'assets/platform.png')
        this.load.image('coordinates', 'assets/coordinates.png');
        this.load.image('id', 'assets/id.png');

// Inside your game scene's preload() method
const fonts = new WebFontFile(this.load, "Press Start 2P")
		this.load.addFile(fonts)
    }

    create() {
        this.scene.launch('ui');

        
        const customFontStyle = {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px', // Adjust the font size as needed
            color: '#FFFFFF' // Adjust the font color as needed
        };

        const map = this.make.tilemap({ key: 'tilemapCoOp' });
        const tilesetCoOp = map.addTilesetImage('coOpworld', 'tilesCoOp');
        const groundCoOp = map.createLayer('groundCoOp', tilesetCoOp);


        groundCoOp.setCollisionByProperty({ collides: true });
        map.createLayer('obstacles', tilesetCoOp);
        // map.createLayer('background', tilesetCoOp);
        const objectsLayer = map.getObjectLayer('objects');

        objectsLayer.objects.forEach(objData => {

            const { x = 0, y = 0, name, width = 0, height = 0 } = objData;
            switch (name) {
                case 'player-spawn':
                    {
                       
                        this.player = this.matter.add.sprite(x, y- (height + 0.5), 'player')
                            .setFixedRotation();
                   
                  

                        this.playerController = new PlayerControllerCoOp (
                            this,
                            this.player,
                            this.cursors,
                            this.obstacles
                            )
                            const mapWidth = map.widthInPixels;
                            const mapHeight = map.heightInPixels;
                            
                            // Set the camera bounds to cover the entire map and prevent the player from going beyond the left edge
                            this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
                            
                            // Create a smaller dead zone to control camera follow
                            const deadZoneWidth = this.cameras.main.width * 0.1; // Adjust as needed
                            const deadZoneHeight = this.cameras.main.height * 0.1; // Adjust as needed
                            this.cameras.main.setDeadzone(deadZoneWidth, deadZoneHeight);
                            
                            // Start following the player
                            this.cameras.main.startFollow(this.player);
                            // this.cameras.main.pan(0, -10, 1000, 'Linear'); 
                            // this.cameras.main.scrollY= -10
                            // this.cameras.main.scrollX= 50
                            // this.cameras.main.setZoom(0.9);  

                            // const mapWidth = map.widthInPixels;
                            // const mapHeight = map.heightInPixels;
                            // this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
                            // this.cameras.main.centerToBounds();
                        break

                    }

                    case 'data': {
                        const data = this.matter.add.sprite(x, y, 'data', undefined, {
                            isStatic: true,
                            isSensor: true
    
                        })
                        data.setData('type', 'data')
                        break
                    }


                  

                    

                    case 'bqPower': {
                        const bqPower = this.matter.add.sprite(x + (width - 39), y + (height - 38), 'bqPower', undefined, {
                            isStatic: true,
                            isSensor: true,
                        }).setFixedRotation();
    
                        this.bqPower.push(new BQPowerController(this, bqPower));
                        this.obstacles.add('bqPower', bqPower.body as MatterJS.BodyType);
    
                        break;
                    }



                    case 'greySection':
                        { const greySection=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                            isStatic: true,
                       
                        })
                        this.obstacles.add('greySection', greySection)
                        break
                        }

                    case 'redSection':
                        { const redSection=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                            isStatic: true,
                       
                        })
                        this.obstacles.add('redSection', redSection)
                        break
                        }
                    case 'greenSection':
                        { const greenSection=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                            isStatic: true,
                       
                        })
                        this.obstacles.add('greenSection', greenSection)
                        break
                        }

                        case 'platform': {
                            const platform = new PlatformsController(this, x, y, 'platform', { isStatic: true }, "left");
                            platform.moveHorizontally(); // Apply leftward movement
                            platform.setData('type', 'platform');
                            this.platform.push(platform);
                        
                            // Use the getBody method to add the platform to obstacles
                            this.obstacles.add('platform', platform.getBody());
                        
                            break;
                        }
    

                        case 'redBox': {
                            const redBox = this.matter.add.sprite(x, y, 'redBox') 
                            .setFixedRotation();
    
                            this.redBox.push(new RedBoxController(this, redBox,  this.obstacles))
                            this.obstacles.add('redBox', redBox.body as MatterJS.BodyType)
                            break 
                        }
    
                           

                        case 'greenBox': {
                            const greenBox = this.matter.add.sprite(x, y, 'greenBox') 
                                .setFixedRotation();
                        
                            this.greenBox.push(new GreenBoxController(this, greenBox, this.obstacles)) // Provide 'this.obstacles' as the third argument
                            this.obstacles.add('greenBox', greenBox.body as MatterJS.BodyType)
                            break;
                        }

             
    

                }

    })


    // this.greenBox.forEach((greenBox) => {
    //     greenBox.sprite.setVelocityY(100); // Adjust the falling speed as needed
    //     greenBox.sprite.setY(-50); // Set an initial position above the screen
    // });

    // // Create and spawn red boxes from above
    // this.redBox.forEach((redBox) => {
    //     redBox.sprite.setVelocityY(100); // Adjust the falling speed as needed
    //     redBox.sprite.setY(-50); // Set an initial position above the screen
    // });

    this.cameras.main.startFollow(this.player!, true);
    this.matter.world.convertTilemapLayer(groundCoOp);


    
}     
destroy () {
    this.scene.stop('ui')
    // this.trucks.forEach(trucks => trucks.destroy())
    
}

update(t: number, dt: number) {
    if (this.playerController) {
        this.playerController.update(dt)
    }
    this.bqPower .forEach(bqPower => bqPower.update(dt))
    this.redBox .forEach(redBox => redBox.update(dt))

    this.greenBox .forEach(greenBox => greenBox.update(dt))
    this.platform .forEach(platform => platform.update(dt))

   
}


}
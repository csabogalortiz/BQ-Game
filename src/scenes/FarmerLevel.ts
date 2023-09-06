import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import  WebFontFile from './WebFontFile';
import FarmersController from './FarmersController';
import PlayerControllerFarm from './PlayerControllerFarm';
import BoxController from './BoxController';
import FarmUI from './FarmUI';
import CryFarmerController from './CryFarmerController';
import BQPowerController from './BqPower';
import BlueBoxController from './BlueBoxController';
import { sharedInstance as events } from "./EventCenter";



export default class FarmerLevel extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController
    private obstacles!: ObstaclesController
    private farmers: FarmersController [] = []
    private farmBox: BoxController [] = []
    private blueBox: BlueBoxController [] = []
    private bqPower: BQPowerController[] = []
    private farmUi!: FarmUI;
    private cryFarmer: CryFarmerController [] = []
    // private carbonTest?: CarbonTest;
    
     // CarbonBar properties
    //  private graphics!: Phaser.GameObjects.Graphics;
    //  private lastCarbon: number = 0;
    //  private carbonText?: Phaser.GameObjects.Text;

    constructor() {
        // Desde donde llamo la escena con un boton- este es el nombre 
        super('farmLevel');
    }
    // super('game') calls the constructor of the parent class (Phaser.Scene), passing the string 'game' as an argument.

    init () 
    {
       this.cursors = this.input.keyboard.createCursorKeys()
       this.obstacles = new ObstaclesController()
       this.farmers = []
       this.cryFarmer = []
       this.farmBox = []
       this.blueBox = []
       this.bqPower = []
       this.events.once(Phaser.Scenes.Events.DESTROY, () => {
       this.destroy()

    })
    }

    preload() {
        this.load.atlas('player', 'assets/player_sprite_sheet.png', 'assets/player_sprite_sheet.json');
        this.load.atlas('farmBox', 'assets/farmBox_sprite_sheet.png', 'assets/farmBox_sprite_sheet.json');
        this.load.atlas('farmers', 'assets/happy_farmer_sprite_sheet.png', 'assets/happy_farmer_sprite_sheet.json')
        this.load.atlas('bqPower', 'assets/bqPower_sprite_sheet.png', 'assets/bqPower_sprite_sheet.json')
        this.load.atlas('cryFarmer', 'assets/cry_farmer_sprite_sheet.png', 'assets/cry_farmer_sprite_sheet.json')
        this.load.atlas('blueBox', 'assets/blueBox_sprite_sheet.png', 'assets/blueBox_sprite_sheet.json')

        this.load.image('tilesFarm', 'assets/farmworld.png');
        this.load.tilemapTiledJSON('tilemapFarm', 'assets/gameFarm.json')
        this.load.image('data', 'assets/data.png')
        this.load.image('bqButton', 'assets/bqButton.png')
        this.load.image('farmSign', 'assets/farmSign.png')
        this.load.image('ohnoFarm', 'assets/ohnoFarm.png')
        this.load.image('ohnoDeforest', 'assets/ohnoDeforest.png')
        this.load.image('ohnoWater', 'assets/ohnoWater.png')
        this.load.image('ohnoRadio', 'assets/ohnoRadio.png')
        this.load.image('farm_signBubble', 'assets/info_bubble_farm_1-08.png')
        this.load.image('bqPowerSign', 'assets/farmSign.png')
        this.load.image('info_bubble_bqPower', 'assets/info_bubble_bqPower.png')
        this.load.image('stump', 'assets/stump.png')
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

this.farmUi = new FarmUI(this, customFontStyle);


        const map = this.make.tilemap({ key: 'tilemapFarm' });
        const tilesetFarm = map.addTilesetImage('farmworld', 'tilesFarm');
        const groundFarm = map.createLayer('groundFarm', tilesetFarm);


        groundFarm.setCollisionByProperty({ collides: true });
        map.createLayer('obstacles', tilesetFarm);
        map.createLayer('background', tilesetFarm);
        const objectsLayer = map.getObjectLayer('objects');


        

        objectsLayer.objects.forEach(objData => {

            const { x = 0, y = 0, name, width = 0, height = 0 } = objData;
            switch (name) {
                case 'player-spawn':
                    {
                       
                        this.player = this.matter.add.sprite(x, y- (height + 0.5), 'player')
                            .setFixedRotation();
                   
                  

                        this.playerController = new PlayerControllerFarm (
                            this,
                            this.player,
                            this.cursors,
                            this.obstacles
                            )

                            this.cameras.main.scrollY= 50
                            // this.cameras.main.scrollX= 50
                            // this.cameras.main.setZoom(0.9);  
                        break

                    }
                   
                    case 'farmers': {

                     const farmers = this.matter.add.sprite(x, y, 'farmers') 
                        .setFixedRotation();

                        this.farmers.push(new FarmersController(this, farmers))
                        this.obstacles.add('farmers', farmers.body as MatterJS.BodyType)
                        break 
                    }

                    case 'cryFarmer': {


                        const cryFarmer = this.matter.add.sprite(x, y, 'cryFarmer') 
                        .setFixedRotation();

                        this.cryFarmer.push(new CryFarmerController(this, cryFarmer))
                        this.obstacles.add('cryFarmer', cryFarmer.body as MatterJS.BodyType)
                        break 
                    }
                    //     const cryFarmer = this.matter.add.sprite(x, y, 'farmers') 
                    //        .setFixedRotation();
   
                    //        this.cryFarmer.push(new FarmersController(this, cryFarmer))
                    //        this.obstacles.add('cryFarmer', cryFarmer.body as MatterJS.BodyType)
                    //        break 
                    //    }
              
                case 'data': {
                    const data = this.matter.add.sprite(x, y, 'data', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    data.setData('type', 'data')
                    break
                }


                case 'farmSign': {

                    const farmSign = this.matter.add.sprite(x, y+ (height -50), 'farmSign', undefined, {
                        isStatic: true,
                        isSensor: true
                    }) 
                       .setFixedRotation();

                       this.obstacles.add('farmSign', farmSign.body as MatterJS.BodyType)
                       break 
                   }



                   case 'bqPowerSign': {

                    const bqPowerSign = this.matter.add.sprite(x, y+ (height -50), 'bqPowerSign', undefined, {
                        isStatic: true,
                        isSensor: true
                    }) 
                       .setFixedRotation();

                       this.obstacles.add('bqPowerSign', bqPowerSign.body as MatterJS.BodyType)
                       break 
                   }

                   case 'stump': {

                    const farmSign = this.matter.add.sprite(x, y+ (height -30), 'stump', undefined, {
                        isStatic: true,
                        isSensor: true
                    }) 
                       .setFixedRotation();

                       this.obstacles.add('stump', farmSign.body as MatterJS.BodyType)
                       break 
                   }

                   case 'farmBox': {
                    const farmBox = this.matter.add.sprite(x+ (width -39), y+ (height -38), 'farmBox', undefined, {
                        isStatic: true,
                        isSensor: true
                    })
                    
                    .setFixedRotation();

                    this.farmBox.push(new BoxController(this, farmBox))
                    this.obstacles.add('farmBox', farmBox.body as MatterJS.BodyType)
                    break 

                   }

                   case 'blueBox': {
                    const blueBox = this.matter.add.sprite(x+ (width -39), y+ (height -38), 'blueBox', undefined, {
                        isStatic: true,
                        isSensor: true
                    })
                    
                    .setFixedRotation();

                    this.blueBox.push(new BlueBoxController(this, blueBox))
                    this.obstacles.add('blueBox', blueBox.body as MatterJS.BodyType)
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

                  case 'ohnoFarm' : {
                    const ohnoFarm=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                        isStatic: true,
                   
                    })
                    this.obstacles.add('ohnoFarm', ohnoFarm)
                    break
              
                   }

                   case 'ohnoWater' : {
                    const ohnoWater=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                        isStatic: true,
                   
                    })
                    this.obstacles.add('ohnoWater', ohnoWater)
                    break
              
                   }

                   case 'ohnoDeforest' : {
                    const ohnoDeforest=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                        isStatic: true,
                   
                    })
                    this.obstacles.add('ohnoDeforest', ohnoDeforest)
                    break
              
                   }

                   case 'ohnoRadio' : {
                    const ohnoRadio=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                        isStatic: true,
                   
                    })
                    this.obstacles.add('ohnoRadio', ohnoRadio)
                    break
              
                   }

                   //   }  
                  case 'nonCompliantLand' : {
                    const nonCompliantLand=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                        isStatic: true,
                   
                    })
                    this.obstacles.add('nonCompliantLand', nonCompliantLand)
                    break
              
                   }
   





                   
                }
        });

      
        

        this.cameras.main.startFollow(this.player!, true);
        this.matter.world.convertTilemapLayer(groundFarm);

        

    }



    destroy () {
        this.scene.stop('ui')
        // this.trucks.forEach(trucks => trucks.destroy())
        
    }


    update(t: number, dt: number) {
        if (this.playerController) {
            this.playerController.update(dt)
        }
        this.farmers .forEach(farmers => farmers.update(dt))
        this.cryFarmer .forEach(cryFarmer => cryFarmer.update(dt))
        this.farmBox .forEach(farmBox => farmBox.update(dt))
        this.bqPower .forEach(bqPower => bqPower.update(dt))
        this.blueBox .forEach(blueBox => blueBox.update(dt))
        
    }

}


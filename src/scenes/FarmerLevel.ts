import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import  WebFontFile from './WebFontFile';
import FarmersController from './FarmersController';
// import CarbonBar from './CarbonBar';
// import CarbonTest from './CarbonTest';


export default class FarmerLevel extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController
    private obstacles!: ObstaclesController
    
    private farmers: FarmersController [] = []
    // private carbonBar!: CarbonBar;
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
       this.events.once(Phaser.Scenes.Events.DESTROY, () => {
       this.destroy()

    })
    }

    preload() {
        this.load.atlas('player', 'assets/player_sprite_sheet.png', 'assets/player_sprite_sheet.json');
        this.load.image('tilesFarm', 'assets/farmworld.png');
        this.load.tilemapTiledJSON('tilemapFarm', 'assets/gameFarm.json')

        this.load.atlas('farmers', 'assets/happy_farmer_sprite_sheet.png', 'assets/happy_farmer_sprite_sheet.json')
        this.load.image('data', 'assets/data.png')
        this.load.image('farmSign', 'assets/farmSign.png')
        this.load.image('ohno', 'assets/ohno.png')
        this.load.image('aggregator_signBubble', 'assets/info_bubble_aggregator_1.png')

        
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

        const map = this.make.tilemap({ key: 'tilemapFarm' });
        const tilesetFarm = map.addTilesetImage('farmworld', 'tilesFarm');
        const groundFarm = map.createLayer('groundFarm', tilesetFarm);


        groundFarm.setCollisionByProperty({ collides: true });
        map.createLayer('obstacles', tilesetFarm);
        map.createLayer('background', tilesetFarm);
        const objectsLayer = map.getObjectLayer('objects');

// this.carbonBar = new CarbonBar(this, customFontStyle);

//         const carbonBar = new CarbonBar(this, customFontStyle);
//         // // carbonBar.setPosition(x, y);
//         console.log("CarbonBar instance created:", carbonBar);
        
        

        //  The objects property within this layer is an array that holds various objects placed on the map. 
        // The forEach method is used to iterate over each object within this array and execute a callback function for each object.

        objectsLayer.objects.forEach(objData => {

            const { x = 0, y = 0, name, width = 0, height = 0 } = objData;
            switch (name) {
                case 'player-spawn':
                    {
                       
                        this.player = this.matter.add.sprite(x, y- (height + 0.5), 'player')
                            .setFixedRotation();
                   
                  

                        this.playerController = new PlayerController(
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
              
                case 'data': {
                    const data = this.matter.add.sprite(x, y, 'data', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    data.setData('type', 'data')
                    break
                }


                case 'farmSign': {

                    const farmSign = this.matter.add.sprite(x, y+ (height -40), 'farmSign', undefined, {
                        isStatic: true,
                        isSensor: true
                    }) 
                       .setFixedRotation();

                       this.obstacles.add('farmSign', farmSign.body as MatterJS.BodyType)
                       break 
                   }


                // case 'happyFarmer': {


                //     const happyFarmer = this.matter.add.sprite(x, y, 'happyFarmer', undefined, {
                //         isStatic: true,
                //         isSensor: true
                //     }) 
                //     .setFixedRotation();

                //     this.obstacles.add('happyFarmer', happyFarmer.body as MatterJS.BodyType)
                //     break 
                // }

               

                // case 'fall-clouds' : {
                //   const fallClouds=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                //        isStatic: true,
                //    })
                //    this.obstacles.add('fall-clouds', fallClouds)
                //    break
             
                //   }  
                  case 'ohno' : {
                    const ohno=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                        isStatic: true,
                   
                    })
                    this.obstacles.add('ohno', ohno)
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
        this.farmers .forEach(trucks => trucks.update(dt))
    }

}



// We have commented all logic regarding trucks
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



export default class CoOpLevel extends Phaser.Scene {
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

    constructor() {
        // Desde donde llamo la escena con un boton- este es el nombre 
        super('coOpLevel');
    }

    init () 
    {
       this.cursors = this.input.keyboard.createCursorKeys()
       this.obstacles = new ObstaclesController()
       this.bqPower = []
    //    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
    //    this.destroy()

    // })
    }

    preload() {
        this.load.atlas('player', 'assets/player_sprite_sheet.png', 'assets/player_sprite_sheet.json');   
        this.load.image('tilesCoOp', 'assets/coOpworld.png');
        this.load.tilemapTiledJSON('tilemapCoOp', 'assets/gameCoOp.json')

        
        this.load.image('data', 'assets/data.png')
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
                   
                  

                        this.playerController = new PlayerControllerFarm (
                            this,
                            this.player,
                            this.cursors,
                            this.obstacles
                            )

                            // this.cameras.main.pan(0, -10, 1000, 'Linear'); 
                            // this.cameras.main.scrollY= -10
                            // this.cameras.main.scrollX= 50
                            // this.cameras.main.setZoom(0.9);  

                            const mapWidth = map.widthInPixels;
                            const mapHeight = map.heightInPixels;
                            this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
                            this.cameras.main.centerToBounds(); 
                        break

                    }
                }

    })


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
}


}
import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import TrucksController from './TrucksController';

export default class Game extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Matter.Sprite;
    private trucks: TrucksController [] = []
    private playerController?: PlayerController
    private obstacles!: ObstaclesController

    constructor() {
        // Desde donde llamo la escena con un boton- este es el nombre 
        super('game');
    }
    // super('game') calls the constructor of the parent class (Phaser.Scene), passing the string 'game' as an argument.

    init () 
    {
       this.cursors = this.input.keyboard.createCursorKeys()
       this.obstacles = new ObstaclesController()
       this.trucks = []
       this.events.once(Phaser.Scenes.Events.DESTROY, () => {
       this.destroy()

    })
    }

    preload() {
        this.load.atlas('player', 'assets/penguin.png', 'assets/penguin.json')
        this.load.atlas('trucks', 'assets/truck.png', 'assets/truck.json')
        this.load.image('tiles', 'assets/sheet 8.00.17 AM.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json')
        this.load.image('bean', 'assets/bean.png')
        this.load.image ('bad-bean', 'assets/bad-bean.png')
        this.load.image('compliance', 'assets/compliance.png')
    }

    create() {
// we are running the UI scene in parallel  with this one- this means i have to do this if the Ui is cheanging depending on the scene


        this.scene.launch('ui')
        const map = this.make.tilemap({ key: 'tilemap' });
        const tileset = map.addTilesetImage('bqworld', 'tiles');
        const ground = map.createLayer('ground', tileset);
        ground.setCollisionByProperty({ collides: true });
        map.createLayer('obstacles', tileset);
        map.createLayer('background', tileset);


        const objectsLayer = map.getObjectLayer('objects');

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

                    case 'trucks': {

                     const trucks = this.matter.add.sprite(x, y, 'trucks') 
                        .setFixedRotation();

                        this.trucks.push(new TrucksController(this, trucks))
                        this.obstacles.add('trucks', trucks.body as MatterJS.BodyType)
                        break 
                    }
              
                case 'bean': {
                    const bean = this.matter.add.sprite(x, y, 'bean', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    bean.setData('type', 'bean')
                    break
                }

                case 'compliance': {
                    const compliance = this.matter.add.sprite(x, y, 'compliance', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    compliance.setData('type', 'compliance')
                    compliance.setData('compliancePoints', 10)
                    break
                }


                case 'bad-bean': {
                    const badBean = this.matter.add.sprite(x, y, 'bad-bean', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    badBean.setData('type', 'bad-bean')
                    break
                }

                case 'fall-clouds' : {
                  const fallClouds=  this.matter.add.rectangle(x+ (width*0.5), y +(height*0.5), width, height, {
                       isStatic: true,
                   })
                   this.obstacles.add('fall-clouds', fallClouds)
                   break
             
                  }  }
        });

        this.cameras.main.startFollow(this.player!);
        this.matter.world.convertTilemapLayer(ground);

    }

    destroy () {
        this.trucks.forEach(trucks => trucks.destroy())
    }


    update(t: number, dt: number) {
        if (this.playerController) {
            this.playerController.update(dt)
        }
        this.trucks.forEach(trucks => trucks.update(dt))
    }

}




import Phaser from 'phaser'
import PlayerController from './PlayerController'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private player?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController

    private isTouchingGround= false 

    constructor() {
        super ('game')
    }

    init () 
 {
    this.cursors = this.input.keyboard.createCursorKeys()
 }

 
    preload() {
        this.load.atlas('player', 'assets/penguin.png', 'assets/penguin.json')
        this.load.image('tiles', 'assets/sheet.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json')
        this.load.image('bean', 'assets/bean.png')
    }

   
    create() {

// we are running the UI scene in parallel  with this one- this means i have to do this if the Ui is cheanging depending on the scene
        this.scene.launch('ui')
        const map = this.make.tilemap({key: 'tilemap'})
        const tileset=  map.addTilesetImage('bqworld', 'tiles')
        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({collides: true})
        this.matter.world.convertTilemapLayer(ground)
       
        const objectsLayer = map.getObjectLayer('objects') 
        objectsLayer.objects.forEach(objData => {
            const {x =0 ,y= 0, name, width= 0} = objData
           
           
            switch(name) {
                case 'player-spawn': {
                    this.player = this.matter.add.sprite(x + (width *0.5), y, 'player')
                    .setFixedRotation()
                    this.playerController = new PlayerController(this.player, this.cursors)
                   
                    this.cameras.main.startFollow(this.player)

                    break
                }

                    case 'bean':
                        {
                            const bean=  this.matter.add.sprite(x,y , 'bean', undefined, {
                                // REvisar esto
                                // Revisar object pool
                                isStatic: true,
                                isSensor: true,
                                // doesnt  simulate the collision but you collide
                            })
                            bean.setData('type', 'bean') // to get the type of the object
                            break

                        }
                  
            }

        })

        this.cameras.main.scrollY= 50
        // this.cameras.main.scrollX= 50
        // this.cameras.main.setZoom(0.9);   
    }

    update (t: number, dt: number) {
        
        if(this.playerController) {
            this.playerController.update(dt)
                }
}}
import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';

export default class Game extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Matter.Sprite;

    private playerController?: PlayerController
    private obstacles!: ObstaclesController

    constructor() {
        super('game');
    }
    // super('game') calls the constructor of the parent class (Phaser.Scene), passing the string 'game' as an argument.

    init () 
    {
       this.cursors = this.input.keyboard.createCursorKeys()
       this.obstacles = new ObstaclesController()
    }

    preload() {
        this.load.atlas('player', 'assets/penguin.png', 'assets/penguin.json')
        this.load.image('tiles', 'assets/sheet 8.00.17 AM.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json')
        this.load.image('bean', 'assets/bean.png')
        this.load.image ('bad-bean', 'assets/bad-bean.png')
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
                        this.player = this.matter.add.sprite(x + (width + 0.5), y, 'player')
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
              
                case 'bean': {
                    const bean = this.matter.add.sprite(x, y, 'bean', undefined, {
                        isStatic: true,
                        isSensor: true

                    })
                    bean.setData('type', 'bean')
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


    update(t: number, dt: number) {
        if (this.playerController) {
            this.playerController.update(dt)
        }
    }



    // {
    //     if (!this.penguin) {
    //         return
    //     }
    // }
    // const speed = 10;
    // if (this.cursors.left.isDown) {
    //     this.penguin!.flipX = true;
    //     this.penguin!.setVelocityX(-speed);
    //     this.penguin!.play('player-walk', true);
    // } else if (this.cursors.right.isDown) {
    //     this.penguin!.flipX = false;
    //     this.penguin!.setVelocityX(speed);
    //     this.penguin!.play('player-walk', true);
    // } else {
    //     this.penguin!.setVelocityX(0);
    //     this.penguin!.play('player-idle', true);
    // }

    // const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    // if (spaceJustPressed && this.isTouchingGround) {
    //     this.penguin!.setVelocityY(-12);
    //     this.isTouchingGround = false;
    // }
}

// private createAnimations() {
//     this.sprite.anims.create({
//         key: 'player-idle',
//         frames: [{ key: 'penguin', frame: 'penguin_walk01.png' }]
//     });

//     this.sprite.anims.create({
//         key: 'player-walk',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('penguin', {
//             start: 1,
//             end: 4,
//             prefix: 'penguin_walk0',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });
// }








// update() {
//     const speed = 10;
//     const isMouseClickDown = this.input.activePointer.isDown;

//     // The variable isMouseClickDown is assigned the value of true
//     // if the mouse click is currently being held down, and false otherwise.
//     // It uses this.input.activePointer.isDown to check the state of the mouse click.

//     if (isMouseClickDown) {
//         const mouseX = this.input.activePointer.worldX;
//         const penguinX = this.penguin.x;
//         // If the mouse click is held down (isMouseClickDown is true), we proceed inside this condition.
//         // We store the current x - coordinate of the mouse pointer in the mouseX variable using this.input.activePointer.worldX.
//         // The penguinX variable is assigned the current x - coordinate of the penguin sprite(this.penguin.x).

//         if (mouseX < penguinX) {
//             this.penguin.setVelocityX(-speed);
//             this.penguin.play('player-walk', true);
//         } else if (mouseX > penguinX) {
//             this.penguin.setVelocityX(speed);
//             this.penguin.play('player-walk', true);
//         }
//     } else {
//         this.penguin.setVelocityX(0);
//         this.penguin.play('player-idle', true);
//     }
// }







// // ************
// This is a TypeScript file that defines the Game class. It extends the Phaser.Scene class, making it a Phaser scene.It contains the implementation of various methods, such as init, preload, create, and update, as well as additional class properties and methods.

// The Game class is then exported as the default export of the file, making it available for import in other files.


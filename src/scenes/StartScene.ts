import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import TrucksController from './TrucksController';

export default class StartScene extends Phaser.Scene {

    constructor () {
        super ('start-scene')
    }
    
    preload() {
        this.load.image('button', '/assets/button.png');
        this.load.image('background', '/assets/background2.png');
    }

    create () {

        
        // this.cameras.main.setBackgroundColor('#FFB46F'); // Change to your desired color
        const {width, height} = this.scale 
        
            // Create the background image sprite
            const backgroundImage = this.add.sprite(width * 0.5, height * 0.5, 'background');
        
            // Set the size of the background image to cover the entire camera viewport
            backgroundImage.displayWidth = width;
            backgroundImage.displayHeight = height;
        
            // Send the background image to the back layer
            backgroundImage.setDepth(-1);
    //     this.add.text(width * 0.5, height * 0.3, 'Ready? Press Start', {  
    //         font: '900 54px Press Start 2P', 
    //         color: '#FFFFFF'  // Dark blue color
    // })

    // .setOrigin (0.5)

    const button = this.add.image(width * 0.5, height * 0.50, 'button')
        .setInteractive({ useHandCursor: true }) // Enable the hand cursor on hover
        .on('pointerup', () => {
            // this.scene.start('farmLevel');
            // this.scene.start('game');
            this.scene.start('coOpLevel');
        });

//     // Boton!
//     const button = this.add.rectangle(width * 0.5, height * 0.55, 150, 75, 0x8AFFC1)
// // Vamos a poner el boton como algo interactivo 
// .setInteractive()
// .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
//     this.scene.start('game')
//     })

//     this.add.text(button.x, button.y, 'Start!', {
//         fontSize: '52px',

// color: 'FEB36F'

// } )
// .setOrigin (0.5)
// }
 }
}
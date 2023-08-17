import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import TrucksController from './TrucksController';

export default class LevelComplete extends Phaser.Scene {

    constructor () {
        super ('level-complete')
    }
    
    preload() {
        this.load.image('background', '/assets/background_Try.jpg');
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
        this.add.text(width * 0.5, height * 0.3, 'Level Complete', {  
            font: '900 54px Arial', 
        color: '#FFFFF'  // Dark blue color
    })

    .setOrigin (0.5)

    // Boton!
    const button = this.add.rectangle(width * 0.5, height * 0.55, 150, 75, 0x8AFFC1)
// Vamos a poner el boton como algo interactivo 
.setInteractive()
.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
    this.scene.start('game')
    })

    this.add.text(button.x, button.y, 'Next Phase', {
        fontSize: '52px',
color: 'FEB36F'

} )
.setOrigin (0.5)
}
 }
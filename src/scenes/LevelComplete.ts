import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import TrucksController from './TrucksController';

export default class LevelComplete extends Phaser.Scene {

    constructor () {
        super ('level-complete')
    }

    create () {
        const {width, height} = this.scale 
        this.add.text(width * 0.5, height * 0.3, 'Level Complete', {  
            font: '900 54px Arial', 
        color: '#00264d'  // Dark blue color
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
}
 }
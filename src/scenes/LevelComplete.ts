import Phaser from 'phaser';
import PlayerController from './PlayerController';
import ObstaclesController from './ObstaclesController';
import TrucksController from './TrucksController';

export default class LevelComplete extends Phaser.Scene {

    constructor() {
        super('level-complete');
    }

    preload() {
        this.load.image('phase_complete', '/assets/phase_complete.png');
        this.load.image('phaase_button', '/assets/phase_button.png'); 
        this.load.atlas('player', '/assets/player-atlas.png', '/assets/player-atlas.json');
    }

    create() {
        const { width, height } = this.scale;

        // Create the background image sprite
        const backgroundImage = this.add.sprite(width * 0.5, height * 0.5, 'phase_complete');

        // Set the size of the background image to cover the entire camera viewport
        backgroundImage.displayWidth = width;
        backgroundImage.displayHeight = height;

        // Send the background image to the back layer
        backgroundImage.setDepth(-1);

        // Create the animation
        this.anims.create({
            key: 'player-celebrate1',
            frameRate: 4,
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 4,
                prefix: 'Player-Celebrate',
                suffix: '.svg'
            }),
            repeat: -1
            
        });

        // Play the animation on a sprite
        const playerSprite = this.add.sprite(width * 0.5, height * 0.75, 'player');
        playerSprite.anims.play('player-celebrate1');
        playerSprite.setScale(1.7);

        // Boton!


        const phaseButton = this.add.sprite(width * 0.55, height * 0.50, 'phaase_button')
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.scene.start('game');
            }); 

        // const button = this.add.rectangle(width * 0.5, height * 0.40, 150, 75, 0x8AFFC1)
        //     .setInteractive()
        //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        //         this.scene.start('game');
        //     });

        // this.add.text(button.x, button.y, 'Next Phase', {
        //     fontSize: '52px',
        //     color: 'FEB36F'
        // }).setOrigin(0.5);
    }
}

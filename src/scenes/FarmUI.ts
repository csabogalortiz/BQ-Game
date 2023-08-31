import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter"; // Make sure to import your event center

export default class FarmUI {


    private graphics: Phaser.GameObjects.Graphics;
    private coordinatesCollected: number = 0;
    private idCollected: number = 0;
    private scene: Phaser.Scene;
    private coordinatesLabel?: Phaser.GameObjects.Text;
    private idLabel?: Phaser.GameObjects.Text;
    

    public show() {
        this.graphics.visible = true;
        this.coordinatesLabel?.setVisible(true);

    }
    public hide() {
        this.graphics.visible = false;
        this.coordinatesLabel?.setVisible(false);
    }


    constructor(scene: Phaser.Scene, fontStyles) {

        this.scene = scene;

        this.graphics = scene.add.graphics();

        this.coordinatesLabel = scene.add.text(730, 40, "Coordinates", fontStyles);
        this.idLabel = scene.add.text(730, 80, "IDs", fontStyles);

        
        // Set up the carbon-changed event listener
        events.on('coordinates-changed', this.handleCoordinatesChanged, this);
        // events.on('id-changed', this.handleIdChanged, this);

        this.graphics.setScrollFactor(0, 0);
        this.coordinatesLabel.setScrollFactor(0, 0);
        this.idLabel.setScrollFactor(0, 0);
        // Draw the initial carbon bar
        this.setCoordinates(99);
        
        
    }

    private setCoordinates(value: number) {
        const width = 200;
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

        // Clear previous graphics and redraw
        // this.graphics.clear();
        this.graphics.fillStyle(0x3E5DBF);
        this.graphics.fillRoundedRect(10, 150, 200, 30, 5);
        if (percent > 0) {
            let fillColor = 0x99D128; // Default: Green
        
            if (percent > 0.8) {
                fillColor = 0xFF0000; // Red for percentage > 80%
            } else if (percent >= 0.6) {
                fillColor = 0xFFBB00; // Yellow for percentage between 60% and 80%
            }
    
            this.graphics.fillStyle(fillColor);
            this.graphics.fillRoundedRect(10, 150, width * percent, 30, 5);
        }
    
        
    }

    private handleCoordinatesChanged(value: number) {
        const tweens = this.scene.tweens;

        tweens.addCounter({
            from: this.coordinatesCollected,
            to: value,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const updatedValue = tween.getValue();
                this.setCoordinates(updatedValue);
            },
            onComplete: () => {
                this.coordinatesCollected = value;
            }
        });
    }

}


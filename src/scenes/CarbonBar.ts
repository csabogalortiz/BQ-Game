

import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter"; // Make sure to import your event center

export default class CarbonBar {

    public show() {
        this.graphics.visible = true;
        this.carbonText?.setVisible(true);
    }

    public hide() {
        this.graphics.visible = false;
        this.carbonText?.setVisible(false);
    }


    private graphics: Phaser.GameObjects.Graphics;
    private lastCarbon: number = 0;
    private scene: Phaser.Scene;
    private carbonText?: Phaser.GameObjects.Text;
    // public setPosition(x: number, y: number) {
    //     // this.graphics.setPosition(x, y);
    //     // this.carbonText?.setPosition(x, y - 30); // Adjust the offset as needed
    // }

    constructor(scene: Phaser.Scene) {

        
        this.scene = scene;

        // Initialize the graphics and text objects
        this.carbonText = scene.add.text(150, 800, "Carbon Emissions", {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#D60000'
        });
        this.graphics = scene.add.graphics();

        // Set up the carbon-changed event listener
        events.on('carbon-changed', this.handleCarbonChanged, this);
        

        this.graphics.setScrollFactor(0, 0);
        this.carbonText.setScrollFactor(0, 0);
        // Draw the initial carbon bar
        this.setCarbonBar(0);

        
    }

    private setCarbonBar(value: number) {
        const width = 200;
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

        // Clear previous graphics and redraw
        // this.graphics.clear();
        this.graphics.fillStyle(0x3E5DBF);
        this.graphics.fillRoundedRect(150, 400, 180, 20, 5);

        if (percent > 0) {
            this.graphics.fillStyle(0x99D128);
            this.graphics.fillRoundedRect(10, 40, width * percent, 20, 5);
        }
    }

    private handleCarbonChanged(value: number) {
        const tweens = this.scene.tweens;

        tweens.addCounter({
            from: this.lastCarbon,
            to: value,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const updatedValue = tween.getValue();
                this.setCarbonBar(updatedValue);
            },
            onComplete: () => {
                this.lastCarbon = value;
            }
        });
    }

    // Add any other methods related to Carbon Bar functionality here
}

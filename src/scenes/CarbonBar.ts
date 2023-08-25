import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter"; // Make sure to import your event center

export default class CarbonBar {
    private graphics: Phaser.GameObjects.Graphics;
    private lastCarbon: number = 0;

    constructor(scene: Phaser.Scene) {
        this.graphics = scene.add.graphics();
        events.on('carbon-changed', this.handleCarbonChanged, this);
    }

    setCarbonBar(value: number) {
        // Similar logic to setComplianceBar, with necessary modifications for carbon
    }

    private handleCarbonChanged(value: number) {
        
        this.tweens.addCounter({
            from: this.lastCarbon,
            to: value,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const updatedValue = tween.getValue();
                this.setCarbonBar(updatedValue);
            }
        });
        this.setCarbonBar(value);
        this.lastCarbon = value;
    }

    // Other methods related to Carbon Bar functionality

    destroy() {
        events.off('carbon-changed', this.handleCarbonChanged, this);
        // Other cleanup if needed
    }
}

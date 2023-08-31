import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export default class FarmUI {
    private scene: Phaser.Scene;
    private coordinatesLabel?: Phaser.GameObjects.Text;
    private idLabel?: Phaser.GameObjects.Text;
    private collectedImages: Phaser.GameObjects.Image[] = [];

    constructor(scene: Phaser.Scene, fontStyles) {
        this.scene = scene;

        this.coordinatesLabel = scene.add.text(730, 40, "Coordinates", fontStyles);
        this.idLabel = scene.add.text(730, 80, "IDs", fontStyles);

        this.coordinatesLabel.setScrollFactor(0, 0);
        this.idLabel.setScrollFactor(0, 0);

        events.on('coordinates-collected', this.handleCoordinatesCollected, this);
        events.on('id-collected', this.handleIdCollected, this);
    }

    private handleCoordinatesCollected() {
        this.createCollectedImage('coordinates');
    }

    private handleIdCollected() {
        this.createCollectedImage('id');
    }

    private createCollectedImage(imageKey: string) {
        const x = 730; // X position for both coordinates and IDs
        let y = 120 + this.collectedImages.length * 30; // Y position based on the number of collected images

        const collectedImage = this.scene.add.image(x, y, imageKey);
        collectedImage.setScale(0.5);
        collectedImage.setVisible(true);
        collectedImage.setScrollFactor(0, 0);

        this.collectedImages.push(collectedImage);
    }
}






import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export default class FarmUI {
  private scene: Phaser.Scene;
  private coordinatesLabel?: Phaser.GameObjects.Text;
  private idLabel?: Phaser.GameObjects.Text;
  private collectedCoordinatesImages: Phaser.GameObjects.Image[] = [];
  private collectedIdImages: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene, fontStyles) {
    this.scene = scene;

    this.coordinatesLabel = scene.add.text(730, 40, "Coordinates", fontStyles);
    this.idLabel = scene.add.text(730, 120, "Farmer Ids", fontStyles);

    this.coordinatesLabel.setScrollFactor(0, 0);
    this.idLabel.setScrollFactor(0, 0);

    events.on("coordinates-collected", this.handleCoordinatesCollected, this);
    events.on("id-collected", this.handleIdCollected, this);

    //     const bqButton = this.scene.add.sprite(45, 180, 'bqButton')
    //     .setInteractive()
    //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
    //         // Handle button click here, for example:
    //         console.log("BQ Button clicked!");
    //     });
    // bqButton.setScrollFactor(0, 0);
  }

  private handleCoordinatesCollected() {
    this.createCollectedImage("coordinates");
  }

  private handleIdCollected() {
    this.createCollectedImage("id");
  }
  private createCollectedImage(imageKey: string) {
    let x = 730; // X position for both coordinates and IDs
    let y = 0; // Y position is initialized

    const label =
      imageKey === "coordinates" ? this.coordinatesLabel : this.idLabel;

    if (label) {
      if (imageKey === "coordinates") {
        x += this.collectedCoordinatesImages.length * 80; // Adjust spacing as needed
      } else {
        x += this.collectedIdImages.length * 80; // Adjust spacing as needed
      }

      const collectedImage = this.scene.add.image(
        x,
        label.y + label.displayHeight + 30,
        imageKey
      );
      collectedImage.setScale(0.9); // Adjust the scale as needed
      collectedImage.setVisible(true);
      collectedImage.setScrollFactor(0, 0);

      if (imageKey === "coordinates") {
        this.collectedCoordinatesImages.push(collectedImage);
      } else {
        this.collectedIdImages.push(collectedImage);
      }
    }
  }
}

import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export default class UI extends Phaser.Scene {
private beansLabel!: Phaser.GameObjects.Text 
private beansCollected = 0

    constructor () {
        super({
            key: 'ui'
        })
    }

    // Everytime it starts it starts at 0
    init (){
        this.beansCollected = 0
    }

    create (){
        this.beansLabel = this.add.text(10, 10, 'Compliance: 0', {
            font: '900 24px Arial',

            color: '#00264d'  // Dark blue color
        });
        events.on('bean-collected', this.handleBeanCollected, this)

        // hay que revisar esto
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            events.off('bean-collected', this.handleBeanCollected, this)

        })
    }

    private handleBeanCollected(){

this.beansCollected += 1
this.beansLabel.text = `Compliance: ${this.beansCollected}`

}
}
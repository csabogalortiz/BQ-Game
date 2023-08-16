import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export default class UI extends Phaser.Scene {
private beansLabel!: Phaser.GameObjects.Text 
private beansCollected = 0
private graphics!: Phaser.GameObjects.Graphics
private lastCompliance=100

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

        this.graphics = this.add.graphics()
        this.setComplianceBar(100)
       

        this.beansLabel = this.add.text(250, 20, 'Data: 0', {
            font: '900 24px Arial',

            color: '#00264d'  // Dark blue color
        });
        events.on('bean-collected', this.handleBeanCollected, this)
        events.on('compliance-changed', this.handleComplianceChanged, this)

        // hay que revisar esto
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            events.off('bean-collected', this.handleBeanCollected, this)

        })
    }

    private setComplianceBar (value: number) {
        const width = 200 
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100
        this.graphics.clear()

       this.graphics.fillStyle(0xABABAB)
       this.graphics.fillRoundedRect(10, 10, 200, 50, 5)
        if (percent > 0) {
            this.graphics.fillStyle(0x345EC7)
            this.graphics.fillRoundedRect(10, 10, width *percent, 50, 5)
                }


    }

    private handleBeanCollected(){

this.beansCollected += 1
this.beansLabel.text = `Data: ${this.beansCollected}`
}

handleComplianceChanged (value: number) {
    this.tweens.addCounter ({
from:this.lastCompliance ,
to: value
    })
    this.setComplianceBar(value)
    this.lastCompliance = value
}
}
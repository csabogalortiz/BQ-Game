import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";
import  WebFontFile from './WebFontFile';

export default class UI extends Phaser.Scene {
private beansLabel!: Phaser.GameObjects.Text 
private complianceLabel!: Phaser.GameObjects.Text 
private beansCollected = 0
private graphics!: Phaser.GameObjects.Graphics
private lastCompliance=100
private timerText!: Phaser.GameObjects.Text;
private countdownTimer: number = 60;
private coinsImage!: Phaser.GameObjects.Image;

    constructor () {
        super({
            key: 'ui'
        })
    }

    // Everytime it starts it starts at 0
    init (){
        this.beansCollected = 0
    }


    preload()
	{
		const fonts = new WebFontFile(this.load, "Press Start 2P")
		this.load.addFile(fonts)
        this.load.image('coinsImage', '/assets/compliance.png');
	}


    create (){



        this.timerText = this.add.text(500, 20, 'Time: ' + this.countdownTimer, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF' 
        });


        const webFontFile = new WebFontFile(this.load, "Press Start 2P");
        this.load.addFile(webFontFile);

        // Set the font for the text
        // const fontConfig = {
        //     fontFamily: '"Press Start 2P"',
        //     fontSize: '24px',
        //     color: '#FFFFFF' // Dark blue color
        // };

        this.graphics = this.add.graphics()
        this.setComplianceBar(10)
       
        this.coinsImage = this.add.image(300, 35, 'coinsImage');

        // Add the text next to the image
        this.beansLabel = this.add.text(340, 20, 'x 0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF'
        });
        this.complianceLabel = this.add.text(10, 20, 'Compliance:', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF' // Dark blue color
        });

        events.on('bean-collected', this.handleBeanCollected, this)
        events.on('compliance-changed', this.handleComplianceChanged, this)

        // hay que revisar esto
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('bean-collected', this.handleBeanCollected, this)

        })
    }

    private setComplianceBar (value: number) {
        const width = 200 
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100
        const borderRadius = 5;
        this.graphics.clear()

       this.graphics.fillStyle(0xFFFFFF)
       this.graphics.fillRoundedRect(10, 60, 200, 30, 5)
        if (percent > 0) {
            this.graphics.fillStyle(0x99D128)
            this.graphics.fillRoundedRect(10, 60, width *percent, 30, 5)
                }


    }

    private handleBeanCollected(){

this.beansCollected += 1
this.beansLabel.text = `Data: ${this.beansCollected}`
}

handleComplianceChanged (value: number) {
    this.tweens.addCounter ({
from:this.lastCompliance ,
to: value,
duration: 200,
ease: Phaser.Math.Easing.Sine.InOut,
onUpdate: tween => {
    const value = tween.getValue()
    this.setComplianceBar(value)


}
    })
    this.setComplianceBar(value)
    this.lastCompliance = value
}

update(t: number, dt: number) {
    // Update countdown timer
    this.countdownTimer -= dt / 1000; // Convert milliseconds to seconds
    this.timerText.text = 'Time: ' + Math.max(0, Math.ceil(this.countdownTimer));
}
}


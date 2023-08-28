import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";
import  WebFontFile from './WebFontFile';
import CarbonBar from "./CarbonBar";

export default class UI extends Phaser.Scene {
private dataLabel!: Phaser.GameObjects.Text 
private complianceLabel!: Phaser.GameObjects.Text 
private dataCollected = 0
private graphics!: Phaser.GameObjects.Graphics
private lastCompliance=100
private timerText!: Phaser.GameObjects.Text;
private countdownTimer: number = 60;
private dataImage!: Phaser.GameObjects.Image;



    constructor () {
        super({
            key: 'ui'
        })
    }

    // Everytime it starts it starts at 0
    init (){
        this.dataCollected = 0
    }


    preload()
	{
		const fonts = new WebFontFile(this.load, "Press Start 2P")
		this.load.addFile(fonts)
        this.load.image('dataImage', '/assets/data.png');
	}


    create (){


        // Timer
        this.timerText = this.add.text(500, 45, 'Time: ' + this.countdownTimer, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF' 
        });

        // Load the font

        const webFontFile = new WebFontFile(this.load, "Press Start 2P");
        this.load.addFile(webFontFile);

// Graphics

        this.graphics = this.add.graphics()
        this.setComplianceBar(10)
       
        this.dataImage = this.add.image(300, 55, 'dataImage');

        // Add the text next to the image
        this.dataLabel = this.add.text(340, 45, 'Data:0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF'
        });
        this.complianceLabel = this.add.text(10, 20, 'Compliance:', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#FFFFFF' // Dark blue color
        });

        events.on('data-collected', this.handleDataCollected, this)
        events.on('compliance-changed', this.handleComplianceChanged, this)

        // hay que revisar esto
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('data-collected', this.handleDataCollected, this)

        })
    }

    private setComplianceBar (value: number) {
        const width = 200 
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100
        const borderRadius = 5;
        this.graphics.clear()

       this.graphics.fillStyle(0x3E5DBF)
       this.graphics.fillRoundedRect(10, 60, 200, 30, 5)
        if (percent > 0) {
            this.graphics.fillStyle(0x99D128)
            this.graphics.fillRoundedRect(10, 60, width *percent, 30, 5)
                }


    }

    private handleDataCollected(){

this.dataCollected += 1
this.dataLabel.text =`Data:${this.dataCollected}`
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


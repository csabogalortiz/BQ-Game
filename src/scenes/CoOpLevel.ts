import Phaser from "phaser";
import PlayerController from "./PlayerController";
import PlayerControllerCoOp from "./PlayerControllerCoOp";
import ObstaclesController from "./ObstaclesController";
import WebFontFile from "./WebFontFile";
import { sharedInstance as events } from "./EventCenter";
import RedBoxController from "./RedBoxController";
import PlatformsController from "./PlatformsController";
import PowerCoOp from "./PowerCoOp";
import BrownBoxController from "./BrownBox";
import GreenBoxController2 from "./GreenBoxController2";

export default class CoOpLevel extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private player?: Phaser.Physics.Matter.Sprite;
  private playerController?: PlayerControllerCoOp;

  private greenBoxes: GreenBoxController2[] = [];

  private redBoxes: RedBoxController[] = [];

  private obstacles!: ObstaclesController;

  private powerCoOp: PowerCoOp[] = [];

  private brownBox: BrownBoxController[] = [];

  private platform: PlatformsController[] = [];

  private platformSpeed = 1;

  private platformGroup!: Phaser.GameObjects.Group;
  private brownBoxGroup!: Phaser.GameObjects.Group;
  private brownBoxToRightGroup!: Phaser.GameObjects.Group;
  private brownBoxToLeftGroup!: Phaser.GameObjects.Group;
  private isPowerCoOpCollected = false;
  private greenBoxGroup!: Phaser.GameObjects.Group;
  private redBoxGroup!: Phaser.GameObjects.Group;
  public config: any;
  private frame = 0;

  private greenBoxCounter = 0;
  private redBoxCounter = 0;

  constructor() {
    super("coOpLevel");
    this.config = this.config;
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.obstacles = new ObstaclesController();
    this.powerCoOp = [];
    this.brownBox = [];
    this.powerCoOp = [];
    this.platform = [];
    this.platformGroup = this.add.group();
    this.brownBoxGroup = this.add.group();
    this.brownBoxToRightGroup = this.add.group();
    this.brownBoxToLeftGroup = this.add.group();

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.destroy();
    });
  }

  preload() {
    this.load.atlas(
      "player",
      "./assets/player_sprite_sheet.png",
      "./assets/player_sprite_sheet.json"
    );
    this.load.atlas("redBoxes", "./assets/redBox.png", "./assets/redBox.json");
    this.load.atlas(
      "greenBoxes",
      "./assets/greenBox.png",
      "./assets/greenBox.json"
    );
    this.load.atlas(
      "brownBox",
      "./assets/brownBox.png",
      "./assets/brownBox.json"
    );
    this.load.atlas(
      "powerCoOp",
      "./assets/bqPower_sprite_sheet.png",
      "./assets/bqPower_sprite_sheet.json"
    );

    this.load.image("tilesCoOp", "./assets/coOpworld.png");
    this.load.tilemapTiledJSON("tilemapCoOp", "./assets/gameCoOp.json");

    this.load.image("data", "./assets/data.png");
    this.load.image("platform", "./assets/platform.png");
    this.load.image("coordinates", "./assets/coordinates.png");
    this.load.image("id", "./assets/id.png");

    // Inside your game scene's preload() method
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }

  private createBrownBox() {
    const brownBoxToRight = new BrownBoxController(
      this,
      730,
      40,
      "brownBox",
      { isStatic: false },
      "right"
    );
    brownBoxToRight.moveHorizontally();
    brownBoxToRight.setData("type", "brownBox");
    this.brownBoxGroup.add(brownBoxToRight); // Add the brownBox to the group
    this.obstacles.add(
      "brownBox",
      brownBoxToRight.getBody() as MatterJS.BodyType
    );
  }

  private createBrownBoxLeft() {
    const brownBoxToLeft = new BrownBoxController(
      this,
      1930,
      40,
      "brownBox",
      { isStatic: false },
      "left"
    );
    // brownBoxToLeft.body.mass = 100;
    brownBoxToLeft.moveHorizontallyLeft();
    brownBoxToLeft.setData("type", "brownBox");

    this.brownBoxGroup.add(brownBoxToLeft);
    this.obstacles.add(
      "brownBox",
      brownBoxToLeft.getBody() as MatterJS.BodyType
    );
  }
  private createGreenBox() {
    const randomX = Phaser.Math.RND.pick([900, 1300]); // Randomly choose between 759 and 1400
    const greenBox = this.matter.add
      .sprite(randomX, 10, "greenBoxes")
      .setFixedRotation();

    const moveDirection = randomX > 1550 ? "left" : "right";

    this.greenBoxes.push(
      new GreenBoxController2(
        this,
        greenBox,
        this.obstacles,
        moveDirection,
        this.game.config
      )
    );
    this.obstacles.add("greenBoxes", greenBox.body as MatterJS.BodyType);
  }

  private createRedBox() {
    const randomX = Phaser.Math.RND.pick([1550, 1800]); // Randomly choose between 759 and 1400
    const redBox = this.matter.add
      .sprite(randomX, 10, "redBoxes")
      .setFixedRotation();

    const moveDirection = randomX > 1550 ? "left" : "right";

    this.redBoxes.push(
      new RedBoxController(
        this,
        redBox,
        this.obstacles,
        moveDirection,
        this.game.config
      )
    );

    this.obstacles.add("redBoxes", redBox.body as MatterJS.BodyType);
  }

  create() {
    this.scene.launch("ui");
    this.platformGroup = this.add.group();
    this.brownBoxGroup = this.add.group();
    this.greenBoxGroup = this.add.group();
    this.redBoxGroup = this.add.group();

    events.on("powerCoOp-collected", () => {
      this.isPowerCoOpCollected = true;
      console.log("PowerCoOp collected");
      // Loop through the platformGroup and hide or destroy each platform
      const platforms =
        this.platformGroup.getChildren() as PlatformsController[];
      platforms.forEach((platform: PlatformsController) => {
        platform.handleBQPowerCollected();
      });

      const brownBoxes =
        this.brownBoxGroup.getChildren() as BrownBoxController[];
      brownBoxes.forEach((brownBox: BrownBoxController) => {
        brownBox.handleBQPowerCollected();
      });

      console.log("Is PowerCoOp collected?", this.isPowerCoOpCollected);
    });

    const customFontStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: "18px", // Adjust the font size as needed
      color: "#FFFFFF", // Adjust the font color as needed
    };

    const map = this.make.tilemap({ key: "tilemapCoOp" });
    const tilesetCoOp = map.addTilesetImage("coOpworld", "tilesCoOp");
    const groundCoOp = map.createLayer("groundCoOp", tilesetCoOp);

    groundCoOp.setCollisionByProperty({ collides: true });
    map.createLayer("obstacles", tilesetCoOp);

    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData;
      switch (name) {
        case "player-spawn": {
          this.player = this.matter.add
            .sprite(x, y - (height + 0.5), "player")
            .setFixedRotation();

          this.playerController = new PlayerControllerCoOp(
            this,
            this.player,
            this.cursors,
            this.obstacles,
            this.game.config
          );
          const mapWidth = map.widthInPixels;
          const mapHeight = map.heightInPixels;

          // Set the camera bounds to cover the entire map and prevent the player from going beyond the left edge
          this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
          this.cameras.main.setZoom(0.75);

          // Create a smaller dead zone to control camera follow
          const deadZoneWidth = this.cameras.main.width * 0.1; // Adjust as needed
          const deadZoneHeight = this.cameras.main.height * 0.1; // Adjust as needed
          this.cameras.main.setDeadzone(deadZoneWidth, deadZoneHeight);
          this.cameras.main.startFollow(this.player);

          break;
        }

        case "data": {
          const data = this.matter.add.sprite(x, y, "data", undefined, {
            isStatic: true,
            isSensor: true,
          });
          data.setData("type", "data");
          break;
        }

        case "powerCoOp": {
          const powerCoOp = this.matter.add
            .sprite(
              x + (width - 39),
              y + (height - 38),
              "powerCoOp",
              undefined,
              {
                isStatic: true,
                isSensor: true,
              }
            )
            .setFixedRotation();

          this.powerCoOp.push(new PowerCoOp(this, powerCoOp));
          this.obstacles.add("powerCoOp", powerCoOp.body as MatterJS.BodyType);

          break;
        }

        case "spikes": {
          const spikes = this.matter.add.rectangle(
            x + width * 0.5,
            y + height * 0.5,
            width,
            height,
            {
              isStatic: true,
            }
          );
          this.obstacles.add("spikes", spikes);
          break;
        }

        case "winn": {
          const winn = this.matter.add.rectangle(
            x + width * 0.5,
            y + height * 0.5,
            width,
            height,
            {
              isStatic: true,
            }
          );
          this.obstacles.add("winn", winn);
          break;
        }

        case "platform": {
          const platform = new PlatformsController(
            this,
            x,
            y,
            "platform",
            { isStatic: true },
            "left"
          );
          platform.moveHorizontally();
          platform.setData("type", "platform");
          this.platformGroup.add(platform); // Add the platform to the group

          break;
        }

        case "platformLeft": {
          const platform = new PlatformsController(
            this,
            x,
            y,
            "platform",
            { isStatic: true },
            "right"
          );
          platform.moveHorizontallyLeft();
          platform.setData("type", "platform");
          this.platformGroup.add(platform); // Add the platform to the group

          break;
        }
      }
    });

    this.cameras.main.startFollow(this.player!, true);
    this.matter.world.convertTilemapLayer(groundCoOp);

    this.platformGroup
      .getChildren()
      .forEach((platformObj: Phaser.GameObjects.GameObject) => {
        const platform = platformObj as PlatformsController; // Cast to PlatformsController
        this.obstacles.add("platform", platform.getBody());
      });
  }
  destroy() {
    this.scene.stop("ui");
    // this.trucks.forEach(trucks => trucks.destroy())
  }

  update(t: number, dt: number) {
    this.frame++;

    if (!this.isPowerCoOpCollected && this.frame % 140 == 0) {
      this.createBrownBox();
      this.createBrownBoxLeft();
    }
    if (this.isPowerCoOpCollected && this.frame % 150 == 0) {
      if (this.greenBoxCounter < 20) {
        this.createGreenBox();

        this.greenBoxCounter++;
      }
      if (this.redBoxCounter < 15) {
        this.createRedBox();
        this.redBoxCounter++;
      }
    }

    if (this.playerController) {
      this.playerController.update(dt);
    }

    if (true) {
      this.greenBoxes.forEach((greenBox) => greenBox.update(dt));
      this.redBoxes.forEach((redBox) => redBox.update(dt));
    }

    [...this.greenBoxes, ...this.redBoxes].forEach((box) => {
      [...this.greenBoxes, ...this.redBoxes].forEach((otherBox) => {
        if (box !== otherBox) {
          if (
            Phaser.Geom.Intersects.RectangleToRectangle(
              box.sprite.getBounds(),
              otherBox.sprite.getBounds()
            )
          ) {
            box.invertDirection();
            otherBox.invertDirection();
          }
        }
      });
    });

    this.powerCoOp.forEach((powerCoOp) => powerCoOp.update(dt));

    this.brownBox.forEach((brownBox) => brownBox.update(dt));

    this.platform.forEach((platform) => platform.update(dt));
  }
}

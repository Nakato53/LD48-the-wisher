import { State } from "../components/statestack"
import { ColorToFloat } from "../utils/color";
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import MenuState from "./menustate";
import Player from "../entities/player";
import Camera from "../components/camera";
import Config from "../config";
import TransitionState from "./transitionstate";
import Rat from "../entities/rat";

export default class GameState extends State {
    private floorTiles: Array<Animation>;

    private player: Player;
    private mapHeight: number;
    private mapWidth: number;
    private ennemis: Array<any> = [];

    constructor() {
        super();

        this.player = new Player();
        this.floorTiles = [];

        let mapdata = dofile("res/maps/demo.lua");
        this.mapWidth = mapdata.layers[1].width
        this.mapHeight = mapdata.layers[1].height
        const mapTiles = mapdata.layers[1].data

        for (let i = 1; i < this.mapWidth * this.mapHeight; i++) {
            const tileIndex = mapTiles[i]

            this.floorTiles.push(
                new Animation(
                    'tiles',
                    [
                        new AnimationFrame("res/images/tiles/tiles.png", tileIndex * 10, 0, 10, 6, 0.2),
                    ],
                    AnimationType.RANDOM
                )
            )
        }

        let rats = new Rat();
        rats.X = 50;
        rats.Y = 100;

        this.ennemis.push(rats);
    }

    public Update(dt: number) {
        if (love.keyboard.isDown("r")) {
            this._stack.AddState(new MenuState());
        }

        const previousRoomX = Math.floor(this.player.X / Config.GAME_WIDTH);
        const previousRoomY = Math.floor(this.player.Y / Config.GAME_HEIGHT);

        this.player.Update(dt);

        const currentRoomX = Math.floor(this.player.X / Config.GAME_WIDTH);
        const currentRoomY = Math.floor(this.player.Y / Config.GAME_HEIGHT);

        if (previousRoomX !== currentRoomX || previousRoomY !== currentRoomY) {
            this._stack.AddState(new TransitionState());
        }

        if (currentRoomX > previousRoomX) {
            Camera.MoveTo({ x: Camera.x + Config.GAME_WIDTH, y: Camera.y })
        }

        if (currentRoomX < previousRoomX) {
            Camera.MoveTo({ x: Camera.x - Config.GAME_WIDTH, y: Camera.y })
        }

        if (currentRoomY > previousRoomY) {
            Camera.MoveTo({ x: Camera.x, y: Camera.y + Config.GAME_HEIGHT })
            this.player.Y += 10
        }

        if (currentRoomY < previousRoomY) {
            Camera.MoveTo({ x: Camera.x, y: Camera.y - Config.GAME_HEIGHT })
        }
        for (let index = 0; index < this.ennemis.length; index++) {
            this.ennemis[index].Update(dt);

        }
    }

    public Draw() {
        love.graphics.clear(ColorToFloat(0, 0, 0));

        for (let index = 0; index < this.floorTiles.length; index++) {
            let y = Math.floor(index / this.mapWidth);
            let x = index - (this.mapWidth * y);

            love.graphics.draw(
                this.floorTiles[index].getFrameImage(),
                this.floorTiles[index].getFrameQuad(),
                x * 10 - Camera.x,
                y * 6 - Camera.y
            );
        }

        for (let index = 0; index < this.ennemis.length; index++) {
            this.ennemis[index].Draw();

        }

        this.player.Draw();
    }
}
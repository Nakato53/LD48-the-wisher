import { State } from "../components/statestack"
import { ColorToFloat } from "../utils/color";
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import MenuState from "./menustate";
import Player from "../entities/player";
import Camera from "../components/camera";
import Config from "../config";
import TransitionState from "./transitionstate";
import Rat from "../entities/rat";
import { distance } from "../utils/distance";
import { CheckCollision } from "../utils/collision";
import { line, Quad } from "love.graphics";
import Static from "../static";
import Coin from "../entities/coin";
import Pathfinder from "../utils/pathfinding";
import Level from "../entities/level";

export default class GameState extends State {
    private floorTiles: Array<number>;

    private player: Player;
    private mapHeight: number;
    private mapWidth: number;

    private currentLevel:Level;

    private tileset:Array<AnimationFrame>;

    constructor() {
        super();


        this.tileset = [];
        this.player = new Player();
        this.player.X = 3*21;
        this.player.Y = 3*21;
        this.floorTiles = [];
        let mapdata = require("res/maps/demo");
        this.currentLevel = new Level("res/maps/demo");


        this.mapWidth = mapdata.layers[1].width
        this.mapHeight = mapdata.layers[1].height
        const mapTiles = mapdata.layers[1].data

        

    }

    public Update(dt: number) {
        if (love.keyboard.isDown("r")) {
            this._stack.AddState(new MenuState());
        }

        const previousRoomX = Math.floor(this.player.X / Config.GAME_WIDTH);
        const previousRoomY = Math.floor(this.player.Y / Config.GAME_HEIGHT);

        const path = new Pathfinder([
            [0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0],
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]).findPath({x: 1, y: 1}, {x: 5, y: 5})

        //path.forEach((e:any) => {
        //    print(e.x + ", " + e.y)
        //});

        let previousX = this.player.X +0;
        let previousY = this.player.Y +0;
        this.player.Update(dt);
        
        let playerbb = this.player.getBoundingBox();
        if(!this.currentLevel.isWalkable(playerbb,this.player)){
            this.player.X = previousX;
            this.player.Y = previousY;
        }
     

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

        this.currentLevel.Update(dt,this.player);
    }

    public Draw() {
        love.graphics.clear(ColorToFloat(0, 0, 0));
        
        this.currentLevel.Draw(this.player);        
        this.player.Draw();


        // UI
        love.graphics.setColor(ColorToFloat(34,32,52,200));
        love.graphics.rectangle("fill",0, 0, 2 + this.player.totalLife *(8+2) , 12);

        love.graphics.setColor(ColorToFloat(34,32,52,100));
        for (let index = 0; index < this.player.totalLife; index++) {
            love.graphics.draw(Static.TEXTURE_MANAGER.get("res/images/coin/loot-coin.png"), love.graphics.newQuad(0,0,8,8,64,12),2+(8+2)*index,2);
        }
        
        love.graphics.setColor(ColorToFloat(255,255,255));
        for (let index = 0; index < this.player.life; index++) {
            love.graphics.draw(Static.TEXTURE_MANAGER.get("res/images/coin/loot-coin.png"), love.graphics.newQuad(0,0,8,8,64,12),2+(8+2)*index,2);
        }
        
    }
}
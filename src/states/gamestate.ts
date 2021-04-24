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
import { Quad } from "love.graphics";
import Static from "../static";
import Coin from "../entities/coin";

export default class GameState extends State {
    private floorTiles: Array<number>;

    private player: Player;
    private mapHeight: number;
    private mapWidth: number;
    private objects: Array<any> = [];

    private tileset:Array<AnimationFrame>;

    constructor() {
        super();
        this.tileset = [];
        this.player = new Player();
        this.player.X = 3*21;
        this.player.Y = 3*21;
        this.floorTiles = [];
        let mapdata = require("res/maps/demo");
        this.mapWidth = mapdata.layers[1].width
        this.mapHeight = mapdata.layers[1].height
        const mapTiles = mapdata.layers[1].data

        for (let index = 0; index < 4; index++) {
            this.tileset.push(new AnimationFrame("res/images/tiles/tiles.png", index * 21, 0, 21, 12, 0.2));       
        }


        for (let i = 1; i < this.mapWidth * this.mapHeight; i++) {
            const tileIndex = mapTiles[i] -1
            this.floorTiles.push(tileIndex);
        }

        
        const mapobjects = mapdata.layers[2].data
        for (let index = 0; index < this.mapWidth * this.mapHeight; index++) {
            if(mapobjects[index] != 0){
                if(mapobjects[index]  == 5){
                    // coin
                    let coin = new Coin();
                    coin.Y = Math.floor(index / this.mapWidth);
                    coin.X = index - (this.mapWidth * coin.Y) - 1;
                    print("COIN : " + coin.X + "-" + coin.Y);

                    coin.Y = (coin.Y * 12) + 2
                    coin.X = (coin.X * 21) + 6
                    
                    this.objects.push(coin);
                }
            }
          
            
        }

        let rats = new Rat();
        rats.X = 50;
        rats.Y = 100;

        this.objects.push(rats);
    }

    public Update(dt: number) {
        if (love.keyboard.isDown("r")) {
            this._stack.AddState(new MenuState());
        }

        const previousRoomX = Math.floor(this.player.X / Config.GAME_WIDTH);
        const previousRoomY = Math.floor(this.player.Y / Config.GAME_HEIGHT);




        let previousX = this.player.X +0;
        let previousY = this.player.Y +0;
        this.player.Update(dt);
        
        let touch = false;


    let playerbb = this.player.getBoundingBox();
        for (let index = 0; index < this.floorTiles.length; index++) {
            let y = Math.floor(index / this.mapWidth);
            let x = index - (this.mapWidth * y);
            
            if(distance(this.player.X, this.player.Y, x*21, y*12) < 50){
               if(this.floorTiles[index] != 0 && CheckCollision(playerbb.X, playerbb.Y, playerbb.W, playerbb.H, x*21, y*12, 21,12)){
                   this.player.X = previousX;
                   this.player.Y = previousY;
               }
            }
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
        for (let index = 0; index < this.objects.length; index++) {
            this.objects[index].Update(dt);

        }
    }

    public Draw() {
        love.graphics.clear(ColorToFloat(0, 0, 0));
        let drawTilescount = 0;
        for (let index = 0; index < this.floorTiles.length; index++) {
            let y = Math.floor(index / this.mapWidth);
            let x = index - (this.mapWidth * y);
            
            if(distance(this.player.X, this.player.Y, x*21, y*12) < 250){
                love.graphics.draw(
                    Static.TEXTURE_MANAGER.get(this.tileset[this.floorTiles[index]].imagePath),
                    love.graphics.newQuad(
                        this.tileset[this.floorTiles[index]].x,
                        this.tileset[this.floorTiles[index]].y,
                        21,
                        12, 
                        21*5, 
                        12
                    ),
                    x * 21 - Camera.x,
                    y * 12 - Camera.y
                );
                drawTilescount++;
                if(Config.GAME_DEBUG){
                    love.graphics.setColor(ColorToFloat(255,0,0));
                    love.graphics.rectangle("line", x*21- Camera.x,y*12- Camera.y,21,12);
                    love.graphics.setColor(ColorToFloat(255,255,255));
                }
            }
        }
     //   print(drawTilescount);

        for (let index = 0; index < this.objects.length; index++) {
            this.objects[index].Draw();

        }

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
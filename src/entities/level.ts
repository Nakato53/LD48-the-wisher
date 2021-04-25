import { Image } from "love.graphics";
import Camera from "../components/camera";
import Rectangle from "../components/rectangle";
import Config from "../config";
import { EntityType, RoomSize, TileSize } from "../enums";
import Static from "../static";
import { CheckCollision } from "../utils/collision";
import { ColorToFloat } from "../utils/color";
import Coin from "./coin";
import Entities, { PlayerRelatedEntities } from "./entities";
import Player from "./player";
import Rat from "./rat";



export default class Level{
    public tileset:Image;
    public mapFile:string;
    public fileData:any;

    public levelPath:string;

    private mapHeight: number;
    private mapWidth: number;

    private cells:Array<Array<number>>;
    
    public entities: Array<PlayerRelatedEntities> = [];

    constructor(path:string ){
       this.levelPath =path;
       this.reload();
    }

    public reload(){
        this.mapFile = this.levelPath;        
        this.fileData = require(this.levelPath);
        this.cells = [];
        this.entities = [];

        this.tileset = Static.TEXTURE_MANAGER.get("res/images/tiles/tiles.png");        
        this.loadDatas();
        this.loadEntities();
    }

    private loadDatas(){
        
        this.mapWidth =  this.fileData.layers[1].width
        this.mapHeight = this.fileData.layers[1].height
        const mapTiles = this.fileData.layers[1].data

        let y = 0;
        let x = 0;
        let line = [];
        for (let i = 1; i <= this.mapWidth * this.mapHeight; i++) {
            x =  i - (this.mapWidth * y) - 1;
            const tileIndex = mapTiles[i] -1
            line[x] = tileIndex;

            if(i%this.mapWidth == 0){
                y++;
                this.cells.push(line);
                line = [];
            }
        }
        this.cells.push(line);
    }

    private loadEntities(){
        
        const mapobjects = this.fileData.layers[2].data
        for (let index = 1; index <= this.mapWidth * this.mapHeight; index++) {
            if(mapobjects[index] != 0){
                if(mapobjects[index] -1 == EntityType.COIN){
                    // coin
                    let coin = new Coin();
                    coin.Y = Math.floor(index / this.mapWidth);
                    coin.X = index - (this.mapWidth * coin.Y) - 1;
                    
                    coin.Y = (coin.Y * 12) + 2
                    coin.X = (coin.X * 21) + 6
                    
                    this.entities.push(coin);
                }
                if(mapobjects[index] -1 == EntityType.RATS){
                    // rat
                    let rat = new Rat();
                    rat.Y = Math.floor(index / this.mapWidth);
                    rat.X = index - (this.mapWidth * rat.Y) - 1;
                    
                    rat.Y = ((rat.Y) * 12) + 10
                    rat.X = (rat.X * 21) + 6

                    // set les details de la rooms au rats
                    rat.assignRoomData(this.getRoomTiles(rat.getRoomPosition().X,rat.getRoomPosition().Y));
                   // rat.randomTarget();
                   rat.targetX =rat.getCellPositionIntoRoom().X;
                   rat.targetY =rat.getCellPositionIntoRoom().Y;
                   
                    this.entities.push(rat);

                    
                }
            }
          
            
        }

        print("------------ LOADED ------------");
    }

    public getRoomTiles(roomX:number, roomY:number):Array<Array<number>>{
        let room = [];
        for (let y = roomY*RoomSize.Y; y < (roomY+1)*RoomSize.Y; y++) {
            let line = [];
            for (let x = roomX*RoomSize.X; x < (roomX+1)*RoomSize.X; x++) {
                line.push(this.cells[y][x]);
            }            
            room.push(line);
        }
       return room;
    }

    public isWalkable(rectangle:Rectangle, player:Player):boolean{
        let playerMapPosition = player.getCellPosition();
        let walkable = true;
        for (let y = Math.max(playerMapPosition.Y - 2,0); y < Math.min(playerMapPosition.Y + 2,this.mapHeight); y++) {
            for (let x = Math.max(playerMapPosition.X - 2,0); x < Math.min(playerMapPosition.X + 2,this.mapWidth); x++) {
                if(this.cells[y][x] != 0 && CheckCollision(rectangle.X, rectangle.Y, rectangle.W, rectangle.H, x*TileSize.X, y*TileSize.Y, TileSize.X,TileSize.Y))
                walkable = false;
            }
        }       
        return walkable;
    }

    public Update(dt:number, player:Player){
        for (let index = this.entities.length-1; index >= 0; index--) {
            if(this.entities[index].getRoomPosition().X == player.getRoomPosition().X && this.entities[index].getRoomPosition().Y == player.getRoomPosition().Y){
                this.entities[index].UpdateWithPlayer(dt, player);
                if(this.entities[index].needRemove()){
                    this.entities.splice(index,1);
                }
                
            }            
        }
    }


    public Draw(player:Player){
        let playerMapPosition = player.getCellPosition();
        for (let y = Math.max(playerMapPosition.Y - 12,0); y < Math.min(playerMapPosition.Y + 12,this.mapHeight); y++) {
            for (let x = Math.max(playerMapPosition.X - 12,0); x < Math.min(playerMapPosition.X + 12,this.mapWidth); x++) {
                let tileIndex = this.cells[y][x];
                love.graphics.draw(
                    this.tileset,
                    love.graphics.newQuad(
                        tileIndex * TileSize.X,
                        0,
                        TileSize.X,
                        TileSize.Y, 
                        this.tileset.getWidth(), 
                        this.tileset.getHeight()
                    ),
                    x * TileSize.X - Camera.x,
                    y * TileSize.Y - Camera.y
                );    
                if(Config.GAME_DEBUG){
                    love.graphics.setColor(ColorToFloat(255,0,0));
                    love.graphics.rectangle("line", x*TileSize.X- Camera.x,y*TileSize.Y- Camera.y,TileSize.X,TileSize.Y);
                    love.graphics.setColor(ColorToFloat(255,255,255));
                }
            }
            
        }  
        
        for (let index = 0; index < this.entities.length; index++) {
            if(this.entities[index].getRoomPosition().X == player.getRoomPosition().X && this.entities[index].getRoomPosition().Y == player.getRoomPosition().Y){
                this.entities[index].Draw();
            }            
        }
    }
}
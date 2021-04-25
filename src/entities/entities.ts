import Rectangle from "../components/rectangle";
import Vector2 from "../components/vector2";
import { RoomSize, TileSize } from "../enums";
import Player from "./player";


export default abstract class Entities {
    public X:number;
    public Y:number;
    
    /**
     * return the cell index in world cell in 2d array
     */
    public getCellPosition():Vector2{
        return new Vector2(
            Math.floor(this.X / TileSize.X),
            Math.floor(this.Y / TileSize.Y)
        );
    }

    
    public getBoundingBox():Rectangle{
        return new Rectangle(1,1,1,1);
    }

    /**
     * Return the room index in 2d array
     */
    public getRoomPosition(){
        return new Vector2(
            Math.floor(Math.floor(this.X / TileSize.X) / RoomSize.X),
            Math.floor(Math.floor(this.Y / TileSize.Y) / RoomSize.Y)
        );
    }

    public getCellPositionIntoRoom(){
        let pos = this.getCellPosition();
        let room = this.getRoomPosition();
        pos.X -= (room.X * RoomSize.X);
        pos.Y -= (room.Y * RoomSize.Y);
        return pos;
    }

    public Update(dt:number){

    }

    public Draw(){}
}


export abstract class PlayerRelatedEntities extends Entities{

    public entityType = "";
    public UpdateWithPlayer(dt:number, player:Player){

    }
    public needRemove():boolean{
        return false;
    }
}
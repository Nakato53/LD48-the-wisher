import Vector2 from "../components/vector2";
import { RoomSize, TileSize } from "../enums";

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

    /**
     * Return the room index in 2d array
     */
    public getRoomPosition(){
        return new Vector2(
            Math.floor(Math.floor(this.X / TileSize.X) / RoomSize.X),
            Math.floor(Math.floor(this.Y / TileSize.Y) / RoomSize.Y)
        );
    }

    public Update(dt){

    }

    public Draw(){}
}
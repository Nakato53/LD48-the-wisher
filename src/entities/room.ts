export class CellType {
    public static CELL_EMPTY:number = 0;
    public static CELL_BLOCK:number = 1;
    public static CELL_SPIKE:number = 2;
    public static CELL_HOLE:number = 3;
}


export default class Room{
    public getCellType(x:number, y:number):number{
        return 0;
    }
}
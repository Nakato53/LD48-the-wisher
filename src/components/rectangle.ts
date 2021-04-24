import { CheckCollision } from "../utils/collision";

export default class Rectangle{
    public X:number;
    public Y:number;
    public W:number;
    public H:number;
    
    constructor(x:number,y:number,w:number,h:number){
        this.W = w;
        this.H = h;
        this.X = x;
        this.Y = y;
    }

    public ToRaw(){
        return this.X, this.Y, this.W, this.H;
    }

    public Intersect(other:Rectangle):boolean{
       // return CheckCollision()
        return false;
    }
}
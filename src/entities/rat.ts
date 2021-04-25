
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import Rectangle from "../components/rectangle";
import Config from "../config";
import Static from "../static";
import Camera from "../components/camera";
import { DegreeToRadian } from "../utils/angle";
import { ColorToFloat } from "../utils/color";
import Player, { AttackDirection } from "./player";
import Entities, { PlayerRelatedEntities } from "./entities";
import Vector2 from "../components/vector2";
import { distance, lerp } from "../utils/distance";
import { RoomSize, TileSize } from "../enums";
import Pathfinder from "../utils/pathfinding";
import { TweenLib } from "../libs/Tween";

export class RatState {
    public static IDDLE:string = "iddle";
    public static MOVING:string = "moving";
    public static CHASING:string = "chasing";
    public static ATTACK:string = "attack";
}

export default class Rat extends PlayerRelatedEntities{
    private ratAnimations: AnimationSet;
    public X: number = 5;
    public Y: number = 35;
    public XSpeed = 25;
    public YSpeed = 25;
    public faceRight: boolean = true;
    public targetX:number;
    public targetY:number;
    public pathfinder:Pathfinder;
    public currentPath:any[]|null = [];

    public roomData:Array<Array<number>>;

    public swordDirection: string = AttackDirection.RIGHT;

    public rat_state:string = RatState.IDDLE;

    private attackstate_timer_far = 0;
    private attackstate_timer_recheck = 0;

    private timer_hit:number = 0;

    private _currentHP = 3;
    private _mapHP = 3;

    constructor() {

        super();
        this.entityType = "rat";
      this.currentPath = [];
        this.ratAnimations = new AnimationSet();
        let ratAnimationIddle = new Animation(
            "iddle",
            [
                new AnimationFrame("res/images/rats/rats.png", 0, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 1 * 25, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 2 * 25, 0, 25, 16, 0.2)
            ],
            AnimationType.LOOP
        );

        let ratAnimationWalk = new Animation(
            "walk",
            [
                new AnimationFrame("res/images/rats/rats.png", 3 * 25, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 4 * 25, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 5 * 25, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 6 * 25, 0, 25, 16, 0.2)
            ],
            AnimationType.LOOP
        );

        let ratAnimationAttack = new Animation(
            "attack",
            [
                new AnimationFrame("res/images/rats/rats.png", 7 * 25, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 8 * 25, 0, 25, 16, 0.2),
                new AnimationFrame("res/images/rats/rats.png", 9 * 25, 0, 25, 16, 0.2)
            ],
            AnimationType.LOOP
           
        );

        this.ratAnimations.AddAnimation(ratAnimationIddle);
        this.ratAnimations.AddAnimation(ratAnimationWalk);
        this.ratAnimations.AddAnimation(ratAnimationAttack);
        this.ratAnimations.SwitchAnimation("iddle");

        Static.TWEEN.New(
            love.math.random(30)/10,
            this, 
            {},
            () => {
                print("REASSIGN TARGET AND SWITHC")
                    // reassign target
                    this.randomTarget();
                    let roompos = this.getCellPositionIntoRoom();
                    this.currentPath =  this.pathfinder.findPath(
                        {x:roompos.X+1, y:roompos.Y+1},
                        {x: this.targetX+1, y: this.targetY+1}
                    );
                    
                    this.rat_state = RatState.MOVING;
            }
        );

    }

    
    public needRemove():boolean{
        return this._currentHP <= 0;
    }

    public assignRoomData(datas){
        this.roomData = datas;
        this.pathfinder = new Pathfinder(this.roomData);
    }

    public getBoundingBox():Rectangle{
        return new Rectangle(this.X-4, this.Y-6, 12, 8);
    }

    public hit(){
        if(this.timer_hit <= 0){
            this.timer_hit = 0.5;
            this._currentHP--;
        }
    }

    public setTarget(x:number, y:number){
        this.targetX = x;
        this.targetY = y;
    }

    private MoveToNode(dt:number){
        if(this.currentPath != null){
            let nodex = this.getRoomPosition().X * TileSize.X * RoomSize.X + (this.currentPath[this.currentPath.length-1].x-0.5)*TileSize.X;
            let nodey = this.getRoomPosition().Y * TileSize.Y * RoomSize.Y + (this.currentPath[this.currentPath.length-1].y-0.5)*TileSize.Y;
        // print( "DISTANCE NODE " + distance(this.X, this.Y,nodex, nodey));
            if(distance(this.X, this.Y,nodex, nodey) > 1){
                let previousX = this.X+0;
                if(math.abs(nodex - this.X) > this.XSpeed*dt )
                    this.X = this.X + ( nodex - this.X > 0 ? 1:-1)*this.XSpeed*dt;
                    
                if(math.abs(nodey - this.Y) > this.YSpeed*dt )
                    this.Y = this.Y + ( nodey - this.Y > 0 ? 1:-1)*this.YSpeed*dt;

                if(math.abs(nodex - this.X) > 0.3 )
                this.faceRight = nodex - this.X >= 0 ? true : false;
            }else{
            this.currentPath.pop();
            }        
        }      
    }

    public UpdateWithPlayer(dt:number, player:Player){

        this.timer_hit-=dt;

        if(this.rat_state == RatState.MOVING){
                // test si proche 
            print(distance(this.X, this.Y, player.X, player.Y));
            if(distance(this.X, this.Y, player.X, player.Y) < 50 && this.rat_state != RatState.ATTACK){
                this.rat_state = RatState.ATTACK;
                this.attackstate_timer_far = 0;
                this.attackstate_timer_recheck = 0;

                let roompos = this.getCellPositionIntoRoom();
                let playerroompos = player.getCellPositionIntoRoom();
                this.currentPath =  this.pathfinder.findPath(
                    {x:roompos.X+1, y:roompos.Y+1},
                    {x: playerroompos.X+1, y: playerroompos.Y+1}
                );
                

            }

            this.ratAnimations.SwitchAnimation("walk");
            if(this.currentPath != null && this.currentPath.length > 0){     
                this.MoveToNode(dt);
            }else{
                
                this.rat_state = RatState.IDDLE;
                Static.TWEEN.New(
                    love.math.random(30)/10,
                    this, 
                    {},
                    () => {
                            // reassign target
                            this.randomTarget();
                            let roompos = this.getCellPositionIntoRoom();
                            this.currentPath =  this.pathfinder.findPath(
                                {x:roompos.X+1, y:roompos.Y+1},
                                {x: this.targetX+1, y: this.targetY+1}
                            );
                            
                            this.rat_state = RatState.MOVING;
                    }
                );
                
            }
        }
        else if (this.rat_state == RatState.IDDLE){
            
            this.ratAnimations.SwitchAnimation("iddle");
            
        }
        else if (this.rat_state == RatState.ATTACK){
            
            this.ratAnimations.SwitchAnimation("attack");
            this.attackstate_timer_recheck += dt;

            // recalcul toute les 1 sec
            if(this.attackstate_timer_recheck > 1 ){
                this.attackstate_timer_recheck = 0;
                let roompos = this.getCellPositionIntoRoom();
                let playerroompos = player.getCellPositionIntoRoom();
                this.currentPath =  this.pathfinder.findPath(
                    {x:roompos.X+1, y:roompos.Y+1},
                    {x: playerroompos.X+1, y: playerroompos.Y+1}
                );
            }

            if(distance(this.X, this.Y, player.X, player.Y) > 50 ){
                this.attackstate_timer_far += dt;
            }else{
                this.attackstate_timer_far = 0;
            }


            if(this.currentPath != null && this.currentPath.length > 0){     
                
                this.MoveToNode(dt);
                
            }else{
                let roompos = this.getCellPositionIntoRoom();
                let playerroompos = player.getCellPositionIntoRoom();
                this.currentPath =  this.pathfinder.findPath(
                    {x:roompos.X+1, y:roompos.Y+1},
                    {x: playerroompos.X+1, y: playerroompos.Y+1}
                );
                
            }



            if(this.attackstate_timer_far > 5){
                this.rat_state = RatState.IDDLE;
                Static.TWEEN.New(
                    love.math.random(30)/10,
                    this, 
                    {},
                    () => {
                            // reassign target
                            this.randomTarget();
                            let roompos = this.getCellPositionIntoRoom();
                            this.currentPath =  this.pathfinder.findPath(
                                {x:roompos.X+1, y:roompos.Y+1},
                                {x: this.targetX+1, y: this.targetY+1}
                            );
                            
                            this.rat_state = RatState.MOVING;
                    }
                );
            }
        }
        


        this.ratAnimations.Update(dt);
        let hasMove = false;

       
    }

    public randomTarget(){
        let randomY = 1+love.math.random(this.roomData.length-3);
        let randomX =1+ love.math.random(this.roomData[0].length-3);

     

        while(this.roomData[randomY][randomX] != 0){
         randomY = 1+love.math.random(this.roomData.length-3);
         randomX = 1+love.math.random(this.roomData[0].length-3);
        }
        //print (randomX.toString() + "-"+randomY.toString()) ;
        //print((this.roomData[randomY][randomX]));
        this.targetX = randomX;
        this.targetY = randomY;
    }

    public Draw() {
       if(this.timer_hit > 0){
           love.graphics.setColor(1,0,0,1);
       }
        love.graphics.draw(
            this.ratAnimations.getFrameImage(),
            this.ratAnimations.getFrameQuad(),
            Math.floor(this.X)- Camera.x ,
            Math.floor(this.Y)- Camera.y ,
            0,
            this.faceRight ? 1 : -1, 1, 12, 12
        );
        
       if(this.timer_hit > 0){
        love.graphics.setColor(1,1,1,1);
    }

        // draw target
        // let targetXRoomPosition = this.getRoomPosition().X * TileSize.X * RoomSize.X + this.targetX*TileSize.X + 10;
        // let targetYRoomPosition = this.getRoomPosition().Y * TileSize.Y * RoomSize.Y+ this.targetY*TileSize.Y + 6;
        // love.graphics.line(this.X- Camera.x, this.Y- Camera.y, targetXRoomPosition- Camera.x, targetYRoomPosition- Camera.y);


        
        // draw path
        if(this.currentPath != null){
            for (let index = this.currentPath.length-2; index >= 0; index--) {
            
                let nodex = this.getRoomPosition().X * TileSize.X * RoomSize.X + (this.currentPath[index].x-0.5)*TileSize.X;
                let nodey = this.getRoomPosition().Y * TileSize.Y * RoomSize.Y + (this.currentPath[index].y-0.5)*TileSize.Y;
                
                let nodexprev = this.getRoomPosition().X * TileSize.X * RoomSize.X + (this.currentPath[index+1].x-0.5)*TileSize.X;
                let nodeyprev = this.getRoomPosition().Y * TileSize.Y * RoomSize.Y + (this.currentPath[index+1].y-0.5)*TileSize.Y;
                
                love.graphics.line(nodex -Camera.x, nodey -Camera.y,nodexprev -Camera.x, nodeyprev -Camera.y);
                
            }
        }

        
        love.graphics.rectangle(
            "fill",
            Math.floor(this.X)- Camera.x ,
            Math.floor(this.Y)- Camera.y ,
           2,2
        );
        
        if(Config.GAME_DEBUG){
            let bb = this.getBoundingBox();
            love.graphics.setColor(ColorToFloat(255,0,0));
            love.graphics.rectangle(
                "line",
                bb.X- Camera.x,
                bb.Y- Camera.y,
                bb.W,
                bb.H
            );
            love.graphics.setColor(ColorToFloat(255,255,255));
        }
    }
}
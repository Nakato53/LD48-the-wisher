import { Image, Quad } from "love.graphics";
import Static from "../static";


export class AnimationType{    
    public static LOOP = 1;
    public static PING_PONG = 2;
    public static ONE_TIME = 3;
    public static TRIGGER = 4;
}

export class AnimationFrame{
    public imagePath:string;
    public x:number;
    public y:number;
    public w:number;
    public h:number;
    public time:number;

    constructor(image:string, x:number, y:number, w:number, h:number, time:number){
        this.imagePath = image;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.time = time;
    }

}

export default class Animation{
    private _name:string;
    private _frames:Array<AnimationFrame>;
    private _type:AnimationType;
    

    private _currentFrame = 0;
    private _step = 1;
    private _frameTimer = 0;

    private _callback:Function;
    private _callBackCalled:boolean = false;

    constructor(name:string, frames:Array<AnimationFrame>, type:number, callback:Function = null) {
        this._name = name;
        this._frames = frames;
        this._type = type;
        this._callback = callback;
    }

    public Update(dt){
        this._frameTimer+=dt;
        if(this._frameTimer>=this._frames[this._currentFrame].time){
            this._frameTimer -= this._frames[this._currentFrame].time;
            
            switch (this._type) {
                case AnimationType.LOOP:
                    this._currentFrame += this._step;
                    if(this._currentFrame >= this._frames.length){
                        this._currentFrame = 0;
                    }                    
                    break;
                case AnimationType.PING_PONG:
                    this._currentFrame += this._step;
                    if(this._currentFrame >= this._frames.length || this._currentFrame <= -1){
                        this._step *= -1;
                        this._currentFrame += this._step;
                    }                    
                    break;
                case AnimationType.ONE_TIME:           
                    this._currentFrame += this._step;
                    if(this._currentFrame >= this._frames.length){
                        this._currentFrame -= this._step;
                    }                 
                    break;
                case AnimationType.TRIGGER:
                    this._currentFrame += this._step;
                    if(this._currentFrame >= this._frames.length){
                        this._currentFrame -= this._step;
                        if(!this._callBackCalled){
                            this._callBackCalled = true;
                            this._callback();
                        }
                    }
                default:
                    break;
            }         
        }
    }

    public getName(){
        return this._name;
    }

    public getFrameImage():Image{
       return Static.TEXTURE_MANAGER.get(this._frames[this._currentFrame].imagePath);
    }

    public getFrameQuad():Quad{
        return  love.graphics.newQuad( 
            this._frames[this._currentFrame].x,
            this._frames[this._currentFrame].y,
            this._frames[this._currentFrame].w,
            this._frames[this._currentFrame].h,
            Static.TEXTURE_MANAGER.get( this._frames[this._currentFrame].imagePath).getWidth(),
            Static.TEXTURE_MANAGER.get( this._frames[this._currentFrame].imagePath).getHeight()
        );
    }
}

export class AnimationSet{
    private _currentAnimation:string;
    private _currentAnimationIndex:number;
    private _animations:Array<Animation>;

    constructor(animations:Array<Animation>, currentAnimation:string) {
        this._animations = animations;
        this._currentAnimation = currentAnimation;    
        this.SwitchAnimation(currentAnimation);
    }

    public SwitchAnimation(animationName:string){
        for (let index = 0; index < this._animations.length; index++) {
            if(this._animations[index].getName() == animationName){
                this._currentAnimationIndex = index;
            }            
        }
    }

    public Update(dt){
        this._animations[this._currentAnimationIndex].Update(dt);
    }
    
    public getFrameImage():Image{
       return this._animations[this._currentAnimationIndex].getFrameImage();
     }
 
     public getFrameQuad():Quad{
        return this._animations[this._currentAnimationIndex].getFrameQuad();
    }


}
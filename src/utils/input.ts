import { KeyConstant } from "love.keyboard";

export default class Input{

    private _keyslist:Array<string> = [
        "left",
        "right",
        "up",
        "down",
        "attackup",
        "attackdown",
        "attackright",
        "attackleft",
        "x"
    ];

    public currentKeyboardState:Array<boolean>;
    public previousKeyboardState:Array<boolean>;

    public currentMouseState:Array<boolean>;
    public previousMouseState:Array<boolean>;

    constructor(){
        this.currentKeyboardState = [];
        this.previousKeyboardState = [];
        this.currentMouseState = [];
        this.previousMouseState = [];

        this._keyslist.forEach(element => {
            this.currentKeyboardState[element] = false;
            this.previousKeyboardState[element] = false;
        });

        for (let index = 0; index < 3; index++) {
            this.currentMouseState[index] = false;
            this.previousMouseState[index] = false;
        }
    }
    
    public Update(dt:number){
        this._keyslist.forEach(element => {
            this.previousKeyboardState[element] = this.currentKeyboardState[element] ? true : false;
        });
        
        for (let index = 0; index < 3; index++) {
            this.previousMouseState[index] = this.previousMouseState[index] ? true : false;
        }

            this.currentKeyboardState["up"] =  love.keyboard.isDown("w") || love.keyboard.isDown("w");
            this.currentKeyboardState["down"] =  love.keyboard.isDown("s");
            
            this.currentKeyboardState["left"] = love.keyboard.isDown("a") || love.keyboard.isDown("q");
            this.currentKeyboardState["right"] =  love.keyboard.isDown("d");

            
            this.currentKeyboardState["attackup"] =  love.keyboard.isDown("up");
            this.currentKeyboardState["attackdown"] =  love.keyboard.isDown("down");            
            this.currentKeyboardState["attackleft"] = love.keyboard.isDown("left") ;
            this.currentKeyboardState["attackright"] =  love.keyboard.isDown("right");

            this.currentKeyboardState["x"] = love.keyboard.isDown("x");
           
        
        for (let index = 0; index < 3; index++) {
            this.currentMouseState[index] = love.mouse.isDown(index);
        }   
    }

    public isDown(key:string){
        return this.currentKeyboardState[key];
    }

    public isUp(key:string){
        return !this.currentKeyboardState[key];
    }

    public isJustPressedKey(key:string){
        return this.currentKeyboardState[key] && !this.previousKeyboardState[key];
    }
    
    public isJustReleasedKey(key:string){
        return !this.currentKeyboardState[key] && this.previousKeyboardState[key];
    }
    
    public isMousePressed(index:number){
        return this.currentMouseState[index];
    }
    public isMouseReleased(index:number){
        return !this.currentMouseState[index];
    }
    public isJustMousePressed(index:number){
        return this.currentMouseState[index] && !this.previousMouseState[index];
    }
    
    public isJustMouseReleased(index:number){
        return !this.currentMouseState[index] && this.previousMouseState[index];
    }


}
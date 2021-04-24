import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import Static from "../static";
import { DegreeToRadian } from "../utils/angle";

export class PlayerState {
    public static ATTACK:string = "attack";
    public static MOVING:string = "moving";
}

export class AttackDirection {
    public static UP:string = "up";
    public static DOWN:string = "down";
    public static LEFT:string = "left";
    public static RIGHT:string = "right";
    
}

export default class Player{
    
    private coinAnimations:AnimationSet;
    public X:number = 5;
    public Y:number = 5;
    public XSpeed = 30;
    public YSpeed = 30;
    public faceRight:boolean = true;

    public swordAnimation:Animation;
    public swordDirection:string = AttackDirection.RIGHT;

    public player_state:string = PlayerState.MOVING;

    constructor(){

        this.swordAnimation = new Animation(
            "sword",
            [
                new AnimationFrame("res/images/coin/sword-attack.png", 0*32,0,32,32, 0.1),
                new AnimationFrame("res/images/coin/sword-attack.png", 1*32,0,32,32, 0.25),
                new AnimationFrame("res/images/coin/sword-attack.png", 2*32,0,32,32, 0.15),
                new AnimationFrame("res/images/coin/sword-attack.png", 3*32,0,32,32, 0.1)
            ],
            AnimationType.LOOP
        );

        this.coinAnimations = new AnimationSet();
        let coinAnimationIddle = new Animation(
            "iddle", 
            [
                new AnimationFrame("res/images/coin/coin.png", 0,0,16,16, 0.2),
                new AnimationFrame("res/images/coin/coin.png", 1*16,0,16,16, 0.2),
                new AnimationFrame("res/images/coin/coin.png", 2*16,0,16,16, 0.2),
                new AnimationFrame("res/images/coin/coin.png", 3*16,0,16,16, 0.2)
            ],
            AnimationType.LOOP
        );

        let coinAnimationWalk = new Animation(
            "walk", 
            [
                new AnimationFrame("res/images/coin/coin.png", 4*16,0,16,16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 5*16,0,16,16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 6*16,0,16,16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 7*16,0,16,16, 0.15)
            ],
            AnimationType.LOOP
        );
        
        let coinAnimationAttack = new Animation(
            "attack", 
            [
                new AnimationFrame("res/images/coin/coin.png", 8*16,0,16,16, 0.1),
                new AnimationFrame("res/images/coin/coin.png", 9*16,0,16,16, 0.25),
                new AnimationFrame("res/images/coin/coin.png", 10*16,0,16,16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 11*16,0,16,16, 0.1)
            ],
            AnimationType.TRIGGER,
            () => {
                this.swordAnimation.Reset();
                this.player_state = PlayerState.MOVING;
                this.coinAnimations.SwitchAnimation("iddle");
                
            }
        );

        this.coinAnimations.AddAnimation(coinAnimationIddle);        
        this.coinAnimations.AddAnimation(coinAnimationWalk);       
        this.coinAnimations.AddAnimation(coinAnimationAttack);         
        this.coinAnimations.SwitchAnimation("iddle");
    }

    public Update(dt:number){

        this.coinAnimations.Update(dt);
        let hasMove = false;
        if(Static.INPUT.isDown("left"))
        {
            if(this.player_state != PlayerState.ATTACK)
                this.faceRight = false;    
            this.X -= dt * this.XSpeed;
            
            hasMove = true;
        }
        if(Static.INPUT.isDown("right"))
        {
            hasMove = true;
            if(this.player_state != PlayerState.ATTACK)
                this.faceRight = true;            
            this.X += dt * this.XSpeed;
        }
        if(Static.INPUT.isDown("up"))
        {
            hasMove = true;
            this.Y -= dt * this.YSpeed;
        }
        if(Static.INPUT.isDown("down"))
        {        
            hasMove = true;    
            this.Y += dt * this.YSpeed;
        }
        if(Static.INPUT.isJustPressedKey("attackleft") && (this.player_state != PlayerState.ATTACK))
        {        
            this.swordDirection = AttackDirection.LEFT;
            this.player_state = PlayerState.ATTACK;
            this.faceRight = false;    
            hasMove = true;    
            this.coinAnimations.SwitchAnimation("attack");
        }
        
        if(Static.INPUT.isJustPressedKey("attackright") && (this.player_state != PlayerState.ATTACK))
        {        
            
            this.swordDirection = AttackDirection.RIGHT;
            this.player_state = PlayerState.ATTACK;
            this.faceRight = true;    
            hasMove = true;    
            this.coinAnimations.SwitchAnimation("attack");
        }

        if(Static.INPUT.isJustPressedKey("attackup") && this.player_state != "attack")
        {        
            
            this.swordDirection = AttackDirection.UP;
            this.player_state = PlayerState.ATTACK;
            hasMove = true;    
            this.coinAnimations.SwitchAnimation("attack");
        }
        
        if(Static.INPUT.isJustPressedKey("attackdown") && this.player_state != "attack")
        {        
            
            this.swordDirection = AttackDirection.DOWN;
            this.player_state = PlayerState.ATTACK;
            hasMove = true;    
            this.coinAnimations.SwitchAnimation("attack");
        }
        
        if(this.player_state != PlayerState.ATTACK){
            if( hasMove )
                this.coinAnimations.SwitchAnimationIf("walk", this.coinAnimations.getCurrentAnimation() == "iddle");
            else
                this.coinAnimations.SwitchAnimationIf("iddle", this.coinAnimations.getCurrentAnimation() == "walk");
        }

        
        if(this.player_state == PlayerState.ATTACK){
            this.swordAnimation.Update(dt);
        }
    }

   public Draw(){
       
    if(this.player_state ==  PlayerState.ATTACK){
        if(this.swordDirection == AttackDirection.LEFT || this.swordDirection == AttackDirection.RIGHT)
            love.graphics.draw(this.swordAnimation.getFrameImage(), this.swordAnimation.getFrameQuad(), Math.floor(this.X), Math.floor(this.Y), 0, this.faceRight ? 1:-1,1,11,20);
        if(this.swordDirection == AttackDirection.UP)
            love.graphics.draw(this.swordAnimation.getFrameImage(), this.swordAnimation.getFrameQuad(), Math.floor(this.X)+5+(!this.faceRight ? -10:0), Math.floor(this.Y)-8, DegreeToRadian(-30) + (!this.faceRight ? DegreeToRadian(45) : 0), this.faceRight ? 1:-1,1,16,16);
        if(this.swordDirection == AttackDirection.DOWN)
            love.graphics.draw(this.swordAnimation.getFrameImage(), this.swordAnimation.getFrameQuad(), Math.floor(this.X)+5+(!this.faceRight ? -10:0), Math.floor(this.Y)-5, DegreeToRadian(120)+ (!this.faceRight ? DegreeToRadian(120) : 0), this.faceRight ? 1:-1,1,16,16);
    }

    love.graphics.draw(this.coinAnimations.getFrameImage(), this.coinAnimations.getFrameQuad(), Math.floor(this.X), Math.floor(this.Y), 0, this.faceRight ? 1:-1,1,8,16);
   }

}
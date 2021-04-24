
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import Rectangle from "../components/rectangle";
import Config from "../config";
import Static from "../static";
import Camera from "../components/camera";
import { DegreeToRadian } from "../utils/angle";
import { ColorToFloat } from "../utils/color";
import { AttackDirection } from "./player";

export class RatState {
    public static MOVING:string = "moving";
    public static CHASING:string = "chasing";
    public static ATTACK:string = "attack";
}

export default class Rat {
    private ratAnimations: AnimationSet;
    public X: number = 5;
    public Y: number = 35;
    public XSpeed = 30;
    public YSpeed = 30;
    public faceRight: boolean = true;

    public swordDirection: string = AttackDirection.RIGHT;

    public rat_state:string = RatState.MOVING;

    constructor() {


      
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
            AnimationType.LOOP,
            () => {
            
                this.rat_state = RatState.CHASING;
                this.ratAnimations.SwitchAnimation("walk");

            }
        );

        this.ratAnimations.AddAnimation(ratAnimationIddle);
        this.ratAnimations.AddAnimation(ratAnimationWalk);
        this.ratAnimations.AddAnimation(ratAnimationAttack);
        this.ratAnimations.SwitchAnimation("iddle");

        Static.TWEEN.New(2, this, { }, () => {
            this.ratAnimations.SwitchAnimation("walk");
            Static.TWEEN.New(2, this, { X: 0 }, () => {
                this.ratAnimations.SwitchAnimation("attack");
            });
        })

    }

    public getBoundingBox():Rectangle{
        return new Rectangle(this.X-4, this.Y-10, 8, 8);
    }

    public Update(dt:number){


        this.ratAnimations.Update(dt);
        let hasMove = false;

       
    }

    public Draw() {
       
        love.graphics.draw(
            this.ratAnimations.getFrameImage(),
            this.ratAnimations.getFrameQuad(),
            Math.floor(this.X) - Camera.x,
            Math.floor(this.Y) - Camera.y,
            0,
            this.faceRight ? 1 : -1, 1, 8, 16
        );

        /*
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
        }*/
    }
}
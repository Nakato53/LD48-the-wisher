import { State } from "../components/statestack"
import { ColorToFloat } from "../utils/color";
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import MenuState from "./menustate";

export default class GameState extends State{

    private coinAnimations:AnimationSet;

    constructor(){
        super();
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

        this.coinAnimations = new AnimationSet(
            [
                coinAnimationIddle,
                coinAnimationWalk
            ],
            "walk"
        );
    }

    public Update(dt:number){
        if(love.keyboard.isDown("r")){
            this._stack.AddState(new MenuState());
        }
        this.coinAnimations.Update(dt);
    }

    public Draw(){
        
        love.graphics.clear(ColorToFloat(228,166,114));
        love.graphics.draw(this.coinAnimations.getFrameImage(), this.coinAnimations.getFrameQuad());
    }
}
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import Camera from "../components/camera";
import Entities, { PlayerRelatedEntities } from "./entities";
import Player from "./player";

export default class Coin extends PlayerRelatedEntities{
    private coinAnimations: AnimationSet;
    public X:number;
    public Y:number;
    constructor(){
        super();
        let coinAnimationFlip = new Animation(
            "flip",
            [
                new AnimationFrame("res/images/coin/loot-coin.png", 0, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 1*8, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 2*8, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 3*8, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 4*8, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 5*8, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 6*8, 0, 8, 12, 0.2),
                new AnimationFrame("res/images/coin/loot-coin.png", 7*8, 0, 8, 12, 0.2),
            ],
            AnimationType.LOOP
        );
        this.coinAnimations = new AnimationSet();
        this.coinAnimations.AddAnimation(coinAnimationFlip);
        this.coinAnimations.SwitchAnimation("flip");
    }

    public UpdateWithPlayer(dt:number, player:Player){
        this.coinAnimations.Update(dt);
    }

    public Draw(){
        love.graphics.draw(
            this.coinAnimations.getFrameImage(),
            this.coinAnimations.getFrameQuad(),
            Math.floor(this.X) - Camera.x,
            Math.floor(this.Y) - Camera.y
        );
    }
}
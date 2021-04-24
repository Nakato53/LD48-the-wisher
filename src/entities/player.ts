import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import Static from "../static";
import Camera from "../components/camera";

export default class Player {

    private coinAnimations: AnimationSet;
    public X: number = 5;
    public Y: number = 5;
    public XSpeed = 30;
    public YSpeed = 30;
    public faceRight: boolean = true;

    public swordAnimation: Animation;

    public player_state: string = "moving";

    constructor() {

        this.swordAnimation = new Animation(
            "sword",
            [
                new AnimationFrame("res/images/coin/sword-attack.png", 0 * 32, 0, 32, 32, 0.1),
                new AnimationFrame("res/images/coin/sword-attack.png", 1 * 32, 0, 32, 32, 0.25),
                new AnimationFrame("res/images/coin/sword-attack.png", 2 * 32, 0, 32, 32, 0.15),
                new AnimationFrame("res/images/coin/sword-attack.png", 3 * 32, 0, 32, 32, 0.1)
            ],
            AnimationType.LOOP
        );

        this.coinAnimations = new AnimationSet();
        let coinAnimationIddle = new Animation(
            "iddle",
            [
                new AnimationFrame("res/images/coin/coin.png", 0, 0, 16, 16, 0.2),
                new AnimationFrame("res/images/coin/coin.png", 1 * 16, 0, 16, 16, 0.2),
                new AnimationFrame("res/images/coin/coin.png", 2 * 16, 0, 16, 16, 0.2),
                new AnimationFrame("res/images/coin/coin.png", 3 * 16, 0, 16, 16, 0.2)
            ],
            AnimationType.LOOP
        );

        let coinAnimationWalk = new Animation(
            "walk",
            [
                new AnimationFrame("res/images/coin/coin.png", 4 * 16, 0, 16, 16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 5 * 16, 0, 16, 16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 6 * 16, 0, 16, 16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 7 * 16, 0, 16, 16, 0.15)
            ],
            AnimationType.LOOP
        );

        let coinAnimationAttack = new Animation(
            "attack",
            [
                new AnimationFrame("res/images/coin/coin.png", 8 * 16, 0, 16, 16, 0.1),
                new AnimationFrame("res/images/coin/coin.png", 9 * 16, 0, 16, 16, 0.25),
                new AnimationFrame("res/images/coin/coin.png", 10 * 16, 0, 16, 16, 0.15),
                new AnimationFrame("res/images/coin/coin.png", 11 * 16, 0, 16, 16, 0.1)
            ],
            AnimationType.TRIGGER,
            () => {
                this.swordAnimation.Reset();
                this.player_state = "moving";
                this.coinAnimations.SwitchAnimation("iddle");

            }
        );

        this.coinAnimations.AddAnimation(coinAnimationIddle);
        this.coinAnimations.AddAnimation(coinAnimationWalk);
        this.coinAnimations.AddAnimation(coinAnimationAttack);
        this.coinAnimations.SwitchAnimation("iddle");
    }

    public Update(dt: number) {

        this.coinAnimations.Update(dt);
        let hasMove = false;
        if (Static.INPUT.isDown("left")) {
            if (this.player_state != "attack")
                this.faceRight = false;
            this.X -= dt * this.XSpeed;

            hasMove = true;
        }
        if (Static.INPUT.isDown("right")) {
            hasMove = true;
            if (this.player_state != "attack")
                this.faceRight = true;
            this.X += dt * this.XSpeed;
        }
        if (Static.INPUT.isDown("up")) {
            hasMove = true;
            this.Y -= dt * this.YSpeed;
        }
        if (Static.INPUT.isDown("down")) {
            hasMove = true;
            this.Y += dt * this.YSpeed;
        }
        if (Static.INPUT.isJustPressedKey("attackleft") && this.player_state != "attack") {
            this.player_state = "attack";
            this.faceRight = false;
            hasMove = true;
            this.coinAnimations.SwitchAnimation("attack");
        }

        if (Static.INPUT.isJustPressedKey("attackright") && this.player_state != "attack") {
            this.player_state = "attack";
            this.faceRight = true;
            hasMove = true;
            this.coinAnimations.SwitchAnimation("attack");
        }
        if (this.player_state != "attack") {
            if (hasMove)
                this.coinAnimations.SwitchAnimationIf("walk", this.coinAnimations.getCurrentAnimation() == "iddle");
            else
                this.coinAnimations.SwitchAnimationIf("iddle", this.coinAnimations.getCurrentAnimation() == "walk");
        }

        if (this.coinAnimations.getCurrentAnimation() == "attack") {
            this.swordAnimation.Update(dt);
        }
    }

    public Draw() {

        if (this.coinAnimations.getCurrentAnimation() == "attack") {
            love.graphics.draw(
                this.swordAnimation.getFrameImage(),
                this.swordAnimation.getFrameQuad(),
                Math.floor(this.X) - Camera.x,
                Math.floor(this.Y) - Camera.y,
                0,
                this.faceRight ? 1 : -1, 1, 11, 20
            );
        }

        love.graphics.draw(
            this.coinAnimations.getFrameImage(),
            this.coinAnimations.getFrameQuad(),
            Math.floor(this.X) - Camera.x,
            Math.floor(this.Y) - Camera.y,
            0,
            this.faceRight ? 1 : -1, 1, 8, 16
        );
    }

}
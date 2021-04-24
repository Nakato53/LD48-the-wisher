import { State } from "../components/statestack"
import Config from "../config"
import { ColorToFloat } from "../utils/color";

export default class TransitionState extends State{
    lifeTime = 0
    deathAt = 0

    constructor() {
        super();
        this.deathAt = 1
    }

    public Update(dt:number){
        this.lifeTime += dt
        
        if (this.lifeTime >= this.deathAt) {
            this._stack.RemoveState();
        }
    }

    public Draw(){
        love.graphics.setColor(ColorToFloat(0,0,0,150));
        love.graphics.rectangle("fill",0,0,Config.GAME_WIDTH, Config.GAME_HEIGHT);
        love.graphics.setColor(ColorToFloat(255,255,255));
    }
}
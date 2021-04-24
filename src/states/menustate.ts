import { State } from "../components/statestack"
import Config from "../config"
import { ColorToFloat } from "../utils/color";

export default class MenuState extends State{
    public Update(dt:number){
        if(love.keyboard.isDown("space")){
            this._stack.RemoveState();
        }
    }

    public Draw(){
        love.graphics.setColor(ColorToFloat(0,0,0,150));
        love.graphics.rectangle("fill",0,0,Config.GAME_WIDTH, Config.GAME_HEIGHT);
        love.graphics.setColor(ColorToFloat(255,255,255));
    }
}
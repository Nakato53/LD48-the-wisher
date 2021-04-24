import Screen from "./components/screen";
import Config from "./config";
import TestScreen from "./screens/testscreen";

export default class Game{
    
    private _currentScren:Screen;

    constructor() {
        love.window.setTitle(Config.GAME_NAME + " | " + Config.GAME_VERSION);
        this._currentScren = new TestScreen();
    }

    public Update(dt:number){
        this._currentScren.Update(dt);
    }

    public Draw(){
        this._currentScren.Draw();
    }
}
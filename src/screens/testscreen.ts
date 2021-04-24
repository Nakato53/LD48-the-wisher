import StateStack from "../components/statestack";
import GameState from "../states/gamestate";

export default class TestScreen{

    private _stack:StateStack;

    constructor(){
        this._stack = new StateStack();
        this._stack.AddState(new GameState());
    }
    
    public Update(dt:number){
        this._stack.Update(dt);
    }

    public Draw(){
        this._stack.Draw();
    }
}
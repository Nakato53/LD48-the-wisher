export abstract class State{
    protected _stack:StateStack;

    public setStack(stack:StateStack){
        this._stack = stack;
    }
    public Update(dt:number){}
    public Draw(){}
    public Enter(){};
    public Exit(){};
}

export default class StateStack{
    private _states:Array<State> =  [];

    constructor() {

    }

    public AddState(state:State){
        state.setStack(this);
        state.Enter();
        this._states.push(state);
    }

    public RemoveState(){
        this._states[this._states.length-1].Exit();
        this._states.pop();
    }

    public Update(dt:number){
        if(this._states.length>0)
            this._states[this._states.length-1].Update(dt);            
        
    }

    public Draw(){
        for (let index = 0; index < this._states.length; index++) {
            this._states[index].Draw();            
        }
    }
}
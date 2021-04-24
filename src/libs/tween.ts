export class Tween{
    private _luaTween: any
    private _callback: Function | null;
    
    constructor(luatween:any, callBack:Function = null) {
        this._luaTween = luatween;
        this._callback = callBack;
    }
    Update(dt: number): boolean{
        let isFinish = this._luaTween.update(dt);
        if (isFinish && this._callback != null) {
            this._callback();
            this._callback = null;
        }
        return isFinish;
    }
}
/*
 * Utilisation de la lib Tween de Kikito https://github.com/kikito/tween.lua
 * Ajout de callback en complément pour faire des suites d'actions
 */
export class TweenLib{

    private _imported: boolean = false;
    private _lib: any;
    private _tweens: Array<Tween>;

    constructor() {
        
        this._tweens = [];
        this._lib = require('res/lua/tween')
        this._imported = true;
        
    }

    public Update(dt: number) {
        for (let index = this._tweens.length-1; index >= 0; index--) {
            const tw = this._tweens[index];
            let isFinish = tw.Update(dt);
            if (isFinish) {
                this._tweens.splice(index, 1);
            }
        }
    }

    public New(time: number, object:any,  properties:any, callBack:Function = null):Tween {
        let tw = new Tween(this._lib.new(time, object, properties), callBack);
        this._tweens.push(tw);
        return tw;
    }  

}
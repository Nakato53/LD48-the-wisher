import { Image } from "love.graphics";

export default class SoundManager{
    private _sounds = [];

    constructor() {

    }

    public load(path:string):void{
        if(!(path in this._sounds)){
            this._sounds[path] = love.audio.newSource(path, "stream");
        }
    }
    
    public get(path:string):Source{
        this.load(path);
        return this._sounds[path];
    }
}
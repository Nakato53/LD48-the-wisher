import { Image } from "love.graphics";

export default class TextureManager{
    private _images = [];

    constructor() {

    }

    public load(path:string):void{
        if(!(path in this._images)){
            this._images[path] = love.graphics.newImage(path);
        }
    }
    
    public get(path:string):Image{
        this.load(path);
        return this._images[path];
    }
}
import { State } from "../components/statestack"
import { ColorToFloat } from "../utils/color";
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import MenuState from "./menustate";
import Player from "../entities/player";

export default class GameState extends State{

    private floorTiles:Array<Animation>;

    private player:Player;

    constructor(){
        super();
        this.player = new Player();
        this.floorTiles = [];

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 21; x++) {
                this.floorTiles.push(
                    new Animation(
                        'tiles',
                        [
                            new AnimationFrame("res/images/tiles/tile_group.png", 0,0,10,6, 0.2),
                            new AnimationFrame("res/images/tiles/tile_group.png", 1*10,0,10,6, 0.2),
                            new AnimationFrame("res/images/tiles/tile_group.png", 2*10,0,10,6, 0.2),
                            new AnimationFrame("res/images/tiles/tile_group.png", 3*10,0,10,6, 0.2),
                            new AnimationFrame("res/images/tiles/tile_group.png", 4*10,0,10,6, 0.2),
                            new AnimationFrame("res/images/tiles/tile_group.png", 5*10,0,10,6, 0.2),
                            new AnimationFrame("res/images/tiles/tile_group.png", 6*10,0,10,6, 0.2)
                        ],
                        AnimationType.RANDOM 
                    )
                )
                
            }
        }

        
        
    }

    public Update(dt:number){
        if(love.keyboard.isDown("r")){
            this._stack.AddState(new MenuState());
        }
        this.player.Update(dt);
    }

    public Draw(){
        
        love.graphics.clear(ColorToFloat(0,0,0));

        for (let index = 0; index < this.floorTiles.length; index++) {
            let y = Math.floor(index / 21);
            let x = index - (21 * y);
            love.graphics.draw(this.floorTiles[index].getFrameImage(),this.floorTiles[index].getFrameQuad(),x*10,y*6); 

        }
        this.player.Draw();
    }
}
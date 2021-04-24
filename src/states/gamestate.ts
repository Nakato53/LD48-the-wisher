import { State } from "../components/statestack"
import { ColorToFloat } from "../utils/color";
import Animation, { AnimationFrame, AnimationSet, AnimationType } from "../components/animation";
import MenuState from "./menustate";
import Player from "../entities/player";
import Camera from "../components/camera";
import Config from "../config";
import TransitionState from "./transitionstate";

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

        const previousRoomX = Math.floor(this.player.X / Config.GAME_WIDTH);
        const previousRoomY = Math.floor(this.player.Y / Config.GAME_HEIGHT);

        this.player.Update(dt);

        const currentRoomX = Math.floor(this.player.X / Config.GAME_WIDTH);
        const currentRoomY = Math.floor(this.player.Y / Config.GAME_HEIGHT);

        if (previousRoomX !== currentRoomX || previousRoomY !== currentRoomY) {
            this._stack.AddState(new TransitionState());
        }

        if (currentRoomX > previousRoomX) {
            Camera.MoveTo({x: Camera.x + Config.GAME_WIDTH, y: Camera.y})
        }

        if (currentRoomX < previousRoomX) {
            Camera.MoveTo({x: Camera.x - Config.GAME_WIDTH, y: Camera.y})
        }

        if (currentRoomY > previousRoomY) {
            Camera.MoveTo({x: Camera.x, y: Camera.y + Config.GAME_HEIGHT})
            this.player.Y += 10
        }

        if (currentRoomY < previousRoomY) {
            Camera.MoveTo({x: Camera.x, y: Camera.y - Config.GAME_HEIGHT})
        }
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
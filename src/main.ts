import Config from "./config";
import Game from "./game";
import TextureManager from "./managers/TextureManager";
import Static from "./static";
import Input from "./utils/input";
love.graphics.setDefaultFilter("nearest", "nearest");


let _renderscreen = love.graphics.newCanvas(Config.GAME_WIDTH, Config.GAME_HEIGHT);



love.load = () => {
    Static.TEXTURE_MANAGER = new TextureManager();
    Static.INPUT = new Input();
    
    Static.GAME = new Game();


    let mapdata = dofile("res/maps/demo.lua");
    print(mapdata.width);

};

love.update = (dt:number) => {
    Static.INPUT.Update(dt);
    Static.GAME.Update(dt);
}

love.draw = () => {
    love.graphics.setCanvas(_renderscreen)
    Static.GAME.Draw();
    love.graphics.setCanvas()
    love.graphics.draw(_renderscreen, 0, 0, 0, Config.GAME_SCALE, Config.GAME_SCALE);
    
};

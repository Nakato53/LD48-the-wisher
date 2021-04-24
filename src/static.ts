import Game from "./game";
import { TweenLib } from "./libs/Tween";
import TextureManager from "./managers/TextureManager";
import Input from "./utils/input";

export default class Static{
    public static GAME:Game;
    public static TEXTURE_MANAGER:TextureManager
    public static INPUT: Input;
    public static TWEEN: TweenLib;
}
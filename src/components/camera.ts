import Static from "../static";

export default class Camera {
    static x:number = -100
    static y:number = 0

    public static update():void {
        if (Static.INPUT.isDown("j")) {
            Camera.x --;
        }

        if (Static.INPUT.isDown("l")) {
            Camera.x ++;
        }

        if (Static.INPUT.isDown("i")) {
            Camera.y --;
        }
        
        if (Static.INPUT.isDown("k")) {
            Camera.y ++;
        }
    }
}
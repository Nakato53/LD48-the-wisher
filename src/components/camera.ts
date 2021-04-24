import { newPrismaticJoint } from "love.physics";
import Static from "../static";
import { lerp } from "../utils/distance";

export default class Camera {

    private static _localX:number = 0;
    private static _localY:number = 0;

    static x:number = 0
    static y:number = 0
    static moveEndsAt:number = null
    static originalPosition:any = null
    static moveProgress:number = 0
    static target:any = null

    static shakeX:number = 0;
    static shakeY:number = 0;

    public static Update(dt:number):void {
        if (Static.INPUT.isDown("j")) {
            Camera._localX --;
        }

        if (Static.INPUT.isDown("l")) {
            Camera._localX ++;
        }

        if (Static.INPUT.isDown("i")) {
            Camera._localY --;
        }
        
        if (Static.INPUT.isDown("k")) {
            Camera._localY ++;
        }

        if (Camera.target !== null) {
            Camera.moveProgress += dt
            const progress = Camera.moveProgress / Camera.moveEndsAt
            Camera._localX = Camera.originalPosition.x + ((Camera.target.x - Camera.originalPosition.x) * progress)
            Camera._localY = Camera.originalPosition.y + ((Camera.target.y - Camera.originalPosition.y) * progress)

            if (progress >= 1) {
                Camera._localX = Camera.target.x
                Camera._localY = Camera.target.y
                Camera.target = null
            }
        }
        Camera.shakeX = lerp(Camera.shakeX, 0, dt*5);
        Camera.shakeY = lerp(Camera.shakeY, 0, dt*5);

        Camera.x = Camera._localX + Camera.shakeX;
        Camera.y = Camera._localY + Camera.shakeY;


    }

    public static Shake(power:number){
        Camera.shakeX = love.math.random(power*2-power);
        Camera.shakeY = love.math.random(power*2-power);
    }

    public static MoveTo(target:any, duration:number = 1):void {
        Camera.moveProgress = 0
        Camera.moveEndsAt = duration
        Camera.target = target
        Camera.originalPosition = {x: Camera._localX, y:Camera._localY}
    }
}
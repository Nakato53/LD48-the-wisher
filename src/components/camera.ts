import { newPrismaticJoint } from "love.physics";
import Static from "../static";

export default class Camera {
    static x:number = 0
    static y:number = 0
    static moveEndsAt:number = null
    static originalPosition:any = null
    static moveProgress:number = 0
    static target:any = null

    public static Update(dt:number):void {
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

        if (Camera.target !== null) {
            Camera.moveProgress += dt
            const progress = Camera.moveProgress / Camera.moveEndsAt
            Camera.x = Camera.originalPosition.x + ((Camera.target.x - Camera.originalPosition.x) * progress)
            Camera.y = Camera.originalPosition.y + ((Camera.target.y - Camera.originalPosition.y) * progress)

            if (progress >= 1) {
                Camera.x = Camera.target.x
                Camera.y = Camera.target.y
                Camera.target = null
            }
        }
    }

    public static MoveTo(target:any, duration:number = 1):void {
        Camera.moveProgress = 0
        Camera.moveEndsAt = duration
        Camera.target = target
        Camera.originalPosition = {x: Camera.x, y:Camera.y}
    }
}
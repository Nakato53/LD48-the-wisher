/**
 * Convert a 255,255,255,255 kind of color to love 11 color format ( 1f,1f,1f,1f )
 * @param r the red
 * @param g the green
 * @param b the blue
 * @param a the alpha
 */
export function ColorToFloat(r:number, g:number, b:number, a:number = 255):[number, number, number, number]{
    return [r/255,g/255,b/255,a/255];
}

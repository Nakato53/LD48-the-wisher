export function distance(x1:number,y1:number,x2:number,y2:number):number{ 
    if(!x2) x2=0; 
    if(!y2) y2=0;
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}
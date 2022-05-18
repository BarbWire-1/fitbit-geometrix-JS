
import { constructWidgets, parseConfig } from "../construct-widgets";
import { dumpProperties, inspectObject } from "../devTools/";
import {validInput} from "./validation"

const construct = (el) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = el.getElementById("transform");
    const linesEl = el.getElementsByClassName("lines");
    const _style = el.style
   
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
    };
    
    let  next
//    
            // Initialisation:
            (function () {    // we use an IIFE so that its memory can be freed after execution

                parseConfig(el, attribute => {
                    // This anonymous function is called for every attribute in config.
                    // attribute is {name:attributeName, value:attributeValue}
                    switch (attribute.name) {

                        case 'radius':
                            el.radius = Number(attribute.value) ?? 100;
                            break;
                        case 'points':
                            el.points = Number(attribute.value)?? 5;
                            break;
                        case 'strokeWidth':
                            el.strokeWidth = Number(attribute.value)?? 4;
                            break;
                        case 'next':
                            el.next = Number(attribute.value)?? 1;
                            break;
                        case 'rotate':
                            //WHY NOT JUST <rotate> here???
                            el.rotate = transformEl.groupTransform.rotate.angle = Number(attribute.value) ?? 0;
                            break;
                        case 'scale':
                            //WHY NOT JUST <rotate> here???
                            el.scale = transformEl.groupTransform.scale.x
                                = transformEl.groupTransform.scale.y
                                = Number(attribute.value) ?? 1;
                            break;

                    }
                });
                


            })();

           

        //THE MATHS
        //const _recalc() {
            
            //TODO do calculating and assigning in one?
            //set all not "used" lines to 'none'
            linesEl.forEach(el => {
                el.style.display = 'none'
            });
            let p = []

            //recalc radius depending on strokeW to fit inside
            let iRadius = el.radius;
            iRadius -= Math.round(el.strokeWidth / 2);
            const fract = (2 * Math.PI / el.points);

            let i = 0;
            while (i < el.points) {
                p.push(new Point(0, 0))

                //calcs x,y to start pt0 at (0,-radius)relative to PolygonCenter
                //to start at top, running clockwise
                p[ i ].x = Math.round(iRadius * Math.sin(i * fract));
                p[ i ].y = Math.round(iRadius * -Math.cos(i * fract));
                i++;
            };
             
            //sets coords of lines depending on points p and <next> 
            i = 0;
            let npt = el.next ?? next;// TODO this is extremly strange: one working for js, one for svg. I made a mess, I fear
            while (i < el.points) {

                let l = linesEl[ i ];
                l.style.strokeWidth = el.strokeWidth;
                l.style.display = 'inline'
                //start points
                l.x1 = p[ i ].x;
                l.y1 = p[ i ].y;

                //end points
                
                let nextPt = p[ (i + npt) % el.points ] ?? p[ 0 ];
                l.x2 = nextPt.x;
                l.y2 = nextPt.y;
                i++;
            };

     
    
    // dumpProperties('el', el)
     inspectObject('el', el)

  return el;
};

constructWidgets('polygon', construct);

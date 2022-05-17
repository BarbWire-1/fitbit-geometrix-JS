
import { constructWidgets, parseConfig } from "../construct-widgets";
//import { dumpProperties, inspectObject } from "../devTools/";
import {validInput} from "./validation"

const construct = (el, radius = 100, points = 5, strokeWidth = 4, next = 1) => {
    //GET ELEMENTS FOR POLYGON
    const transform = el.getElementById("transform");
    const outerLines = el.getElementsByClassName("lines");
   
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
    };
    
    
    let radius,rotate,scale;
    class Polygon {
        constructor() {
           
            // Initialisation:
            (function () {    // we use an IIFE so that its memory can be freed after execution

                parseConfig(el, attribute => {
                    // This anonymous function is called for every attribute in config.
                    // attribute is {name:attributeName, value:attributeValue}
                    switch (attribute.name) {

                        case 'radius':
                            radius = Number(attribute.value);
                            break;
                        case 'points':
                            points = Number(attribute.value);
                            break;
                        case 'strokeWidth':
                            strokeWidth = Number(attribute.value);
                            break;
                        case 'next':
                            next = Number(attribute.value);
                            break;
                        case 'rotate':
                            //WHY NOT JUST <rotate> here???
                            rotate = transform.groupTransform.rotate.angle = Number(attribute.value);
                            break;

                    }
                });


            })();

            this.id = el.id;
            this.radius = radius;
            this.points = points;
            this.strokeWidth = strokeWidth;
            this.redraw = this._recalc();
            this.lines = outerLines;
            this.rotate = rotate
            this.scale = scale;
            this.next = next ?? 1;
    
        };

        //THE MATHS
        _recalc() {
            
            //TODO do calculating and assigning in one?
            //set all not "used" lines to 'none'
            outerLines.forEach(el => {
                el.style.display = 'none'
            });
            let p = []

            //recalc radius depending on strokeW to fit inside
            let iRadius = this.radius;
            iRadius -= Math.round(this.strokeWidth / 2);
            const fract = (2 * Math.PI / this.points);

            let i = 0;
            while (i < this.points) {
                p.push(new Point(0, 0))

                //calcs x,y to start pt0 at (0,-radius)relative to PolygonCenter
                //to start at top, running clockwise
                p[ i ].x = Math.round(iRadius * Math.sin(i * fract));
                p[ i ].y = Math.round(iRadius * -Math.cos(i * fract));
                i++;
            };
             
            //sets coords of lines depending on points p and <next> 
            i = 0;
            let npt = next;// TODO why this.next is undefined if not set from js?
            while (i < this.points) {

                let l = outerLines[ i ];
                l.style.strokeWidth = this.strokeWidth;
                l.style.display = 'inline'
                //start points
                l.x1 = p[ i ].x;
                l.y1 = p[ i ].y;

                //end points
                
                let nextPt = p[ (i + npt) % this.points ] ?? p[ 0 ];
                l.x2 = nextPt.x;
                l.y2 = nextPt.y;
                i++;
            };

        };
    };
    
    
    // Properties set on <use>
    Object.defineProperty(el, 'lines', {
        get() { return el.lines },
        
    })
    Object.defineProperty(el, 'rotate', {
        get() { return rotate },
        // equal rotate too to be able to log, as not in _recalc()
        set(newValue) { rotate = transform.groupTransform.rotate.angle = newValue }

    })
    //this doesn't only influence radius, but also strokeWidth!!!
    // split into x, y object?
    Object.defineProperty(el, 'scale', {
        get() { return scale },
        // equal scale too to be able to log, as not in _recalc()
        set(newValue) {
            scale =
                transform.groupTransform.scale.x
                = transform.groupTransform.scale.y
                = newValue;
        }
    });
    Object.defineProperty(el, 'radius', {
        get() { return radius },
        set(newValue) {
            el.radius = newValue;
            el._recalc()
        }
    });
    Object.defineProperty(el, 'next', {
        get() { return next },
        set(newValue) {
            next = el.next = newValue;
            el._recalc();
        }
    })
    Object.defineProperty(el, 'points', {
        get() { return points },
        set(newValue) {
            el.points = newValue;
            el._recalc();
        }
    })
    Object.defineProperty(el, 'strokeWidth', {
        get() { return strokeWidth },
        set(newValue) {
            console.log(newValue);
            el.strokeWidth = newValue;
            el._recalc();
        }
    })

    el = Object.seal(new Polygon())
        
        
    
    
    // dumpProperties('el', el)
    // inspectObject('el', el)

  return el;
};

constructWidgets('polygon', construct);

//TODO define obj props/API on el: mode, points, radius, lines, next,rotate, scale...style (?)
// dumpProperties shows wanted structure for el here in widget, but not on use ??? why???
// seems I haven't isolated the properties
// API???!!!

//TODO: make a style obj, a settings obj and a transform object?
// style on use and on lines directly (fill, opacity, display)
// settings on use (points, radius, strokeWidth, next, x,y)
// transform on use (rotate, scale)

//This approach is somehow working, but WRONG!!!???
// <el> does have own properties only, but dumping <use> shows whole prototype-chain??
// and none of the Polygon-properties.
// I actually don't know how to creacte the widgetAPI to achieve an independent object, 
// although it`s working as desired, I don't like the structure 

//TODO  implement validation? or remove it?

// TODO remove class Polygon and go on el directly instead?
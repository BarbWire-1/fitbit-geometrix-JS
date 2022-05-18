
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
    
    let radius, next
    // FUNCTIONS------------------------------------------------------------------------
    /**
     * FUNCTION TO DEFINE PROPERTY
     * (getter/setter optional bound to different objects)
     * @param {*} obj    object to set prop on. Depending on use case this or el
     * @param {*} prop   property
     * @param {*} target outer object to apply property
     * @param {*} source optional object to read property, if not set = target
     */
    const defineProp = (obj, prop, target, source = target) => {
        Object.defineProperty(obj, prop, {
            set(newValue) { target[ prop ] = newValue; },
            get() { return source[ prop ] },
        });
    };
    // FUNCTION TO DEFINE LINESPROPERTIES (STYLE)
    // pass to all subElements
    function passStyleToAll(obj, prop) {
        const equalAll = (prop, value) => {
            linesEl.forEach(sub => {
                sub[ prop ] = value;
            })
        };
// 
//         Object.defineProperty(obj, prop, {
//             set(newValue) { equalAll(prop, newValue) },
//             //added getter here to be able to use text.length
//             get() { return el[ prop ] },
//             enumerable: true
//         });
    };
    
    
    // style properties applicable to widget (useElement)
    class StyleWidget {
        constructor(_style) {
            
            //pass style from el._style to all lineElements
            passStyleToAll(el, 'opacity');
            passStyleToAll(el, 'display');
            passStyleToAll(el, 'fill')
        }
    };
    
    // CREATE API's-------------------------------------------------------------------
    // FUNCTION TO EXPOSE TO CORRESPONDING OBJECT
    function connectAPI(subElement, API) {
        Object.defineProperty(el, subElement, {
            get() { return API; },
        });
    };

    //creates main: opacity, display, getBBox()
    let linesAPI = linesEl.forEach(line => {
        Object.seal({
            style: Object.seal(new StyleWidget(line.style)),
        })  
    });
    
    
    
    // CONNECT OUTER TO VIRTUAL STYLE
    // creates widget-use(instance): text-related, mainEl.fill, el.getBBox(), all useOwn
    let widgetStyleAPI = Object.seal({
        style: Object.seal(new StyleWidget(_style)),
        lines: connectAPI('lines', linesAPI),
        
        enumerable: true,
    });
    
    
    //let radius,rotate,scale;
   
       
           
           
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

       
        
    

    
//     //rotate not working, needs to equal to groupTransfom
//  
//     const settings =['radius', 'points', 'strokeWidth', 'next'];
// 
//     settings.forEach((prop) => {
//             Object.defineProperty(el, prop, {
//                 get key() { return prop; },
//                 set(newValue) {
//                     el[ prop ] = newValue;
//                     console.log(`setter: ${el.prop}`);//there is really a mess with private and outer, el and this.
//                     //<next> from js gets read and applied but can't log el.prop here (undefined)
//                     el._recalc();
//                 },
//                 // iterable: true,
//                 // enumerable: true,
//             });
//         });
//     
    
    
    
    //Properties set on <use>
    // Object.defineProperty(el, 'lines', {
    //     get() { return linesAPI},
    //     
    // });
//     Object.defineProperty(el, 'rotate', {
//         get() { return el.rotate },
//         // equal rotate too to be able to log, as not in _recalc()
//         set(newValue) {transformEl.groupTransform.rotate.angle = newValue }
// 
//     });
//     //this doesn't only influence radius, but also strokeWidth!!!
//     // split into x, y object?
//     Object.defineProperty(el, 'scale', {
//         get() { return  el.scale },
//         // equal scale too to be able to log, as not in _recalc()
//         set(newValue) {
//            
//                 transformEl.groupTransform.scale.x
//                 = transformEl.groupTransform.scale.y
//                 = newValue;
//         }
//     });
    // Object.defineProperty(el, 'radius', {
    //     get() { return el.radius },
    //     set(newValue) {
    //         el.radius = newValue;
    //         el._recalc()
    //     }
    // });
    // Object.defineProperty(el, 'next', {
    //     get() { return el.next },
    //     set(newValue) {
    //         next = el.next = newValue;
    //         el._recalc();
    //     }
    // })
    // Object.defineProperty(el, 'points', {
    //     get() { return el.points },
    //     set(newValue) {
    //         el.points = newValue;
    //         el._recalc();
    //     }
    // })
    // Object.defineProperty(el, 'strokeWidth', {
    //     get() { return el.strokeWidth },
    //     set(newValue) {
    //         console.log(newValue);
    //         el.strokeWidth = newValue;
    //         el._recalc();
    //     }
    // })

    //el = Object.seal(new Polygon())
        
        
    
    
    // dumpProperties('el', el)
     inspectObject('el', el)

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
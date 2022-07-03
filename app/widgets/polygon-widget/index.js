
'use strict';

import { constructWidgets, parseConfig } from "../construct-widgets";
import { inspectObject } from "../devTools";
//import { dumpProperties, inspectObject } from "../devTools/";
import {validInput} from "./validation"

export const createPolygon = (useEl) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = useEl.getElementById("transform");// needed to rotate/scale
    const linesEl = useEl.getElementsByClassName("lines");// needed to iterate
    
    // PRIVATE VARS (abstract settings)
    // defaults set in symbol config.text
    let _radius, _points, _rotate, _next, _strokeWidth, _scale, _style, _lines
    
    // INITIALISATION:
    (function () {   //IIFE
        
        parseConfig(useEl, attribute => {
            // This anonymous function is called for every attribute in config.
            // attribute is {name:attributeName, value:attributeValue}
            switch (attribute.name) {

                case 'radius':
                   useEl.radius  = _radius = Number(attribute.value);
                    break;
                case 'points':
                    useEl.points = _points = Number(attribute.value);
                    break;
                case 'strokeWidth':
                     useEl.strokeWidth = _strokeWidth = Number(attribute.value);
                    break;
                case 'next':
                    useEl.next = _next = Number(attribute.value);
                    break;
                case 'rotate':
                    useEl.rotate  = _rotate = transformEl.groupTransform.rotate.angle = Number(attribute.value);
                    break;
            
            };
        });
        
    })();
    

    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        };
    };
   
    // CALCULATE POINTS AND APPLY TO LINES
    const recalc = () => {
        
        // set all lines (back) to 'none'
        linesEl.forEach(line => {
            line.style.display = 'none'
        });
        // array to keep calculated point-objects for further use in connecting lines
        let p = []

        // recalc radius depending on strokeW to fit inside
        let iRadius = _radius;
        iRadius -= Math.round(_strokeWidth  / 2);
        const fract = (2 * Math.PI / _points);

        let i = 0;
        // calculate and write points to array
        while (i < _points) {
            p.push(new Point(0, 0))
            // calculates x,y to start pt0 at (0,-radius)relative to PolygonCenter
            // to start at top, running clockwise
            p[ i ].x = Math.round(iRadius * Math.sin(i * fract));
            p[ i ].y = Math.round(iRadius * -Math.cos(i * fract));
            i++;
        };
             
        //sets coords of lines depending on _points p and <_next> 
        i = 0;
        let npt = _next
        while (i < _points) {

            let l = linesEl[ i ];
            //TODO do this connection to element somewhere else later to keep abstract here?
            l.style.strokeWidth = _strokeWidth;
            // set 'used' lines to 'inline'
            l.style.display = 'inline';
                
            //start _points
            l.x1 = p[ i ].x;
            l.y1 = p[ i ].y;

            //end points
            let nextPt = p[ (i + npt) % _points ] ?? p[ 0 ];
            l.x2 = nextPt.x;
            l.y2 = nextPt.y;
            i++;
        };
    };
    
   
    // create style-Objects
    ; (function () { //IIFE
        'use strict'
        _lines = [];
        const createStyleObject = (ele) => ({
            
            get style() {
                
                return {
                    set fill(newValue) { ele.style.fill = newValue },
                    set opacity(newValue) { ele.style.opacity = newValue },
                    set display(newValue) { ele.style.display = newValue },
                }
            },
           
        });
        //TODO why aren't the style objects sealed??
        // Array of line-style-objects to only expose style
        linesEl.forEach(line => _lines.push(Object.seal(createStyleObject(line))));
        // private style-object containing (!) style
        // set on useEl (ugly but ...)
        _style = Object.seal(createStyleObject(useEl));
  
    }());
   
    Object.seal(_style.style)

    //CREATE AN OBJECT INCLUDING ALL EXPOSED PROPERTIES
    const createPolygonWidget = (ele) => ({
       
        // settings directly applied to useEl
        get style() { return _style.style },//TODO haha...
        get lines() {return _lines },
        get x() { return ele.x },
        set x(newValue) { ele.x = newValue },
        get y() { return ele.y },
        set y(newValue) { ele.y = newValue },
        
        // following get applied to 'real' elements
        get strokeWidth() { return ele.strokeWidth },
        set strokeWidth(newValue) {
            _strokeWidth = newValue;// gets passed inside recalc()
            recalc();
        },  
        get rotate() {
            return {
                get angle() { return transformEl.groupTransform.rotate.angle },
                set angle(newValue) { transformEl.groupTransform.rotate.angle = newValue },
            }
        },
        // set rotate(newValue) {
        //     transformEl.groupTransform.rotate.angle = newValue;
        // },
        get scale() {
            return {
                get x() { return transformEl.groupTransform.scale.x},
                set x(newValue) { transformEl.groupTransform.scale.x = newValue },
                get y() { return transformEl.groupTransform.scale.y},
                set y(newValue) { transformEl.groupTransform.scale.y = newValue }
            }
        },
        
        // abstract settings only used for recalc()
        get next() { return ele.next },
        set next(newValue) {
            _next = newValue;
            recalc();
        },
        get radius() { return ele.radius },
        set radius(newValue) {
            _radius = newValue;
            recalc();
        },
        get points() { return ele.points },
        set points(newValue) {
            _points = newValue;
            recalc();
        }, 
    });
   
   // ABSTRACT SETTINGS NEED TO BE DEFINED ON useEl SEPARATELY(??)
    Object.defineProperty(useEl, 'radius', {
        get() { return _radius },
        set(newValue) { _radius = newValue; }
    });
    Object.defineProperty(useEl, 'points', {
        get() { return _points },
        set(newValue) { _points = newValue; }
    });
    Object.defineProperty(useEl, 'next', {
        get() { return _next },
        set(newValue) { _next = newValue; }
    });
    // Object.defineProperty(useEl, 'scale', {
    //     get() { return _scale },
    //     set(newValue) { _scale = newValue; }
    // });
  
    
    recalc();
    //inspectObject('useEl', useEl)
    return Object.seal(createPolygonWidget(useEl));
    
};
//now construct in app/index
constructWidgets('polygon');

//TODO i wonder, why style and lines are working excpt missing error on assigning unexposed attributes.
// the are actuall recognized as any, not as objects
// inspecting shows empty object (???)

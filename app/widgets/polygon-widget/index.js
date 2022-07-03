
'use strict';

import { constructWidgets, parseConfig } from "../construct-widgets";
import { inspectObject } from "../devTools";
//import { dumpProperties, inspectObject } from "../devTools/";
import {validInput} from "./validation"

export const createPolygon = (useEl) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = useEl.getElementById("transform");// needed to rotate/scale
    const linesEl = useEl.getElementsByClassName("lines");// needed to iterate
    
    let transform = transformEl.groupTransform
    
    
    // TODO sort these...
    // PRIVATE VARS (abstract settings)
    // defaults set in symbol config.text
    let _radius, _points, _rotate, _next, _strokeWidth, _scale, _style, _linesStyle
    
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
                    useEl.rotate  = _rotate = transform.rotate.angle = Number(attribute.value);
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
    
  
    // Array of line-style-objects to only expose style
    !function() { //IIFE
        _linesStyle = [];
        const createStyleObject = (ele) => ({
            get style() {
                return {
                    set fill(newValue) { ele.style.fill = newValue },
                    // get fill() {return ele.style.fill}
                }
            },
        });
       linesEl.forEach(line => _linesStyle.push(Object.seal(createStyleObject(line))));
    }();
    // TODO why is _linesStyle just shown as <any> in app.index?
    // find a nicer solution for linesStyle?
    Object.seal(_linesStyle)

    //CREATE AN OBJECT INCLUDING ALL EXPOSED PROPERTIES
    const createPolygonWidget = (ele) => ({
      
        get style() {
            return {
                set fill(newValue) { ele.style.fill = newValue },
                set opacity(newValue) { ele.style.opacity = newValue },
                set display(newValue) { ele.style.display = newValue },
            }
        },
        
        get lines() {return _linesStyle },// individual style: fill only!! else inherited from useEl
        
        //get x() { return ele.x },
        set x(newValue) { ele.x = newValue },
        // get y() { return ele.y },
        set y(newValue) { ele.y = newValue },
        
        // following get applied to 'real' elements
        get strokeWidth() { return ele.strokeWidth },
        set strokeWidth(newValue) {
            _strokeWidth = newValue;// gets passed inside recalc()
            recalc();
        },  
        get rotate() {
            return {
                //get angle() { return transform.rotate.angle },
                set angle(newValue) { transform.rotate.angle = newValue },
            }
        },
        get scale() {
            return {
                //get x() { return transform.scale.x},
                set x(newValue) { transform.scale.x = newValue },
                //get y() { return transform.scale.y},
                set y(newValue) { transform.scale.y = newValue }
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
        set(newValue) { _radius = newValue;}
    });
    Object.defineProperty(useEl, 'points', {
        get() { return _points },
        set(newValue) { _points = newValue; }
    });
    Object.defineProperty(useEl, 'next', {
        get() { return _next },
        set(newValue) { _next = newValue;}
    });
   
    // to draw uses on start:
    recalc();
    
    // check for number of points (int betwenn 3 to 12)
    if (validInput(useEl.points) === true) {
        return Object.seal(createPolygonWidget(useEl));
    };
    
   
    
};
//now construct in app/index
constructWidgets('polygon');

// TODO possible to force break for invalid input??
// TODO possible to detect, where the invalid input is located (for error message)?
// TODO installation/usage, make this one a demo
// TODO remove unnecessary getters
/**
* MIT License

Copyright (c) 2022 Barbara Kälin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { constructWidgets, parseConfig } from "../construct-widgets";
import { inspectObject } from "../devTools";
//import { dumpProperties, inspectObject } from "../devTools/";
import {validInput} from "./validation"

export const construct = (useEl) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = useEl.getElementById("transform");
    const linesEl = useEl.getElementsByClassName("lines");
    
   
    const elStyle = useEl.style
  
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        };
    };
    
    // PRIVATE VARS
    // these are abstract settings only used for calculating with no real 
    // relation to any SVG-element!
    // defaults set in symbol config.text
    let _radius, _points, _rotate, _next, _strokeWidth, _scale
    
   
        
    
    
   
    
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
                case 'scale':
                    useEl.scale = _scale = transformEl.groupTransform.scale.x
                        = transformEl.groupTransform.scale.y
                        = Number(attribute.value);
                    break;
                case 'lines':
                    useEl.lines = linesEl

            };
        });
        
     })();
    
   //linesEl.forEach(line => { line.style = el.style })//TypeError: Invalid argument type.
   
    // CALCULATE POINTS AND APPLY TO LINES
    const recalc = () => {
        
        // set all lines (back) to 'none'
        // TODO only necessary if points != previous.
        // better check for that or just change for any recalc()???
        // possible to include this in setter for <points>? Perhaps???
        linesEl.forEach(line => {
            line.style.display = 'none'
        });
        // array to keep calculated point-objects for further use in connecting lines
        let p = []

        // recalc radius depending on strokeW to fit inside
        let iRadius = _radius ?? 100;
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
   
   // ABSTRACT SETTINGS NEED TO BE DEFINED ON useEl SEPARATELY
    Object.defineProperty(useEl, 'radius', {
        get() { return _radius },
        set(newValue) {
            _radius = newValue;
            recalc()
        }
    });
    Object.defineProperty(useEl, 'points', {
        get() { return _points },
        set(newValue) {
            _points = newValue;
            recalc()
        }
    });
    Object.defineProperty(useEl, 'next', {
        get() { return _next },
        set(newValue) {
            _next = newValue;
            recalc()
        }
     });
    Object.defineProperty(useEl, 'rotate', {
        get() { return _rotate},
        set(newValue) {
            _rotate = newValue;
        }
    });
    Object.defineProperty(useEl, 'scale', {
        get scale() {
            return {
                get x() { return _scale.x },
                set x(newValue) { _scale.x= newValue },
                get y() { return _scale.y },
                set y(newValue) { _scale.y=  newValue }
            }
        }
    })
    
    //CREATE AN OBJECT INCLUDING ALL EXPOSED PROPERTIES
    const createPolygonWidget = (element) => ({  
        get style() {
            return {
                get fill() { return element.style.fill },
                set fill(color) { element.style.fill = color }
            }
        },
        get next() { return _next },
        set next(newValue) {
         _next = newValue;
            recalc();
        },
        get radius() { return _radius },
        set radius(newValue) {
            _radius = newValue;
            console.log(_radius)
            recalc();
        },
        get rotate() { return _rotate },
        set rotate(newValue) {
            transformEl.groupTransform.rotate.angle = newValue;
            recalc();
        },
        get points() { return _points },
        set points(newValue) {
            _points = newValue;
            recalc();
        },
        get strokeWidth() { return _strokeWidth },
        set strokeWidth(newValue) {
            _strokeWidth = newValue;
            recalc();
        },
        get lines() {
           //TODO create style obj element.children.forEach
            //return linesEl;
            return {
                get style() {
                    return {
                        get fill() { return element.style.fill },
                        set fill(color) { element.style.fill = color }
                    }
                },
            } 
        },
       // get settings() { return configEl },
        //TODO define scale
        get scale() {
            return {
                get x() { return _scale.x },
                set x(newValue) { transformEl.groupTransform.scale.x = newValue },
                get y() { return _scale.y },
                set y(newValue) { transformEl.groupTransform.scale.y = newValue }
            }
        }
       
       
        

    })
    
    recalc();
    return createPolygonWidget(useEl);
    
};

constructWidgets(construct, 'polygon');


//TODO 0
//CREATE STYLE ON LINES
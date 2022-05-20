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
import { dumpProperties, inspectObject } from "../devTools/";
import {validInput} from "./validation"

const construct = (el) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = el.getElementById("transform");
    const linesEl = el.getElementsByClassName("lines");
    const _style = el.style
    
//     let elStyle = el.style
// 
//     class PolygonStyle {
//         constructor(elStyle) {
//             //this.opacity = opacity;
//             // this.display = display;
//             // this.fill = fill;
//             Object.defineProperty(this, 'opacity', {
// 
//                 set(newValue) { elStyle.opacity = newValue }
//             });
//             Object.defineProperty(this, 'display', {
//                 set(newValue) { elStyle.display = newValue }
//             });
//             Object.defineProperty(this, 'fill', {
//                 set(newValue) { elStyle.fill = newValue },
//             })
//             Object.defineProperty(this, 'strokeWidth', {
//                 set(newValue) { elStyle.strokeWidth = newValue }
//             })
//         }
// 
//     };
// 
//     let lineStyle = Object.seal(new PolygonStyle(elStyle))
// 
//     dumpProperties('lineStyle', lineStyle, 1)
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        };
    };
//     class Line extends PolygonStyle {
//         constructor(elStyle) {
//             super(elStyle)
//             this.style = lineStyle
//         }
// 
//     };
//     let lineAPI = Object.seal({
//         style: new Line()
//     });
//     
//     let lines = []
//    linesEl.forEach(line => {
//        lines.push(Object.seal({ style: new Line(line) }) ) 
//     })
    //console.log(lines[ 0 ])

    // PRIVATE VARS AND DEFAULTS
    let _radius = el.radius ?? 100;
    let _points = el.points ?? 5;
    let _next = el.next ?? 1;
    let _strokeWidth = el.strokeWidth ?? 4;
    
    // INITIALISATION:
    (function () {   //IIFE
        
        parseConfig(el, attribute => {
            // This anonymous function is called for every attribute in config.
            // attribute is {name:attributeName, value:attributeValue}
            switch (attribute.name) {

                case 'radius':
                    el.radius = _radius = Number(attribute.value);
                    break;
                case 'points':
                    el.points = Number(attribute.value);
                    break;
                case 'strokeWidth':
                    el.strokeWidth = Number(attribute.value);
                    break;
                case 'next':
                    el.next = Number(attribute.value);
                    break;
                case 'rotate':
                    el.rotate = transformEl.groupTransform.rotate.angle = Number(attribute.value);
                    break;
                case 'scale':
                    el.scale = transformEl.groupTransform.scale.x
                        = transformEl.groupTransform.scale.y
                        = Number(attribute.value);
                    break;

            };
        });
        
    })();
    
    
   
    // CALCULATE POINTS AND APPLY TO LINES
    const redraw = (el) => {
        
        // set all lines (back) to 'none'
        // TODO only necessary if points != previous.
        // better check for that or just change for any redraw()???
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
             
        //sets coords of lines depending on points p and <next> 
        i = 0;
        let npt = _next
        while (i < _points) {

            let l = linesEl[ i ];
            //TODO do this connection to element somewhere else later to keep abstract here?
            l.style.strokeWidth = _strokeWidth;
            // set 'used' lines to 'inline'
            l.style.display = 'inline';
                
            //start points
            l.x1 = p[ i ].x;
            l.y1 = p[ i ].y;

            //end points
            let nextPt = p[ (i + npt) % _points ] ?? p[ 0 ];
            l.x2 = nextPt.x;
            l.y2 = nextPt.y;
            i++;
        };
    };
    // calculate and layout lines
    redraw();
    
    let rotate , scale
    //let lines = linesEl
   
    // Properties set on <use>
    Object.defineProperty(el, 'lines', {
        get() { return linesEl },
    });
    
    Object.defineProperty(el, 'rotate', {
        get() { return rotate },
        // equal rotate too to be able to log, as not in _recalc()
        set(newValue) { rotate = transformEl.groupTransform.rotate.angle = newValue }

    })
    //this doesn't only influence radius, but also strokeWidth!!!
    // split into x, y object?
    Object.defineProperty(el, 'scale', {
        get() { return scale },
        // equal scale too to be able to log, as not in _recalc()
        set(newValue) {
            scale =
                transformEl.groupTransform.scale.x
                = transformEl.groupTransform.scale.y
                = newValue;
        }
    });
    Object.defineProperty(el, 'radius', {
        get() { return _radius },
        set(newValue) {
            _radius = newValue;
            redraw()
        }
    });
    Object.defineProperty(el, 'next', {
        get() { return _next },
        set(newValue) {
            _next =  newValue;
            redraw();
        }
    })
    let points
    Object.defineProperty(el, 'points', {
        get() { return _points },
        set(newValue) {
            _points = newValue;
            redraw();
        }
    })
    Object.defineProperty(el, 'strokeWidth', {
        get() { return _strokeWidth },
        set(newValue) {
            console.log(newValue);
            _strokeWidth = newValue;
            redraw();
        }
    })
    
    // values get applied and logged. So step 1, 
    // BUT: only mem of el if set in config!!
    // those set in js get read as undefined values in el here
    //(check relation inner/outer - abstract/applied... 🤯 🔫)
    // TODO write constructure, restrict access/inheritance
    // try to create style on linesEl.forEach as own object?
   
    //dumpProperties('el', el)
    
    //inspectObject('el', el)
    
    

    
    
    
    
    
    
    
    
    return el;
    
};

constructWidgets('polygon', construct);

//TODO 0
/**
 * 
 * APIs:
 * el:      
 *          radius, points, next (abstract values only) + redraw()
 *          strokeWidth => lines.forEach.style.strokeWidth + redraw()
 *          rotate, scale => transformEl.groupTransform
 *          lines (array!)
 *          (use just style and x,y of use for el, or make own?)
 * 
 * lines:
 *          forEach(!!!)
 *          style ONLY!
 */

// TODO test creating abstract prototype and creating el from there?
// needs to have class line as can't firgure out how to set props on linesEL.forEach?

//All in all: working, but still not happy as I can't find a nice solution to restrict access and "cut" from prototype-chain 

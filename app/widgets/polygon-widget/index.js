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
    
   
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        };
    };
    
    // INITIALISATION:
    (function () {   //IIFE
        
        parseConfig(el, attribute => {
            // This anonymous function is called for every attribute in config.
            // attribute is {name:attributeName, value:attributeValue}
            switch (attribute.name) {

                case 'radius':
                    el.radius = Number(attribute.value);
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
    
    // PRIVATE VARS AND DEFAULTS
    let _radius = el.radius ?? 100;
    let _points = el.points ?? 5;
    let _next = el.next ?? 1;
    let _strokeWidth = el.strokeWidth
        //TODO why does this bring wrong result? overwrites el2 with el1 value??
        // = linesEl.forEach(line => {
        //     line.style.strokeWidth
        // }) 
        ?? 4;
        

    // CALCULATE POINTS AND APPLY TO LINES
    const redraw = () => {
        
        // set all lines (back) to 'none'
        // TODO only necessary if points != previous.
        // better check for that or just change for any redraw()???
        // possible to include this in setter for <points>? Perhaps???
        linesEl.forEach(line => {
            line.style.display = 'none'
        });
        // array to keep calculated points for further use in connecting lines
        let p = []

        // recalc radius depending on strokeW to fit inside
        let iRadius = _radius ?? 100;
        iRadius -= Math.round(_strokeWidth  / 2);
        const fract = (2 * Math.PI / _points);

        let i = 0;
        // calculate and write points to array
        while (i < _points) {
            p.push(new Point(0, 0))
            //calcs x,y to start pt0 at (0,-radius)relative to PolygonCenter
            //to start at top, running clockwise
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
    // calculate and layout
    redraw();
    
    // dumpProperties('el', el)
    inspectObject('el', el)

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


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
    
    const elStyle = el.style
  
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        };
    };
    
    // // PRIVATE VARS AND DEFAULTS
    // let _radius = el.radius ?? 100;
    // let _points = el.points ?? 5;
    // let _next = el.next ?? 1;
    // let _strokeWidth = el.strokeWidth ?? 4;
    // FUNCTIONS------------------------------------------------------------------------
    /**
     * FUNCTION TO DEFINE PROPERTY
     * (getter/setter optional bound to different objects)
     * @param {*} obj    object to set prop on. Depending on use case this or el
     * @param {*} prop   property
     * @param {*} target outer object to apply property
     * @param {*} source optional object to read property, if not set = target
     */
    const defineProp = (obj, prop, target=obj) => {
        Object.defineProperty(obj, prop, {
            set(newValue) { prop = newValue; },
            get() { return  prop  },
        });
    };
    //defineProp(el, 'points')
    // FUNCTION TO DEFINE TEXTPROPERTIES
    // pass to all subElements
    function passStyleToAll(obj, prop) {
        const equalAll = (prop, value) => {
            linesEl.forEach(line => {
               line[ prop ] = value;
            })
        };

        Object.defineProperty(obj, prop, {
            set(newValue) { equalAll(prop, newValue) },
            //added getter here to be able to use text.length
            get() { return el[ prop ] },
            enumerable: true
        });
    };
    class StyleWidget {
        constructor(elStyle) {
            //super(elStyle);
            //pass text-style from el._style to all
            passStyleToAll(this, 'display');
            passStyleToAll(this, 'opacity');
            passStyleToAll(this, 'fill');
            passStyleToAll(this, 'strokeWidth');
            
        }
    };
    
    // CREATE API's-------------------------------------------------------------------
    // FUNCTION TO EXPOSE TO CORRESPONDING OBJECT
    function connectAPI(subElement, API) {
        Object.defineProperty(el, subElement, {
            get() { return API; },
        });
    };
    let linesAPI = []
    linesEl.forEach(line => {
        linesAPI.push(
            Object.seal({
                style: Object.seal(new StyleWidget(line.style)),
            })
        )
    });
    
    
    // let widgetStyleAPI = Object.seal({
    //     //we kept a reference to the real .style in _style
    //     style: Object.seal(new StyleWidget(elStyle)),
    //     lines: connectAPI('lines', linesAPI),
    //     //get lines() {return linesEl},
    //     set points(newValue) { points = newValue; el.redraw() },
    //     set next(newValue) { next = newValue; redraw() },
    //     set strokeWidth(newValue) { strokeWidth = newValue; redraw() },
    //     set radius(newValue) { radius = newValue; redraw() },
    //     set rotate(newValue) { transformEl.groupTransform.rotate.angle= newValue },
    //     set scale(newValue) {
    //         transformEl.groupTransform.scale.x
    //             = transformEl.groupTransform.scale.y
    //             = newValue;
    //         },
    //    
    //     get() { return widgetStyleAPI; },//seems not to be needed
    //     enumerable: true,
    // });
        
        
    
    
   
    
    // INITIALISATION:
    (function () {   //IIFE
        
        parseConfig(el, attribute => {
            // This anonymous function is called for every attribute in config.
            // attribute is {name:attributeName, value:attributeValue}
            switch (attribute.name) {

                case 'radius':
                    el.radius =  Number(attribute.value);
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
    
   //linesEl.forEach(line => { line.style = el.style })//TypeError: Invalid argument type.
   
    // CALCULATE POINTS AND APPLY TO LINES
    const redraw = () => {
        
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
        let iRadius = el.radius ?? 100;
        iRadius -= Math.round(el.strokeWidth  / 2);
        const fract = (2 * Math.PI / el.points);

        let i = 0;
        // calculate and write points to array
        while (i < el.points) {
            p.push(new Point(0, 0))
            // calculates x,y to start pt0 at (0,-radius)relative to PolygonCenter
            // to start at top, running clockwise
            p[ i ].x = Math.round(iRadius * Math.sin(i * fract));
            p[ i ].y = Math.round(iRadius * -Math.cos(i * fract));
            i++;
        };
             
        //sets coords of lines depending on points p and <next> 
        i = 0;
        let npt = el.next
        while (i < el.points) {

            let l = linesEl[ i ];
            //TODO do this connection to element somewhere else later to keep abstract here?
            l.style.strokeWidth = el.strokeWidth;
            // set 'used' lines to 'inline'
            l.style.display = 'inline';
                
            //start points
            l.x1 = p[ i ].x;
            l.y1 = p[ i ].y;

            //end points
            let nextPt = p[ (i + npt) % el.points ] ?? p[ 0 ];
            l.x2 = nextPt.x;
            l.y2 = nextPt.y;
            i++;
        };
    };
    // calculate and layout lines
    redraw();
  
//     //dumpProperties('el', el)
    
    inspectObject('el', el)
    
    return el;
    
};

constructWidgets(construct, 'polygon');


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

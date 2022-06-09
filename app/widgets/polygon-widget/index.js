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

export const construct = (el) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = el.getElementById("transform");
    const linesEl = el.getElementsByClassName("lines");
    const configEl = el.getElementById("config");
    //TODO add an object containing settings from configEL!!
    // console.log(JSON.stringify(configEl.text));
    // console.log(configEl.text.split(';')[ 0 ]);
   
    const elStyle = el.style
  
    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        };
    };
    
    // // PRIVATE VARS AND DEFAULTS
    let _radius// = settings[ 1 ];
    //TODO now got _radius as private var, tied to config
    let points = el.points ?? 5;
    let next = el.next ?? 1;
    let strokeWidth = el.strokeWidth ?? 4;
    let rotate = el.rotate ?? 0;
    let scale = el.scale ?? 0;
    // FUNCTIONS------------------------------------------------------------------------
    /**
     * FUNCTION TO DEFINE PROPERTY
     * (getter/setter optional bound to different objects)
     * @param {*} obj    object to set prop on. Depending on use case this or el
     * @param {*} prop   property
     * @param {*} target outer object to apply property
     * @param {*} source optional object to read property, if not set = target
     */
   
        
    
    
   
    
    // INITIALISATION:
     (function () {   //IIFE
        
        parseConfig(el, attribute => {
            // This anonymous function is called for every attribute in config.
            // attribute is {name:attributeName, value:attributeValue}
            switch (attribute.name) {

                case 'radius':
                   el.radius  = _radius = Number(attribute.value);
                    break;
                case 'points':
                    el.points = Number(attribute.value);
                    break;
                case 'strokeWidth':
                     el.strokeWidth = Number(attribute.value);
                    break;
                case 'next':
                    el.next = next = Number(attribute.value);
                    break;
                case 'rotate':
                    el.rotate  = transformEl.groupTransform.rotate.angle = Number(attribute.value);
                    break;
                case 'scale':
                    el.scale = scale = transformEl.groupTransform.scale.x
                        = transformEl.groupTransform.scale.y
                        = Number(attribute.value);
                    break;
                case 'lines':
                    el.lines = linesEl

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
        let iRadius = _radius ?? 100;
        iRadius -= Math.round(strokeWidth  / 2);
        const fract = (2 * Math.PI / points);

        let i = 0;
        // calculate and write points to array
        while (i < points) {
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
        while (i < points) {

            let l = linesEl[ i ];
            //TODO do this connection to element somewhere else later to keep abstract here?
            l.style.strokeWidth = strokeWidth;
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
   
  
//     //dumpProperties('el', el)
//    console.log("test: "+configEl.text.split(';')[0])
   
    Object.defineProperty(el, 'radius', {
        get() { return _radius },
        set(newValue) {
            _radius = newValue;
            redraw()
        }
    });
    Object.defineProperty(el, 'points', {
        get() { return points },
        set(newValue) {
            points = newValue;
            redraw()
        }
    });
    Object.defineProperty(el, 'next', {
        get() { return next },
        set(newValue) {
            next = newValue;
            redraw()
        }
     });
    //If I add this, <rotate> is no longer shown as use's property
    Object.defineProperty(el, 'rotate', {
        get() { return transformEl.groupTransform.rotate.angle },
        set(newValue) {
            transformEl.groupTransform.rotate.angle = newValue;
            redraw()
        }
    });
    
    const createPolygonWidget = (element) => ({
        

        get style() {
            return {
                get fill() { return element.style.fill },
                set fill(color) { element.style.fill = color }
            }
        },
       get next() { return next },
        set next(newValue) {
         next = newValue;
            redraw();
        },
         get radius() { return _radius },
        set radius(newValue) {
            _radius = newValue;
            console.log(_radius)
            redraw();
        },
        get rotate() { return rotate },
        set rotate(newValue) {
            rotate = transformEl.groupTransform.rotate.angle = newValue;
            redraw();
        },
        get points() { return points },
        set points(newValue) {
            points = newValue;
            redraw();
        },
        get strokeWidth() { return strokeWidth },
        set strokeWidth(newValue) {
            strokeWidth = newValue;
            redraw();
        },
        get lines() {
           
            // return linesEl;
            return {
                get style() {
                    return {
                        get fill() { return element.style.fill },
                        set fill(color) { element.style.fill = color }
                    }
                },
            } 
        },
        get settings() { return configEl },
        
        get scale() {
            return {
                get x() { return scale.x },
                set x(newValue) { scale.x = newValue },
                get y() { return scale.y },
                set y(newValue) { scale.y = newValue }
            }
        }
       
       
        

       })
        //get cx() { return element.cx },
        //set cx(newValue) {element.cx = newValue}
    //});
       
    //const potato = Object.seal(createPotatoWidget(document.getElementById('potato')));
       // el = createPolygonWidget(el)
    redraw();
    //inspectObject('el', el)
    return createPolygonWidget(el);
    
};

constructWidgets(construct, 'polygon');


//TODO 0
//CREATE STYLE ON LINES
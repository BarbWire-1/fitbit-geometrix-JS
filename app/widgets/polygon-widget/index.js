
'use strict';

import { constructWidgets, parseConfig } from "../construct-widgets";
import { dumpProperties, inspectObject } from "../devTools";
//import { dumpProperties, inspectObject } from "../devTools/";
import { validInput } from "./validation"

//TEST TO INVOKE STYLES.CSS
//import { styled } from 'styled-components';
//import {createComponent} from 'styled-components'
// import "../../../resources/styles.css"//error: Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
// <link rel="stylesheet" href="styles.css"></link>//Unhandled exception: ReferenceError: createComponent is not defined





export const createPolygon = (useEl) => {
    //GET ELEMENTS FOR POLYGON
    const transformEl = useEl.getElementById("transform");// needed to rotate/scale
    const linesEl = useEl.getElementsByClassName("lines");// needed to iterate
    const configEl = useEl.getElementById("config");
    let transform = transformEl.groupTransform
    
    // PRIVATE VARS
    // abstract
    let _radius, _points, _next, poly
    // on svg-elements
    let _rotate, _strokeWidth, _scale
    
    // array to hold linesStyle objects
    let _linesStyle
   
    INITIALISATION:
    (function () {   //IIFE
        //defaults set in symbol config.text
   
        parseConfig(useEl, attribute => {
            
            switch (attribute.name) {

                case 'radius':
                   _radius = Number(attribute.value);
                    break;
                case 'points':
                    //TODO why does this one (only) need to be equalled to useEl.points???
                     useEl.points = _points = Number(attribute.value);
                    break;
                case 'strokeWidth':
                    _strokeWidth = Number(attribute.value);
                    break;
                case 'next':
                    _next = Number(attribute.value);
                    break;
                case 'rotate':
                  _rotate = transform.rotate.angle = Number(attribute.value);
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
    
    // TODO split recalc() to execute only necessary changes?
    // CALCULATE POINTS AND APPLY TO LINES
    const recalc = () => {
        
        let prevPoints;
        // array to keep calculated point-objects for further use in connecting lines
        let p = [];

        // recalc radius depending on strokeWidth to fit inside outer radius
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
        // to remove possible settings on previous used lines
        if (prevPoints != _points) {
            // set all lines (back) to 'none'
            linesEl.forEach(line => {
                line.style.display = 'none'
            });
        }  
        // apply actual settings to used line-elements
        i = 0;
        let npt = _next
        while (i < _points) {
           
            let l = linesEl[ i ];
            l.style.strokeWidth = _strokeWidth;
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
        prevPoints = _points;
    };
    
  
    // Array of line-style-objects to only expose fill on line-elements
    !function () { //IIFE
        _linesStyle = []
        const createStyleObject = (ele) => ({
            get style() {
                return {
                    set fill(newValue) { ele.style.fill = newValue },
                    get fill() {return ele.style.fill}
                }
            },
        });
        linesEl.forEach(line => _linesStyle.push(Object.seal(createStyleObject(line))));
    }();
    
    Object.seal(_linesStyle)
    
    // TODO ???
    // inspectObject('_linesStyle[0]', _linesStyle[ 0 ])// style: {}
    // inspectObject('_linesStyle[0].style', _linesStyle[ 0 ].style)// fill: undefined :(
    // inspectObject('_linesStyle[0].style.fill', _linesStyle[ 0 ].style.fill)// nothing! ??
    // linesEl.forEach(line => inspectObject('line', line))
    // inspectObject('linesEl[0]', linesEl[ 0 ])
   

    //CREATE AN OBJECT INCLUDING ALL EXPOSED PROPERTIES
    const createPolygonWidget = (ele) => ({
        
        // SETTINGS ON useEl
        //get x() { return ele.x },
        set x(newValue) { ele.x = newValue },
        // get y() { return ele.y },
        set y(newValue) { ele.y = newValue },
        
        get style() {
            return {
                set fill(newValue) { ele.style.fill = newValue },
                set opacity(newValue) { ele.style.opacity = newValue },
                set display(newValue) { ele.style.display = newValue },
                set strokeWidth(newValue) { _strokeWidth = newValue, recalc() },
            }
        },
        
        get lines() { return _linesStyle },// individual style: fill only!! else inherited from useEl
        
        
        //TODO only for testing behaviour of <config>!______________________________________________________________________
        get config() {
            return {
                get text() { return configEl.text },
                set text(newValue) {
                    configEl.text = newValue;
                    parseConfig(useEl, attribute => {

                        switch (attribute.name) {

                            case 'radius':
                                _radius = Number(attribute.value);
                                break;
                            case 'points':
                                //TODO why does this one (only) need to be equalled to useEl.points???
                                useEl.points = _points = Number(attribute.value);
                                break;
                            case 'strokeWidth':
                                _strokeWidth = Number(attribute.value);
                                break;
                            case 'next':
                                _next = Number(attribute.value);
                                break;
                            case 'rotate':
                                _rotate = transform.rotate.angle = Number(attribute.value);
                                break;

                        };
                    });

                    console.log(configEl.text)
                    
                }
            }
        },
        //___________________________________________________________________________________________________________________
        
        
        // ADDITIONAL ABSTRACT SETTINGS ON useEl-object
        get next() { return useEl.next },
        set next(newValue) {
            _next = newValue;
            recalc();
        },
        get radius() { return useEl.radius },
        set radius(newValue) {
            _radius = newValue;
            recalc();
        },
        get points() { return useEl.points },
        set points(newValue) {
            _points = newValue;
            recalc();
        }, 
        
        // SETTINGS ON transformEl (member of useEL)
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
        
        
    });
    

    // to draw uses on instantiaton:
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
// TODO add an interim-object <line> to have linesStyle as object?

// TODO CSS on config and/or object or useEl not working this way.
// seems, that styles.css is not invoked on constructing objects in app/index.js?
// although polygon.css including the defaults in config does?
// change parseConfig in a named function and call it on constructing?
// or somehow force to read from styles.css?
// a processing-sequence problem?
// or structural? as object isn't identical with useEl, but wraps it?

// With parseConfig() in setter of config.text,text set in index.js now gets applied
// still no access on <config> from styles.css
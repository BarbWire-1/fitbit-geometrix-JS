import { dumpProperties, inspectObject } from "../devTools";
import document from 'document'

//TODO add another use to play from here
let el = document.getElementById('myPolygon');
let linesEl = el.getElementsByClassName('lines')

let elStyle =el.style

class PolygonStyle {
    constructor(elStyle) {
        //this.opacity = opacity;
        // this.display = display;
        // this.fill = fill;
        Object.defineProperty(this, 'opacity', {

            set(newValue) { elStyle.opacity = newValue }
        });
        Object.defineProperty(this, 'display', {
            set(newValue) { elStyle.display = newValue }
        });
        Object.defineProperty(this, 'fill', {
            set(newValue) { elStyle.fill = newValue },
        })
    }

};

let lineStyle = Object.seal(new PolygonStyle(elStyle))

dumpProperties('lineStyle', lineStyle, 1)
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    };
};
export class Line extends PolygonStyle {
    constructor(elStyle) {
        super(elStyle)
        this.style = lineStyle
    }
    
};
linesEl.forEach(line => {
    Object.seal(new Line(line))
})



//elStyle = widgetStyle
//el.lines[ 2 ].style.fill = "limegreen"
console.log(`linesEl[0]: ${JSON.stringify(linesEl[ 0 ])}`)// are children of uses always hidden? or why can't I read them directly anywhere?
console.log(linesEl[0].style.fill) //undefined
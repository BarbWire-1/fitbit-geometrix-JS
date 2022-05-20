import { dumpProperties, inspectObject } from "../devTools";
import document from 'document'
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
            get fill() { return this.style.fill }
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
    Object.seal(new Line(line, elStyle))
})
el.lines[ 2 ].style.fill = "limegreen"

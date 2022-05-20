
import document from 'document'
import './widgets/polygon-widget'
import { dumpProperties, inspectObject } from './widgets/devTools';
import {Line} from './widgets/polygon-widget/polygonClass'

let myPolygon = document.getElementById('myPolygon');
dumpProperties('myPolygon top', myPolygon, 1)

//NOTE: if there are are no dynamic changes, it doesn't even to be "instantiated" here!
let myPolygon2 = document.getElementById('myPolygon2');

//set lines[0] to different color to show rotation and connected next point
//changed in updateProps()
// console.log(JSON.stringify(myPolygon.lines))
myPolygon.lines[ 0 ].style.fill = 'orange';
// myPolygon.lines[ 0 ].x1 = 0;
myPolygon.points = 10;
//myPolygon2.next = 3;
//TODO restrict access to <lines> on style only!!!
//myPolygon2.lines[0].x1 = 100
console.log(`myPolygon2.points: ${myPolygon2.points}`)//aaaah... this way 'undefined'
myPolygon2.points = 8;
console.log(`myPolygon2.next: ${myPolygon2.next}`)//aaaah... this way 'undefined'
myPolygon2.next = 2;
//why doesn't this get applied????????
for (let i = 0; i < myPolygon2.points; i++) {
    if (i % myPolygon2.next == 0)
        myPolygon2.lines[ i ].style.fill = 'orange'
    console.log(`i: ${i}`)
}
 //myPolygon2.lines[0].style.fill = 'orange'

console.log(JSON.stringify(myPolygon))// this returns an EMPTY OBJECT!!! 😭
// TODO there must be something fundamentally wrong, in how I create my object LOL

let i = 0;
function updateProps() {
    //inspectObject('myPolygon', myPolygon)//logging ok HERE
    //i %= 24;
    myPolygon.rotate = 15 * i;
    //note: scaling also impacts strokeWidth!
    myPolygon.scale = .5 + (i % 2)/2;
    myPolygon.next = i;
    // console.log(`myPolygon.rotate = ${myPolygon.rotate}`)
    // console.log(`myPolygon.scale = ${myPolygon.scale}`)
    i++;
};
//to stop animation and logging
const delay = 1;
const limit = 24;
let a = 1;

const limitedInterval = setInterval(() => {
    updateProps()
    if (a > limit) {
        clearInterval(limitedInterval);
        console.log('-------------------');
        console.warn('Interval cleared!');
    };
    a++;
}, delay * 1000);


// just confused... mixed at least 3 approaches, I fear
// do I need to create virtual classes for <transform> and <style>> instead of going on the subElements directly??


//TEST DEFINE PROPERTIES
myPolygon.radius = 150 // gets applied
//console.log(myPolygon.radius)// but logged as <undefined>

myPolygon.points = 7 // gets applied
//console.log(myPolygon.points)// but logged as <undefined>

myPolygon.strokeWidth = 6 // gets applied
//console.log(myPolygon.strokeWidth)// but logged as <undefined>

myPolygon.next = 1 // gets applied
//console.log(myPolygon.next)// but logged as <undefined>

myPolygon.rotate = 20 // gets applied
//console.log(myPolygon.rotate)

myPolygon.scale = 0.5 // gets applied
//console.log(myPolygon.scale)// but logged as <undefined>

dumpProperties('myPolygon btm', myPolygon,1)
//inspectObject('myPolygon', myPolygon)

// let line = Object.seal(new Line())
// line.style.fill = 'red'
// line.style.opacity = 0.5
// console.log(line.style.fill)// currently logs undefined. had it working but crashed it
// 
// dumpProperties('line', line, 1)
// dumpProperties('line.style', line.style, 1)// inherits ALL style on level 1
// inspectObject('line.style', line.style)

// myPolygon.lines[ 2 ].style.fill = "blue"// set on line directly
// 
// //myPolygon2.lines[ 0 ].x1 = -100// buhuuuuu
// 
// myPolygon.style.fill = 'orange'// set on widget => inherits if not defined!!!
// console.log(myPolygon.style.fill)
// console.log(myPolygon.lines[0].style.fill)

myPolygon.style.fill = "blue"
myPolygon.lines[ 0 ].style.fill = 'orange';
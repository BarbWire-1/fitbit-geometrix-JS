
import document from 'document'
import './widgets/polygon-widget'
//import { dumpProperties, inspectObject } from './widgets/devTools';
import {Line} from './widgets/polygon-widget/polygonClass'

let myPolygonA = document.getElementById('myPolygon');
//dumpProperties('myPolygonA top', myPolygonA, 1)
myPolygonA.points = 3

let myPolygonB = document.getElementById('myPolygon2');
myPolygonB.lines[ 0 ].style.fill = 'orange';

//set lines[0] to different color to show rotation and connected next point
//changed in updateProps()
// console.log(JSON.stringify(myPolygon.lines))
//myPolygon.lines[ 0 ].style.fill = 'orange';
myPolygonA.points = 10;

//TODO restrict access to <lines> on style only!!!
//myPolygon2.lines[0].x1 = 100
myPolygonB.points = 8;
myPolygonB.next = 2
// for (let i = 0; i < myPolygonB.points; i++) {
//     if (i % myPolygonB.next == 0)
//         myPolygonB.lines[ i ].style.fill = 'orange'
//     
// }
 //myPolygon2.lines[0].style.fill = 'orange'

console.log(JSON.stringify(myPolygonA))// this returns an EMPTY OBJECT!!! 😭
// TODO there must be something fundamentally wrong, in how I create my object LOL

let i = 0;
function updateProps() {
    //inspectObject('myPolygon', myPolygon)//logging ok HERE
    //i %= 24;
    myPolygonA.rotate = 15 * i;
    //note: scaling also impacts strokeWidth!
    myPolygonA.scale = .5 + (i % 2)/2;
    myPolygonA.next = i;
     console.log(`myPolygon.rotate = ${myPolygonA.rotate}`)
    console.log(`myPolygon.scale = ${myPolygonA.scale}`)
    myPolygonA.radius /= 1.1
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
myPolygonA.radius = 150 // gets applied
//console.log(myPolygon.radius)// but logged as <undefined>

myPolygonA.points = 7 // gets applied
//console.log(myPolygon.points)// but logged as <undefined>

myPolygonA.strokeWidth = 6 // gets applied
//console.log(myPolygon.strokeWidth)// but logged as <undefined>

myPolygonA.next = 1 // gets applied
//console.log(myPolygon.next)// but logged as <undefined>

myPolygonA.rotate = 20 // gets applied
//console.log(myPolygon.rotate)

myPolygonA.scale = 0.5 // gets applied
console.log(myPolygonA.scale)// but logged as <undefined>

//dumpProperties('myPolygon btm', myPolygon,1)
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

myPolygonA.style.fill = "blue"// gets inherited to lines
//myPolygonA.lines[ 0 ].style.fill = 'limegreen';// directly on line - trumps inherited
myPolygonA.style.fill = "aqua"; //only applied to lines without OWN fill!
//myPolygonA.lines[0].style.fill = "limegreen"
//hmmm instance still as <any>
// I could define some APIs earlier, but not able to do anything working on lines Array.
// 

//TODO having 2 different symbol uses as symbol variations only works static ?
//factory doesn't handle subTypes?

//strange, now construct A/B separately: for B not all props from config get applied
// check which and why? (points/next ??)
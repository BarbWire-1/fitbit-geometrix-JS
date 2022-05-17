
import document from 'document'
import './widgets/polygon-widget'
//import { dumpProperties, inspectObject } from './widgets/devTools';

let myPolygon = document.getElementById('myPolygon');


//NOTE: if there are are no dynamic changes, it doesn't even to be "instantiated" here!
let myPolygon2 = document.getElementById('myPolygon2');

//set lines[0] to different color to show rotation and connected next point
//changed in updateProps()
myPolygon.lines[ 0 ].style.fill = 'orange';
myPolygon.lines[ 0 ].x1 = 0;
myPolygon.points = 10;
//myPolygon2.next = 3;
//TODO restrict access to <lines> on style only!!!
//myPolygon2.lines[0].x1 = 100
for (let i = 0; i < myPolygon2.points; i++) {
    if (i % myPolygon2.next == 0)
    myPolygon2.lines[i].style.fill = 'orange'
}

console.log(JSON.stringify(myPolygon))// this returns an EMPTY OBJECT!!! 😭
// TODO there must be something fundamentally wrong, in how I create my object LOL

let i = 0;
function updateProps() {
    //i %= 24;
    myPolygon.rotate = 15 * i;
    //note: scaling also impacts strokeWidth!
    myPolygon.scale = 1 + (i % 2)/2;
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

// This file is not a part of the widget template. It demonstrates how to use the sample widget code.
import document from 'document'
import './widgets/polygon-widget'
import { dumpProperties, inspectObject } from './widgets/polygon-widget/devTools';

let myPolygon = document.getElementById('myPolygon');
let myPolygon2 = document.getElementById('myPolygon2');
myPolygon.lines[ 0 ].style.fill = 'orange';
myPolygon.lines[ 0 ].x1 = 0;
//myPolygon.radius = 200;
myPolygon.points = 10;
myPolygon.rotate = 60;
myPolygon.next = 3;
//myPolygon.scale = 2
myPolygon.strokeWidth = 1;



myPolygon.x = 168;
myPolygon.y = 168;

myPolygon2.x = 168;
myPolygon2.y = 168;
console.log(JSON.stringify(myPolygon))// this returns an EMPTY OBJECT!!! 😭
// TODO there must be something fundamentally wrong, in how I create my object LOL


// // x,y and style for ALL can be set on <use> without any API,
// // But I'd love to see it as own property!
// myPolygon.style.fill = "aqua"
// myPolygon.style.opacity = 0.5;

 //inspectObject('myPolygon', myPolygon)
dumpProperties('myPolygon', myPolygon, 1)





let i = 0;
function updateProps() {
    //i %= 24;
    myPolygon.rotate = 15 * i;
    myPolygon.scale = 1 + i % 2;
    console.log(`myPolygon.rotate = ${myPolygon.rotate}`)
    console.log(`myPolygon.scale = ${myPolygon.scale}`)
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

//TODO radius now applicable via <set> in svg having a dummy circle, to correspond to it's <r>
// do I need corresponding elements for each value to apply????
// not clear, as in template, we only needed <style>
// could I solve this using config? so having text and convert to number???
// just confused
// do I need to create virtual classes for <transform> and <style>> instead of going on the subElements directly??

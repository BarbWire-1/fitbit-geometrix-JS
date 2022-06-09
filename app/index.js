
import document from 'document'
//import './widgets/polygon-widget';
import {construct} from './widgets/polygon-widget/index'
import { dumpProperties, inspectObject } from './widgets/devTools';


let myPolygonA = Object.seal(construct(document.getElementById('myPolygon')));
//dumpProperties('myPolygonA', myPolygonA, 1)
//myPolygonA.points = 3
inspectObject('myPolygonA', myPolygonA)
let myPolygonB = Object.seal(construct(document.getElementById('myPolygon2')));
myPolygonB.points = 3
myPolygonB.rotate = 30;
myPolygonA.next = 3
myPolygonA.scale.x = 0.5
myPolygonA.scale.y = 1

console.log(JSON.stringify(myPolygonA.lines))
myPolygonA.lines[ 0 ].style.fill = 'red'

myPolygonA.style.fill = 'yellow'
inspectObject('myPolygonA', myPolygonA)
dumpProperties('myPolygonA', myPolygonA, 1)

myPolygonA.x = 100


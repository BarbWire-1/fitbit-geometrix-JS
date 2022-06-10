
import document from 'document'
//import './widgets/polygon-widget';
import {createPolygon} from './widgets/polygon-widget/index'
import { dumpProperties, inspectObject } from './widgets/devTools';


let myPolygonA = createPolygon(document.getElementById('myPolygon'));
dumpProperties('myPolygonA', myPolygonA, 1)
//myPolygonA.points = 3
inspectObject('myPolygonA', myPolygonA)
let myPolygonB = createPolygon(document.getElementById('myPolygon2'));
myPolygonB.points = 3
myPolygonB.rotate = 90;
myPolygonA.next = 3
myPolygonA.scale.x = 0.5
myPolygonA.scale.y = 1
myPolygonA.lines[ 0 ].style.fill = 'red'

myPolygonA.style.fill = 'yellow';
// inspectObject('myPolygonA', myPolygonA)
// dumpProperties('myPolygonA', myPolygonA, 1)

myPolygonA.x = 100
myPolygonA.strokeWidth = 10
//myPolygonA. style.display = 'none'
//myPolygonB.lines[ 0 ].x1 = 100// this throws :)
myPolygonA.lines[0].style.strokeWidth = 5;// this doesn't get applied, but doesn't throw :(

myPolygonA.style.strokeWidth = 20
// polygonObject with default-settings
// it only gets constructed if instantiated/constructed here!!!
let PolygonC = createPolygon(document.getElementById('myPolygon3'));
//myPolygonA.blah = 3



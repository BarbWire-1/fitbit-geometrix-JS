
import document from 'document'
//import './widgets/polygon-widget';
import {createPolygon} from './widgets/polygon-widget/index'
import { dumpProperties, inspectObject } from './widgets/devTools';


let rotatingPoly = createPolygon(document.getElementById('myPolygon1'));
let multiColorPoly = createPolygon(document.getElementById('myPolygon2'));
let scaledPoly = createPolygon(document.getElementById('myPolygon3'));
let changingPoly = createPolygon(document.getElementById('myPolygon4'));


for (let i = 0; i < multiColorPoly.points; i++) {
    if (i % 2 == 1) multiColorPoly.lines[ i ].style.fill = "limegreen";
}


import document from 'document'
//import './widgets/polygon-widget';
import {createPolygon} from './widgets/polygon-widget'
import { dumpProperties, inspectObject } from './widgets/devTools';



// the polygon uses only get constructed if declared here!!!
// => could be constructed dynamically only if needed
let rotatingPoly = createPolygon(document.getElementById('myPolygon1'));
let multiColorPoly = createPolygon(document.getElementById('myPolygon2'));
let scaledPoly = createPolygon(document.getElementById('myPolygon3'));
let changingPoly = createPolygon(document.getElementById('myPolygon4'));

//change fill for individual lines
for (let i = 0; i < multiColorPoly.points; i++) {
    if (i % 2 == 1) multiColorPoly.lines[ i ].style.fill = "limegreen";
}

// changes from default settings
changingPoly.points = 3;
changingPoly.style.strokeWidth = 3;
changingPoly.radius = 40;
changingPoly.style.fill = "orange";

//marks line0 to show "next"-connection
// changingPoly.lines[ 0 ].style.fill = "magenta"
// changingPoly.style.opacity = 0.5;

// examples for dynamic changes
let i = 0;
function updateProps() {
    rotatingPoly.rotate.angle = 15 * i;
    //console.log(`rotation: ${rotatingPoly.rotate.angle}°`);
    
    //TODO need to set both, otherwise scale.x = scale.y - to expect or wrong defined??
    scaledPoly.scale.x = 1 + (i / 36);
    scaledPoly.scale.y = 1// - (i / 24);
    //console.log(`scale.x: ${scaledPoly.scale.x}`)
    
    changingPoly.next = 1 + ((changingPoly.points-2) % 6);
    //console.log(`next: ${changingPoly.next}`)
    changingPoly.points = 3 + (i % 10);
    changingPoly.radius = 40 + 5 * (i % 24);
    changingPoly.style.fill = i % 2 == 0 ? 'magenta' : 'orange'
    
    rotatingPoly.radius = 150 - 5 * i;
    

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

// show structure of <rotatingPoly> (same for all polygon-objects)
dumpProperties('rotatingPoly', rotatingPoly, 1)



const getProperties = (obj) => {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
           let val = obj[ key ];
          
            if (typeof val === 'object') {
                console.log(`${key}: ${JSON.stringify(val)}`);
            }
        }
    }
};

getProperties(rotatingPoly.lines)
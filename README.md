# fitbit-geometrix-JS

## work in progress

THIS APPROACH CURRENTLY DOES NOT SUPPORT ANY CSS ON THE CONFIG-ATTRIBUTES!! 
(looking for ideas to solve that, but perhaps not possible, as they don't have another corresponding SVG-Element then config.text itself?)
In branch testCSS I added `<config>` to object and `<parseConfig>`into the setter, but still not applied if set in styles.css text-buffer - at least unnecessarily working from `app/index.js` ;)

\
Testing ...



\
.


![dynamix](dynamix.gif)

## Acknowledgement
This widget uses a version of [Gondwana's widget-factory](https://github.com/gondwanasoft/fitbit-simple-widget) including `config` which provides an easy access to properties of the `<use>` and its children in `SVG` and/or `CSS`.(The last one, I managed to kill)\
To create your own widget have a look at [Gondwana's fitbit-widget-template](https://github.com/gondwanasoft/fitbit-widget-template).




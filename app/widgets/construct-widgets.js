// MIT License
// 
// Copyright(c) 2022 Peter McLennan
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
//     in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


import document from 'document';

export const constructWidgets = (construct, widgetType) => {
  // Finds widget elements of the specified type in the current document and calls construct() for each instance.
  // Ignores widgets that have class 'widget-manual'.
  // Searching the whole document for widgets is slow if the SVG is large.
  // Moreover, if SVG documents are loaded dynamically, the appraoch taken here will probably not work.
  const widgets = document.getElementsByTypeName(widgetType);
    widgets.forEach(widget => {
      const classes = widget.class.split(' ');  // array of all class names
      if (widget.id !== widget.type && classes.indexOf('widget-manual') < 0) { // .id!==.type selects <use> and rejects <symbol> in SDK4 on watch
        widget.class = widget.class;    // bring forward (ie, trigger) application of CSS styles
        construct(widget);
      }
  });
}

export const parseConfig = (useEl, callback) => {
  // Calls callback with {name:attributeName, value:attributeValue} for every value found in el's config element.
  const config = useEl.getElementById('config').text;
  if (config === "") return;

  const attributes = config.split(';');
  attributes.forEach(attribute => {
    const colonIndex = attribute.indexOf(':')
    if (colonIndex > 0) {   // to ignore trailing ; and malformed attributes
      const attributeName = attribute.substring(0, colonIndex).trim();
      const attributeValue = attribute.substring(colonIndex+1).trim();
      callback({name:attributeName, value:attributeValue});
    }
  });
}
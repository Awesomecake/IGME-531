My version of Personal Toolbox 3, Schotter, is written in JavaScript, along with a webpage to display the generated SVG files. 
The webpage has examples of two different ways I to generate Schotter, Polylines and Paths, and has download links for each of the SVGs generated. The program will be run everytime the page is loaded, rendering both Polyline and Path versions.

The generator function uses a pair of loops to create a grid of boxes, and then uses a callback function to use functions designed to create either Polylines or Paths.

Boxes are drawn in a grid pattern, and then adjusted in position, scale, and rotation by using groupings.

The website can be viewed at "https://people.rit.edu/aob6548/531/Personal%20Toolbox%203/"
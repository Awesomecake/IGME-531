My version of Personal Toolbox 2, (Des)Ordres, is written in JavaScript, along with a webpage to display the generated SVG files. 
The webpage has examples of two different ways I to generate (Des)Ordres, Polylines and Paths, and has download links for each of the SVGs generated. The program will be run everytime the page is loaded, rendering both Polyline and Path versions.

The generator function uses a pair of loops to create a grid of boxes, and then uses a callback function to use functions designed to create either Polylines or Paths.

My primitive components are functions that will generate a Polyline or Path, one that will generate a wrapper Group, and two utils functions that generate one random number, or an array of random numbers.

The website can be viewed at "https://people.rit.edu/aob6548/531/Personal%20Toolbox%202/"
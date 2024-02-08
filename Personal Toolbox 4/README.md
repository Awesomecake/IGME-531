My version of Personal Toolbox 4, Interruptions, is written in JavaScript, along with a webpage to display the generated SVG files. 
The webpage has examples of a couple variations on the system used to generate Interruptions. One of them attempts to somewhat replicate the original concept, one shifts line positions based off perlin noise, and the other rotates lines based off perlin noise.

The generator function uses a pair of loops to create a grid of lines, and then uses a callback function add custom spacing, rotation, and color.

Lines are drawn in a grid pattern, and then adjusted in position by using groupings.

The website can be viewed at "https://people.rit.edu/aob6548/531/Personal%20Toolbox%204/"
# IGME 531 Project 1

Project 1 of Aesthetics and Computation is to create a tessellating grid pattern, inspired by the concept of Truchet Tiles.  

I designed my version of Project 1 directly around Truchet Tiles, and created multiple functions which would generate designs that could tessellate and connect in the exact same way as Truchet Tiles would. Theses tiles could be generated into a grid using a GenerateTiling function, which would allow you to specify many parameters such as grid width and height, element size, element padding, a list of colors, and a callback function that would select colors from the list.

I expaned upon this concept by creating a GenerateTilesOfTiles function, which created a grid of grids of tiles, and then continued by creating interesting color rulesets for the visual display. 

As a reflection, I would say that I managed to avoid most of the problems that could arise in generating such a tiling grid, but I could also improve upon this concept in multiple ways, especially in the field of organizing and simplifying data so that a CNC machine could more easily recreate my art. Starting with Truchet tiles gave me good results very quickly, but may have also limited my frame of creativity by locking me into a system of 2 axis rotations.
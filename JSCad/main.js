import { LSystem3D } from "./Fractals/LSystem3D.js";
import { LSystem2D } from "./Fractals/LSystem2D.js";
import { theFractal } from "./geodesic.js";
import { render } from './render.js';

const { booleans, colors, primitives, transforms, hulls } = jscadModeling // modeling comes from the included MODELING library
const { cube, sphere, rectangle, polyhedron, geodesicSphere } = primitives

// https://openjscad.xyz/docs/module-modeling_colors.html#.colorize
// https://openjscad.xyz/docs/module-modeling_colors.html#.colorNameToRgb

//#region L System Fractals
const Snowflake = () => {
    let fractal = new LSystem3D({numLoops: 3, inputString:'F++F++F', 
    ruleset:{
      'F': 'F-F++F-F'
    } 
    });
    fractal.generateData();
    
    return fractal.drawFractal({lineLength: 5, angleOffset: 60});
}

const GosperCurve = () => {
    let fractal = new LSystem3D({numLoops: 4, inputString:'A', 
    ruleset:{
      'A': 'A-B--B+A++AA+B-',
      'B': '+A-BB--B-A++A+B',
    } 
    });
    fractal.generateData();
    
    return fractal.drawFractal({lineLength: 5, angleOffset: 60});
}

const LSystemBush = () => {
    let fractal = new LSystem3D({numLoops: 5, inputString:'Y', 
    ruleset:{
      'X': 'X[-FFF][+FFF]FX',
      'Y': 'YFX>[+Y][-Y]<',
    } 
    });
    fractal.generateData();
    
    return fractal.drawFractal({lineLength: 5, angleOffset: -25.7});
}

const Tree = () => {
  let fractal = new LSystem3D({numLoops: 5, inputString:'X', 
  ruleset:{
    'F': 'FF',
    'X': '>F-[[X]+X]+F[+FX]-X',
  } 
  });
  fractal.generateData();
  
  return fractal.drawFractal({lineLength: 5, angleOffset: 22.5, startRoll: -30});
}

const BinaryTree3D = () => {
  let fractal = new LSystem3D({numLoops: 5, inputString:'F', 
  ruleset:{
    'F': 'G)[+F][>F][<F]-F',
    'G': 'GG'
  } 
  });
  fractal.generateData();

  return fractal.drawFractal({lineLength: 15, angleOffset: 40, lineWidth: 10});
}

const FractalPlant = () => {
  let fractal = new LSystem3D({numLoops: 4, inputString:'X', 
  ruleset:{
    'X': 'F+)[>[>X]-X][<[<X]&X]---)F+X',
    'F': 'FF'
  } 
  });
  fractal.generateData();
  
  return fractal.drawFractal({lineLength: 25, angleOffset: 25, lineWidth: 12}).concat(fractal.drawFractal({lineLength: 25, angleOffset: -25, lineWidth: 12}));
}
//#endregion

//scaling, baseDepth
const RecursiveCube = (options = {scaling: 0.5, baseDepth: 5}) => {
  let shapeList = [];
  let scaling = options.scaling || 0.5;
  let baseDepth = options.baseDepth || 5;

  const recursiveCube = (size, position, depth) => {
    if (depth === 0) return;

    shapeList.push(transforms.translate(position, cube({size: size})));

    let hOffset = size*0.5+size*scaling*0.5;

    recursiveCube(size * scaling, [position[0]+hOffset,position[1],position[2]], depth - 1);
    recursiveCube(size * scaling, [position[0]-hOffset,position[1],position[2]], depth - 1);

    recursiveCube(size * scaling, [position[0],position[1]+hOffset,position[2]], depth - 1);
    recursiveCube(size * scaling, [position[0],position[1]-hOffset,position[2]], depth - 1);

    recursiveCube(size * scaling, [position[0],position[1],position[2]+hOffset], depth - 1);
    recursiveCube(size * scaling, [position[0],position[1],position[2]-hOffset], depth - 1);
  }

  recursiveCube(50, [0,0,0], baseDepth);

  return shapeList;
}

//scaling, baseDepth
const RecursivePyramid = (options = {scaling: 0.5, baseDepth: 5}) => {
  let shapeList = [];
  let scaling = options.scaling || 0.5;
  let baseDepth = options.baseDepth || 5;

  const MakePyramid = (scale) =>
  {
    let mypoints = [ [scale, scale, 0], [scale, -scale, 0], [-scale, -scale, 0], [-scale, scale, 0], [0, 0, scale] ]
    let myfaces = [ [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [1, 0, 3], [2, 1, 3] ]
    return polyhedron({points: mypoints, faces: myfaces, orientation: 'inward'})
  }

  const recursivePyramid = (size, position, depth) => {
    if (depth === 0) return;

    shapeList.push(transforms.rotateX(Math.PI*(baseDepth-depth),transforms.translate(position, MakePyramid(size))));

    let hOffset = size;

    recursivePyramid(size * scaling, [position[0]+hOffset,position[1],position[2]], depth - 1);
    recursivePyramid(size * scaling, [position[0]-hOffset,position[1],position[2]], depth - 1);

    recursivePyramid(size * scaling, [position[0],position[1]+hOffset,position[2]], depth - 1);
    recursivePyramid(size * scaling, [position[0],position[1]-hOffset,position[2]], depth - 1);
  }

  recursivePyramid(50, [0,0,0], baseDepth);

  return shapeList;
}

render(document.getElementById("render"),theFractal) // frequency should be a multiple of 6
import { Fractal3D } from "./fractal3D.js";
import { Fractal2D } from "./fractal2D.js";
import { render } from './render.js';

// https://openjscad.xyz/docs/module-modeling_colors.html#.colorize
// https://openjscad.xyz/docs/module-modeling_colors.html#.colorNameToRgb

const Snowflake = () => {
    let fractal = new Fractal3D({numLoops: 3, inputString:'F++F++F', 
    ruleset:{
      'F': 'F-F++F-F'
    } 
    });
    fractal.generateData();
    
    return fractal.drawFractal({lineLength: 5, startAngle: [0,0], angleOffset: 60});
}

const GosperCurve = () => {
    let fractal = new Fractal3D({numLoops: 4, inputString:'A', 
    ruleset:{
      'A': 'A-B--B+A++AA+B-',
      'B': '+A-BB--B-A++A+B',
    } 
    });
    fractal.generateData();
    

    return fractal.drawFractal({lineLength: 5, startAngle: 0, angleOffset: 60});
}

const LSystemBush = () => {
    let fractal = new Fractal3D({numLoops: 5, inputString:'Y', 
    ruleset:{
      'X': 'X[-FFF][+FFF]FX',
      'Y': 'YFX>[+Y][-Y]<',
    } 
    });
    fractal.generateData();
    

    return fractal.drawFractal({lineLength: 5, angleOffset: -25.7});
}

const Tree = () => {
  let fractal = new Fractal3D({numLoops: 5, inputString:'X', 
  ruleset:{
    'F': 'FF',
    'X': '>F-[[X]+X]+F[+FX]-X',
  } 
  });
  fractal.generateData();
  

  return fractal.drawFractal({lineLength: 5, angleOffset: 22.5, startRoll: -30});
}

render(document.getElementById("render"), Tree())
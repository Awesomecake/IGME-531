//https://paulbourke.net/fractals/lsys/
let alphabet = ['F', 'G', '+', '-', '[', ']'];

//#region Generation Requirements
const iterate_once = (lindenmayerString, rules) => {
  let newString = '';
  for (let i = 0; i < lindenmayerString.length; i++) {
    const result = rules[lindenmayerString[i]];
    newString += result || lindenmayerString[i];
  }
  return newString;
}

const iterateNTimes = ({numLoops, inputString, ruleset}) => {
  let newString = inputString;
  for (let i = 0; i < numLoops; i++) {
    newString = iterate_once(newString, ruleset);
  }
  return newString;
};

const makeVisual = (options, lindenmayerString) => {
  let theSvgString = '';
  
  // Basically constants
  let angle = (options.angle || 90) * Math.PI / 180;
  let startingPoint = options.startingPoint || [0, 0];
  let lineLength = options.lineLength || 10;

  // State
  let rotation = 0;
  let points = [startingPoint];

  const moveForward = () => {
    const lastPoint = points[points.length - 1];

    const dx = Math.cos(rotation) * lineLength;
    const dy = Math.sin(rotation) * lineLength;

    points.push([lastPoint[0] + dx, lastPoint[1] + dy]);
  };

  let stack = [];

  const whatToDo = (char) => {
    switch (char)
    {
        case '+':
            rotation = rotation - angle;
            break;
        case '-':
            rotation = rotation + angle;
            break;
        case '[':
            stack.push({position: points[points.length-1], rotation: rotation});
            break;
        case ']':
            let out = stack.pop();
            theSvgString += `<polyline points="${points.join(' ')}" 
                                fill="none" stroke="black" 
                                stroke-width="1px"/>`;
            points = [out.position];
            rotation = out.rotation;
            break;
        default:
            moveForward();
    }
  };

  for (let i = 0; i < lindenmayerString.length; i++) {
    whatToDo(lindenmayerString[i]);
  }

  // return a path moving through all the points
  return theSvgString + `<polyline points="${points.join(' ')}" 
                    fill="none" stroke="black" 
                    stroke-width="1px"/>`;
  
};
//#endregion

const createLSystem = (svgTag, stringRuleset, visualRuleset) => {
    const expanded = iterateNTimes(stringRuleset);
    
    const result = makeVisual(visualRuleset, expanded);
    
    // get result into the svg in the dom
    const svg = document.querySelector(svgTag);
    svg.innerHTML = result;
}

createLSystem("#svgContainer1", {
        numLoops: 10, 
        inputString:'F', 
        ruleset:{
            'F': 'G-F-G',
            'G': 'F+G+F',
        } 
    },
    {
        lineLength: 1.5,
        angle: 60,
        startingPoint: [-300, 0]
    }
)

// createLSystem("#svgContainer2", {
//         numLoops: 5, 
//         inputString:'F', 
//         ruleset:{
//             'F': 'G+[[F]-F]-G[-GF]+F',
//             'G': 'GG',
//         } 
//     },
//     {
//         lineLength: 5.5,
//         angle: 25,
//         startingPoint: [-350, -150]
//     }
// )

// createLSystem("#svgContainer2", {
//     numLoops: 6, 
//     inputString:'Y', 
//     ruleset:{
//         'X': 'X[-FFF][+FFF]FX',
//         'Y': 'YFX[+Y][-Y]',
//     } 
// },
// {
//     lineLength: 2.5,
//     angle: 25.7,
//     startingPoint: [-250, -150]
// }
// )

createLSystem("#svgContainer2", {
    numLoops: 6, 
    inputString:'F+F+F+F', 
    ruleset:{
        'F': 'FF+F+F+F+F+F-F',
    } 
},
{
    lineLength: 2.5,
    angle: 90,
    startingPoint: [0, 0]
}
)

createLSystem("#svgContainer3", {
    numLoops: 3, 
    inputString:'-YF', 
    ruleset:{
        'X': 'XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-',
        'Y': '+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY',
    } 
},
{
    lineLength: 1.5,
    angle: 90,
    startingPoint: [-287.5, -287.5]
}
)
export class Fractal3D{
    constructor({numLoops, inputString, ruleset})
    {
        this.numLoops = numLoops;
        this.inputString = inputString
        this.ruleset = ruleset;
    }

    generateData()
    {
        const iterate_once = (lindenmayerString, rules) => {
            let newString = '';
            for (let i = 0; i < lindenmayerString.length; i++) {
              const result = rules[lindenmayerString[i]];
              newString += result || lindenmayerString[i];
            }
            return newString;
          }
          
        let newString = this.inputString;
        for (let i = 0; i < this.numLoops; i++) {
          newString = iterate_once(newString, this.ruleset);
        }
        
        this.fractalString = newString;
    }

    drawSVG(options = {lineLength:10, startAngle:0,angleOffset:90, startingPoint:[0,0]})
    {
        let objectList = [];
        let pointSum = 0;
  
        // Basically constants
        options.angleOffset = options.angleOffset * Math.PI / 180;

        // State
        let rotation = options.startAngle*Math.PI/180;
        let points = [options.startingPoint];

        const moveForward = () => {
            const lastPoint = points[points.length - 1];
        
            const dx = Math.cos(rotation) * options.lineLength;
            const dy = Math.sin(rotation) * options.lineLength;
        
            points.push([lastPoint[0] + dx, lastPoint[1] + dy]);
            pointSum++;

            objectList.push(transforms.translate(lastPoint,cube({ size: 5 })))
        };
      
        let stack = [];
      
        const whatToDo = (char) => {
            switch (char)
            {
                case '+':
                    rotation = rotation - options.angleOffset;
                    break;
                case '-':
                    rotation = rotation + options.angleOffset;
                    break;
                case '[':
                    stack.push({position: points[points.length-1], rotation: rotation});
                    break;
                case ']':
                    let out = stack.pop();
                    points = [out.position];
                    rotation = out.rotation;
                    break;
                default:
                    moveForward();
            }
        };

        for (let i = 0; i < this.fractalString.length; i++) {
            whatToDo(this.fractalString[i]);
        }

        return objectList;
    }
}

import { render } from './render.js';

const { booleans, colors, primitives, transforms } = jscadModeling // modeling comes from the included MODELING library

const { intersect, subtract, union } = booleans
const { colorize, colorNameToRgb } = colors
const { cube, sphere } = primitives

const demo = (parameters) => {
    const size = parameters.size;

    // const shell = subtract( // https://openjscad.xyz/docs/module-modeling_booleans.html#.subtract
    //     cube({ size: size }), // https://openjscad.xyz/docs/module-modeling_primitives.html#.cube
    //     sphere({ radius: 2/3 * size, segments: 32 }) // https://openjscad.xyz/docs/module-modeling_primitives.html#.sphere
    // );
    // const center = booleans.intersect( // https://openjscad.xyz/docs/module-modeling_booleans.html#.intersect
    //     primitives.sphere({ radius: 1/3 * size, segments: 32 }), 
    //     primitives.cuboid({ size: [1/2 * size, 1/2 * size, 1/2 * size] }) // https://openjscad.xyz/docs/module-modeling_primitives.html#.cuboid
    // );

    let fractal = new Fractal3D({numLoops: 5, inputString:'F', 
        ruleset:{
            'F': 'G+[[F]-F]-G[-GF]+F',
            'G': 'GG',
        } 
    });

    fractal.generateData();
    
    // https://openjscad.xyz/docs/module-modeling_colors.html#.colorize
    // https://openjscad.xyz/docs/module-modeling_colors.html#.colorNameToRgb
    return fractal.drawSVG();
}

render(document.getElementById("render"), demo({ size: 300 }))
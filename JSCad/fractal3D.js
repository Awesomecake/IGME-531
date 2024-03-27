const { booleans, colors, primitives, transforms } = jscadModeling // modeling comes from the included MODELING library

const { intersect, subtract, union } = booleans
const { colorize, colorNameToRgb } = colors
const { cube, sphere, rectangle } = primitives

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

    drawSVG(options)
    {
        let objectList = [];
        let pointSum = 0;
  
        // Basically constants
        let lineLength = options.lineLength || 10;
        let angleOffset = options.angleOffset * Math.PI / 180 || 90

        // State
        let rotation = options.startAngle*Math.PI/180 || 0;
        let points = [options.startingPoint || [0,0]];

        const moveForward = () => {
            const lastPoint = points[points.length - 1];
        
            const dx = Math.cos(rotation) * lineLength;
            const dy = Math.sin(rotation) * lineLength;
        
            points.push([lastPoint[0] + dx, lastPoint[1] + dy]);
            pointSum++;

            let object = transforms.scaleX(lineLength,cube({ size: 1 }));
            object = transforms.rotate([0,0,rotation],object);
            object = transforms.translate([lastPoint[0]+dx/2,lastPoint[1]+dy/2],object);
            objectList.push(transforms.rotate([0,-1,0],object))
        };
      
        let stack = [];
      
        const whatToDo = (char) => {
            switch (char)
            {
                case '+':
                    rotation = rotation - angleOffset;
                    break;
                case '-':
                    rotation = rotation + angleOffset;
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
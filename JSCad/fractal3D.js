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

    // options: {lineLength, startPitch, startYaw, startRoll, angleOffset, startingPoint, ignoredChars}
    drawSVG(options)
    {
        let objectList = [];
  
        // Basically constants
        let lineLength = options.lineLength || 10;
        let angleOffset = options.angleOffset * Math.PI / 180 || 90
        let ignoredChars = options.ignoredChars || [];

        // State
        let yaw = options.startYaw*Math.PI/180 || 0;
        let pitch = options.startPitch*Math.PI/180 || 0;
        let points = [options.startingPoint || [0,0,0]];

        const moveForward = () => {
            const lastPoint = points[points.length - 1];
                    
            const dx = Math.cos(yaw) * Math.cos(pitch) * lineLength;
            const dy = Math.sin(yaw) * Math.cos(pitch) * lineLength;
            const dz = Math.sin(pitch) * lineLength;
        
            points.push([lastPoint[0] + dx, lastPoint[1] + dy, lastPoint[2] + dz]);

            let object = transforms.scaleX(lineLength+1,cube({ size: 1 }));
            object = transforms.rotate([0,-pitch,yaw],object);
            object = transforms.translate([lastPoint[0]+dx/2,lastPoint[1]+dy/2, lastPoint[2]+dz/2],object);
            objectList.push(object)
        };
      
        let stack = [];
      
        const whatToDo = (char) => {
            if(ignoredChars.includes(char))
                return;

            switch (char)
            {
                case '+':
                    yaw -= angleOffset;
                    break;
                case '-':
                    yaw += angleOffset;
                    break;
                case '<':
                    pitch -= angleOffset;
                    break;
                case '>':
                    pitch += angleOffset;
                    break;
                case '[':
                    stack.push({position: points[points.length-1], yaw: yaw, pitch: pitch});
                    break;
                case ']':
                    let out = stack.pop();
                    points = [out.position];
                    yaw = out.yaw;
                    pitch = out.pitch;
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
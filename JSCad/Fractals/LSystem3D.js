const { booleans, colors, primitives, transforms, hulls } = jscadModeling // modeling comes from the included MODELING library

const { intersect, subtract, union } = booleans
const { colorize, colorNameToRgb } = colors
const { cube, sphere, rectangle } = primitives

export class LSystem3D{
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

    // options: {lineLength, lineWidth, startPitch, startYaw, startRoll, angleOffset, startingPoint, ignoredChars}
    drawFractal(options)
    {
        let objectList = [];
        let hullList = [];
  
        // Basically constants
        let lineLength = options.lineLength || 10;
        let angleOffset = options.angleOffset * Math.PI / 180 || 90
        let ignoredChars = options.ignoredChars || [];
        let lineWidth = options.lineWidth || 1;

        // State
        let yaw = options.startYaw*Math.PI/180 || 0;
        let pitch = options.startPitch*Math.PI/180 || 0;
        let roll = options.startRoll*Math.PI/180 || 0;
        let points = [options.startingPoint || [0,0,0]];

        let object = cube({center: points[0], size: lineWidth})
        objectList.push(object);

        const moveForward = () => {
            const lastPoint = points[points.length - 1];
                    
            const dy = (-Math.cos(yaw)*Math.sin(pitch)*Math.sin(roll)-Math.sin(yaw)*Math.cos(roll)) * lineLength;
            const dz = (-Math.sin(yaw)*Math.sin(pitch)*Math.sin(roll)+Math.cos(yaw)*Math.cos(roll)) * lineLength;
            const dx = Math.cos(pitch)*Math.sin(roll) * lineLength;
        
            points.push([lastPoint[0] + dx, lastPoint[1] + dy, lastPoint[2] + dz]);

            let object = cube({center: [lastPoint[0] + dx, lastPoint[1] + dy, lastPoint[2] + dz], size: lineWidth})

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
                    roll -= angleOffset;
                    break;
                case '>':
                    roll += angleOffset;
                    break;
                case '^':
                    pitch += angleOffset;
                    break;
                case '&':
                    pitch -= angleOffset;
                    break;
                case '[':
                    stack.push({position: points[points.length-1], yaw: yaw, pitch: pitch, roll: roll, lineWidth: lineWidth});
                    break;
                case ']':
                    let out = stack.pop();
                    points = [out.position];
                    yaw = out.yaw;
                    pitch = out.pitch;
                    roll = out.roll;
                    lineWidth = out.lineWidth;

                    hullList.push(jscadModeling.hulls.hullChain(objectList));
                    const lastPoint = points[points.length - 1];
                    objectList = [cube({center: lastPoint, size: lineWidth})];
                    break;
                case '(':
                    lineWidth *= 1.2;
                    break;
                case ')':
                    lineWidth *= 0.8;
                    break;
                default:
                    moveForward();
            }
        };

        for (let i = 0; i < this.fractalString.length; i++) {
            whatToDo(this.fractalString[i]);
        }

        hullList.push(jscadModeling.hulls.hullChain(objectList));

        return hullList;
    }
}
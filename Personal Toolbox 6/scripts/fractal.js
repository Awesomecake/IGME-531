export class Fractal{
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

    drawSVG(svg, options = {lineLength:10, startAngle:0,angleOffset:90, startingPoint:[0,0]})
    {
        let theSvgString = '';
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

            theSvgString += `<polyline points="${lastPoint[0]},${lastPoint[1]} ${points[points.length - 1][0]},${points[points.length - 1][1]}" 
            fill="none" stroke="rgb(0,${255-(pointSum/10)%200},${255-(pointSum/10)%200})" 
            stroke-width="0.5px"/>`;
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

        // return a path moving through all the points
        svg.innerHTML += theSvgString
    }
}
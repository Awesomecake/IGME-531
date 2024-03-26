//https://paulbourke.net/fractals/lsys/
import { Fractal } from "./fractal.js";

const svg1 = document.querySelector("#svgContainer1");
const svg2 = document.querySelector("#svgContainer2");
const svg3 = document.querySelector("#svgContainer3");

let fractal = new Fractal({numLoops: 6, inputString:'F', 
  ruleset:{
    'F': 'G+[[F]-F]-G[-GF]+F',
    'G': 'GG',
  } 
});
fractal.generateData();

for(let i = 0; i < 6; i++)
{
  fractal.drawSVG(svg1,{lineLength: 1.5, startAngle:i*60, angleOffset: -25, startingPoint: [Math.cos(i*Math.PI/3)*-50-100, Math.sin(i*Math.PI/3)*-50-100]});
}

let fractal2 = new Fractal({numLoops: 6, inputString:'Y', 
  ruleset:{
    'X': 'X[-FFF][+FFF]FX',
    'Y': 'YFX[+Y][-Y]',
  } 
});
fractal2.generateData();

for(let i = 0; i < 6; i++)
{
  fractal2.drawSVG(svg2,{lineLength: 1.5, startAngle:i*60, angleOffset: -25.7, startingPoint: [Math.cos(i*Math.PI/3)*-50-100, Math.sin(i*Math.PI/3)*-50-100]});
}

/////////////////////////////////

let fractal3 = new Fractal({numLoops: 3, inputString:'-YF', 
  ruleset:{
    'X': 'XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-',
    'Y': '+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY',
  }  
});

fractal3.generateData();
fractal3.drawSVG(svg3, {lineLength: 1.5, startAngle:0, angleOffset: 90, startingPoint:[-287.5, -287.5]});
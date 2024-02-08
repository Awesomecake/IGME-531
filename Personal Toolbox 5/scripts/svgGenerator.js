import { perlin } from './perlin.js';

const generateInterruptions = (svgTag, gridWidth, gridHeight, noiseGranularity,lineLength) => {
    let svgContainer = document.querySelector(svgTag);
    svgContainer.innerHTML = '';

    let output = "";
    for(let i = 0; i < gridHeight; i++)
    {
        for(let j = 0; j < gridWidth; j++)
        {
            output += generateFlowFieldLine(i,j,lineLength,`rgb(${255*i/gridHeight},${0},${255*j/gridWidth})`,noiseGranularity);
        }
    }

    svgContainer.innerHTML = output;
}

const generateFlowFieldLine = (startX,startY,length,color,noiseGranularity=1100) => {

    let posX = startX*length+150;
    let posY = startY*length+200;

    let pointsString = `M ${posX},${posY} `;
    for(let i = 0; i < 10; i++)
    {
        let perlinNoise = perlin.get(posX/noiseGranularity,posY/noiseGranularity);
        posX += Math.cos(perlinNoise*Math.PI*2)*length;
        posY += Math.sin(perlinNoise*Math.PI*2)*length;

        pointsString += `L ${posX},${posY} `;
    }
    return `<path d="${pointsString}" fill="none" stroke="${color}" stroke-width="2" />`;
}

const createGrouping = (svg, rotate, translate = [0,0], scale = [1,1]) => {
    return `<g transform=" translate(${translate[0]},${translate[1]}) rotate(${rotate})scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }

////////////////////////////////////////////////////////////////////////////////////////

generateInterruptions('#svgContainer1',70,70,1000,15);
generateInterruptions('#svgContainer2',70,70,100,15);
generateInterruptions('#svgContainer3',70,70,10,15);
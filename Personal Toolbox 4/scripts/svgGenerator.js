import { perlin } from './perlin.js';

const generateInterruptions = (svgTag, rulesCallback) => {
    let svgContainer = document.querySelector(svgTag);
    svgContainer.innerHTML = '';

    let output = "";
    for(let i = 0; i < 70; i++)
    {
        for(let j = 0; j < 70; j++)
        {
            output += rulesCallback(i,j);
        }
    }

    svgContainer.innerHTML = output;
}

const generatePolyLine = (rand_vect, length, color) => {
    let pointsString = `${0},${0} `;
    pointsString += `${length*rand_vect.x},${length*rand_vect.y} `;

    return `<polyline points="${pointsString}" fill="none" stroke="${color}" stroke-width="2" />`;
}

const generatePolyLineWithAngle = (angle, length, color) => {
    let pointsString = `${0},${0} `;
    pointsString += `${length*Math.cos(angle)},${length*Math.sin(angle)} `;

    return `<polyline points="${pointsString}" fill="none" stroke="${color}" stroke-width="2" />`;
}

const createGrouping = (svg, rotate, translate = [0,0], scale = [1,1]) => {
    return `<g transform=" translate(${translate[0]},${translate[1]}) rotate(${rotate})scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }

////////////////////////////////////////////////////////////////////////////////////////

generateInterruptions('#svgContainer1', (i,j) => {
    if(perlin.get(i/50,j/50) < -0.3) return '';

    let x = i * 20+50;
    let y = j * 20+50;

    let svg = generatePolyLineWithAngle((rng(10)/5-1) + Math.PI/2,35, `black`);

    return createGrouping(svg, 0, [x,y]);
});
generateInterruptions('#svgContainer2', (i,j) => {
    let x = (i+i*perlin.get(i/50,j/50)) * 15 + 30
    let y = (j+j*perlin.get(i/50,j/50)) * 15 + 30

    let svg = generatePolyLine(perlin.rand_vect(),30, `rgb(${255*i/70},${0},${255*j/70})`);

    return createGrouping(svg, 0, [x,y]);
});
generateInterruptions('#svgContainer3', (i,j) => {
    let x = i* 20 + 50
    let y = j * 20 + 50
    let svg = generatePolyLineWithAngle(perlin.get(i/50,j/50)*Math.PI*25,30, `rgb(${255*i/70},${0},${255*j/70})`);

    return createGrouping(svg, 0, [x,y]);
});
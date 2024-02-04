const generateBoxes = (svgTag, callback, numBoxes) => {
    let svgContainer = document.querySelector(svgTag);
    svgContainer.innerHTML = '';

    for(let i = 0; i < 8; i++)
    {
        for(let j = 0; j < 22; j++)
        {
            let max = 7;

            let newSVG = generatePolyLineSquare(130,130);
            svgContainer.innerHTML += createGrouping(newSVG,i*0.5 + (rng(2)-2)*rng(j*4),
                                                    [130*i+75+rng(j*3),130*j+75+rng(j*3)],
                                                    [1+j/50,1+j/50]);
        }
    }
}

const generatePolyLineSquare = (width,height) => {
    return `<polyline points="
            ${-width/2},${-height/2} 
            ${width/2},${-height/2} 
            ${width/2},${height/2} 
            ${-width/2},${height/2} 
            ${-width/2},${-height/2}
        " fill="none" stroke="black" />`
}

const generatePathSquare = (width,height) => {
    return `<path fill="transparent" stroke="black" stroke-width="1" d="
                M ${-width/2} ${-height/2} 
                L ${width/2} ${-height/2}
                L ${width/2} ${height/2}
                L ${-width/2} ${height/2} 
                L ${-width/2} ${-height/2} 
            Z"/>`;
};

const createGrouping = (svg, rotate, translate = [0,0], scale = [1,1]) => {
    return `<g transform=" translate(${translate[0]},${translate[1]}) rotate(${rotate})scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }
const rngArray = (max) => { return [rng(max),rng(max),rng(max),rng(max),rng(max),rng(max),rng(max),rng(max)] }

generateBoxes("#svgContainer1",generatePolyLineSquare,15);

generateBoxes("#svgContainer2",generatePathSquare,5);
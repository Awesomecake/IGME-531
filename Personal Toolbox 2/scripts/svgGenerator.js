const generateBoxes = (svgTag, callback, numBoxes) => {
    let svgContainer = document.querySelector(svgTag);
    svgContainer.innerHTML = '';

    for(let i = 0; i < 25; i++)
    {
        for(let j = 0; j < 25; j++)
        {
            let max = 7;

            let rng0 = (rng(max)+4)/10.0;
            let width = 50*rng0;
            let height = 50*rng0;

            let newSVG = "";
            for(let boxes = 0; boxes < numBoxes; boxes++)
            {
                newSVG += callback(width,height,rngArray(width/7));

                rng0 = (rng(max)+4.5)/10.0;
                width *= rng0;
                height *= rng0;
            }

            svgContainer.innerHTML += createGrouping(newSVG,(i-j)*6,[45*i+30,45*j+30]);
        }
    }
}

const generatePolyLineSquare = (width,height,randomArray) => {
    return `<polyline points="
            ${-width/2 + randomArray[0]},${-height/2+randomArray[4]} 
            ${width/2 + randomArray[1]},${-height/2+randomArray[5]} 
            ${width/2 + randomArray[2]},${height/2+randomArray[6]} 
            ${-width/2 + randomArray[3]},${height/2+randomArray[7]} 
            ${-width/2 + randomArray[0]},${-height/2+randomArray[4]}
        " fill="none" stroke="black" />`
}

const generatePathSquare = (width,height, randomArray) => {
    return `<path fill="transparent" stroke="black" stroke-width="1" d="
                M ${-width/2 + randomArray[0]} ${-height/2+randomArray[4]} 
                L ${width/2 + randomArray[1]} ${-height/2+randomArray[5]}
                L ${width/2 + randomArray[2]} ${height/2+randomArray[6]}
                L ${-width/2 + randomArray[3]} ${height/2+randomArray[7]} 
            Z"/>`;
};

const createGrouping = (svg, rotate, translate = [0,0], scale = [1,1]) => {
    return `<g transform=" translate(${translate[0]},${translate[1]}) rotate(${rotate}) scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }
const rngArray = (max) => { return [rng(max),rng(max),rng(max),rng(max),rng(max),rng(max),rng(max),rng(max)] }

generateBoxes("#svgContainer1",generatePolyLineSquare,15);

generateBoxes("#svgContainer2",generatePathSquare,5);
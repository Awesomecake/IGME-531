
const generateSVG = (svgTarget) => {
    const svgContainer = document.querySelector(svgTarget);
    svgContainer.innerHTML = '';

    generateBoxes(svgContainer);
}

const generateBoxes = (svgContainer) => {
    for(let i = 0; i < 8; i++)
    {
        for(let j = 0; j < 8; j++)
        {
            let max = 15;

            let hSeparation = 130;
            let vSeparation = 130;

            let rng0 = rng(max*2.5);

            let width = 140-rng0;
            let height = 140-rng0;

            svgContainer.innerHTML += generatePolyLineSquare(width,height,hSeparation*i+75,vSeparation*j+75,rngArray(width/8));

            rng0 = rng(max*2.5);
            width -= rng0;
            height -= rng0;
            svgContainer.innerHTML += generatePolyLineSquare(width,height,hSeparation*i+75,vSeparation*j+75,rngArray(width/8));
            
            rng0 = rng(max*2.5);
            width -= rng0;
            height -= rng0;
            svgContainer.innerHTML += generatePolyLineSquare(width,height,hSeparation*i+75,vSeparation*j+75,rngArray(width/8));
            
            rng0 = rng(max*2.5);
            width -= rng0;
            height -= rng0;
            svgContainer.innerHTML += generatePolyLineSquare(width,height,hSeparation*i+75,vSeparation*j+75,rngArray(width/8));

            rng0 = rng(max*2.5);
            width -= rng0;
            height -= rng0;
            svgContainer.innerHTML += generatePolyLineSquare(width,height,hSeparation*i+75,vSeparation*j+75,rngArray(width/8));
        }
    }
}

const generatePolyLineSquare = (width,height,hOffset,vOffset, randomArray) => {
    return `<polyline points="
            ${hOffset-width/2 + randomArray[0]},${vOffset-height/2+randomArray[4]} 
            ${hOffset+width/2 + randomArray[1]},${vOffset-height/2+randomArray[5]} 
            ${hOffset+width/2 + randomArray[2]},${vOffset+height/2+randomArray[6]} 
            ${hOffset-width/2 + randomArray[3]},${vOffset+height/2+randomArray[7]} 
            ${hOffset-width/2 + randomArray[0]},${vOffset-height/2+randomArray[4]}
        " fill="none" stroke="black" />`
}

const rng = (max) => { return Math.floor(Math.random() * max); }
const rngArray = (max) => { return [rng(max),rng(max),rng(max),rng(max),rng(max),rng(max),rng(max),rng(max)] }

generateSVG("#svgContainer1");
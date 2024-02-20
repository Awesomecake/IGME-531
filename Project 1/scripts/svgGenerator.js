const generateTiling = (svgTag, callbacks=[generateTruchet], {xOffset=0, yOffset = 0, gridWidth=8, gridHeight=8, size=100}) => {
    let svgContainer = document.querySelector(svgTag);

    let output = "";
    for(let i = 0; i < gridHeight; i++)
    {
        for(let j = 0; j < gridWidth; j++)
        {
            output += callbacks[rng(callbacks.length)]((i+0.5)*size+xOffset,(j+0.5)*size+yOffset,size,size,2,"black");
        }
    }

    svgContainer.innerHTML += output;
}

//#region TilingStyles
const generateCross = (offsetX, offsetY,width,height,strokewidth,strokeColor="red") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 L${width/2},${0}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${-height/2} L${0},${height/2}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX,offsetY]});
}

const generateDiagonal = (offsetX, offsetY,width,height,strokewidth,strokeColor="black") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 L${0},${height/2}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${-height/2} L${width/2},${0}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX,offsetY]});
}

const generateArrow = (offsetX, offsetY,width,height,strokewidth,strokeColor="blue") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 L0,${height/2} L${width/2},0"/>`

    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${height/2} L0,${-height/2}"/>`

    return createGrouping(output, {rotation: rng(4)*90, translation: [offsetX,offsetY]});
}

const generateCircle = (offsetX, offsetY,width,height,strokewidth,strokeColor="purple") => {
    let circleShrinkScale = 1;

    width *= circleShrinkScale;

    let output = `<path stroke="${strokeColor}" stroke-width="${strokewidth}" fill="none"
    d="M ${-width/2}, ${0}
      a ${width/2},${width/2} 0 1,1 ${width},0
      a ${width/2},${width/2} 0 1,1 -${width},0"/>`


    return createGrouping(output, {translation: [offsetX,offsetY]});
}

const generateTruchet = (offsetX, offsetY,width,height,strokewidth,strokeColor="green") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 a${width/2},${height/2} 0 0,1 ${width/2},${height/2}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${width/2},0 a${width/2},${height/2} 0 0,1 ${-width/2},${-height/2}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX,offsetY]});
}

const generateTripleCurve = (offsetX, offsetY,width,height,strokewidth,strokeColor="yellow") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 a${width/2},${height/2} 0 0,1 ${width/2},${height/2}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${height/2} a${width/2},${height/2} 0 0,1 ${width/2},${-height/2}" />`
    
        //Line Three
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${width/2},0 a${width/2},${height/2} 0 0,1 ${-width/2},${-height/2}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX,offsetY]});
}
//#endregion

const createGrouping = (svg, {rotation = 0, translation = [0,0], pivot = [0,0], scale = [1,1]} ) => {
    return `<g transform=" translate(${translation[0]},${translation[1]}) rotate(${rotation},${pivot[0]},${pivot[1]})scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }

////////////////////////////////////////////////////////////////////////////////////////

const tilingOptions = [generateDiagonal,generateCross,generateArrow,generateTruchet,generateCircle]

const generateTilesOfTiles = () => {
    for(let i = 0; i < 4; i++)
    {
        for(let j = 0; j < 4; j++)
        {
            let tilingTypes = []
            for(let t = 0; t < rng(tilingOptions.length)+1; t++)
            {
                let newTileType = tilingOptions[rng(tilingOptions.length)];
                while(tilingTypes.includes(newTileType))
                {
                    newTileType = tilingOptions[rng(tilingOptions.length)];
                }
                tilingTypes.push(newTileType);
            }

            generateTiling(`#svgContainer1`,tilingTypes,{size: 50, xOffset: i*400, yOffset: j*400});
        }
    }
}

generateTilesOfTiles()
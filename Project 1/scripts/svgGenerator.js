const generateTiling = (svgTag, callbacks=[generateTruchet], {xOffset=0, yOffset = 0, gridWidth=5, gridHeight=5, size=100, colors=["black"], colorRule}) => {
    let svgContainer = document.querySelector(svgTag);

    let output = "";
    for(let i = 0; i < gridHeight; i++)
    {
        for(let j = 0; j < gridWidth; j++)
        {
            let selection = colorRule(i,j,colors);
            let color = colors[selection];
            output += callbacks[rng(callbacks.length)]((i+0.5)*size+xOffset,(j+0.5)*size+yOffset,size,size,2,color);
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
    let circleShrinkScale = 0.5;

    let output = `<path stroke="${strokeColor}" stroke-width="${strokewidth}" fill="none"
    d="M ${-width/2},0 L${circleShrinkScale*-width/2},0
       M ${width/2},0 L${circleShrinkScale*width/2},0
       M 0, ${height/2} L0,${circleShrinkScale*height/2}
       M 0, ${-height/2} L0,${circleShrinkScale*-height/2}"/>`

    width *= circleShrinkScale;

    output += `<path stroke="${strokeColor}" stroke-width="${strokewidth}" fill="none"
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

const generateTripleCurve = (offsetX, offsetY,width,height,strokewidth,strokeColor="orange") => {
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

const generateTilesOfTiles = (svgTag, superGridWidth, superGridHeight) => {
    const tilingOptions = [generateDiagonal,generateCross,generateTruchet,generateArrow,generateTripleCurve,generateCircle]
    //12 color options
    const colorOptions = ["black","blue","red","green","purple"];
    const colorRule = (i,j,colors) => { return 0; }

    for(let i = 0; i < 4; i++)
    {
        for(let j = 0; j < 4; j++)
        {
            let tilingTypes = [];
            let colorType = colorOptions[(i+j)%colorOptions.length];
            while (tilingTypes.length < rng(tilingOptions.length-2)+2)
            {
                let newTileType = tilingOptions[rng(tilingOptions.length)];
                while(tilingTypes.includes(newTileType))
                {
                    newTileType = tilingOptions[rng(tilingOptions.length)];
                }
                tilingTypes.push(newTileType);
            }

            generateTiling(svgTag,tilingTypes,{size: 25, xOffset: i*225, yOffset: j*225, colors: [colorType], gridWidth: 9, gridHeight: 9, colorRule: colorRule});
        }
    }
}

const generateTilesOfTilesWild = (svgTag, superGridWidth, superGridHeight) => {
    const tilingOptions = [
        [generateDiagonal],
        [generateTruchet],
        [generateCross,generateTruchet],
        [generateCross,generateDiagonal],
        [generateTruchet,generateDiagonal],
        [generateDiagonal,generateCircle],
        ]
    const colorOptions = ["black","blue","red"];
    const colorRule = (i,j,colors) => { return Math.floor((j+i)%(colors.length*3)/3); }

    for(let i = 0; i < superGridWidth; i++)
    {
        for(let j = 0; j < superGridHeight; j++)
        {
            let tilingType = tilingOptions[((i+1)*(j+1))%tilingOptions.length+1];

            generateTiling(svgTag,tilingType,{size: 25, xOffset: i*225, yOffset: j*225, colors: colorOptions, gridWidth: 9, gridHeight: 9, colorRule: colorRule});
        }
    }
}

generateTilesOfTilesWild("#svgContainer1",4,4)
generateTilesOfTiles("#svgContainer2",4,4)
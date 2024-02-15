const generateTiling = (svgTag, callback, gridWidth, gridHeight, size) => {
    let svgContainer = document.querySelector(svgTag);
    svgContainer.innerHTML = '';

    let output = "";
    for(let i = 0; i < gridHeight; i++)
    {
        for(let j = 0; j < gridWidth; j++)
        {
            output += callback(i,j,size,size,5);
        }
    }

    svgContainer.innerHTML = output;
}

const generateCurve = (offsetX, offsetY,width,height,strokewidth) => {
    switch(rng(4))
    {
        case 3:
            return `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
            d="M${offsetX*width},${offsetY*height} 
            a${width},${height} 0 
            0,1 
            ${width},${height}" />`
        case 2:
            return `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
            d="M${offsetX*width},${offsetY*height+height} 
            a${width},${height} 0 
            0,1 
            ${width},-${height}" />`
        case 1:
            return `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
            d="M${offsetX*width+width},${offsetY*height} 
            a${width},${height} 0 
            0,1 
            -${width},${height}" />`
        case 0:
            return `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
            d="M${offsetX*width+width},${offsetY*height+height} 
            a${width},${height} 0 
            0,1 
            -${width},-${height}" />`
    }
}

const generateTruchet = (offsetX, offsetY,width,height,strokewidth) => {
    let output = "";

    switch(rng(2))
    {
        case 0:
            //Line One
            output = `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
            d="M${offsetX*width-width/2},${offsetY*height} 
            a${width/2},${height/2} 0 
            0,1 
            ${width/2},${height/2}" />`
        
            //Line Two
            output += `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
            d="M${offsetX*width+width/2},${offsetY*height} 
            a${width/2},${height/2} 0 
            0,1 
            ${-width/2},${-height/2}" />`
            break;
        case 1:
            //Line One
            output = `<path fill="none" stroke="blue" stroke-width="${strokewidth}" 
            d="M${offsetX*width},${offsetY*height+height/2} 
            a${width/2},${height/2} 0 
            0,1 
            ${width/2},${-height/2}" />`

            //Line Two
            output += `<path fill="none" stroke="blue" stroke-width="${strokewidth}" 
            d="M${offsetX*width},${offsetY*height-height/2} 
            a${width/2},${height/2} 0 
            0,1 
            ${-width/2},${height/2}" />`
            break;
    }
    return output;
}

const createGrouping = (svg, rotate, translate = [0,0], scale = [1,1]) => {
    return `<g transform=" translate(${translate[0]},${translate[1]}) rotate(${rotate})scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }

////////////////////////////////////////////////////////////////////////////////////////

generateTiling('#svgContainer1', generateTruchet,30,30,80);
generateTiling('#svgContainer2', generateCurve, 70,70,50);
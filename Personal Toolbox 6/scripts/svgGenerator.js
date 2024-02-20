const generateTiling = (svgTag, callbacks=[generateTruchet], gridWidth, gridHeight, size) => {
    let svgContainer = document.querySelector(svgTag);
    svgContainer.innerHTML = '';

    let output = "";
    for(let i = 0; i < gridHeight; i++)
    {
        for(let j = 0; j < gridWidth; j++)
        {
            output += callbacks[rng(callbacks.length)](i+0.5,j+0.5,size,size,2,"black");
        }
    }

    svgContainer.innerHTML = output;
}

const generateCross = (offsetX, offsetY,width,height,strokewidth,strokeColor="red") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 L${width/2},${0}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${-height/2} L${0},${height/2}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX*width,offsetY*height]});
}

const generateDiagonal = (offsetX, offsetY,width,height,strokewidth,strokeColor="black") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 L${0},${height/2}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${-height/2} L${width/2},${0}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX*width,offsetY*height]});
}

const generateArrow = (offsetX, offsetY,width,height,strokewidth,strokeColor="blue") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 L0,${height/2} L${width/2},0"/>`

    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M0,${height/2} L0,${-height/2}"/>`

    return createGrouping(output, {rotation: rng(4)*90, translation: [offsetX*width,offsetY*height]});
}

const generateCircle = (offsetX, offsetY,width,height,strokewidth,strokeColor="purple") => {
    let output = `<path stroke="${strokeColor}" stroke-width="${strokewidth}" fill="none"
    d="M ${-width/2}, ${0}
      a ${width/2},${width/2} 0 1,1 ${width},0
      a ${width/2},${width/2} 0 1,1 -${width},0"/>`

    return createGrouping(output, {translation: [offsetX*width,offsetY*height]});
}

const generateTruchet = (offsetX, offsetY,width,height,strokewidth,strokeColor="green") => {
    //Line One
    let output = `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${-width/2},0 a${width/2},${height/2} 0 0,1 ${width/2},${height/2}" />`
        
    //Line Two
    output += `<path fill="none" stroke="${strokeColor}" stroke-width="${strokewidth}" 
        d="M${width/2},0 a${width/2},${height/2} 0 0,1 ${-width/2},${-height/2}" />`

    return createGrouping(output, {rotation: rng(2)*90, translation: [offsetX*width,offsetY*height]});
}

const createGrouping = (svg, {rotation = 0, translation = [0,0], pivot = [0,0], scale = [1,1]} ) => {
    return `<g transform=" translate(${translation[0]},${translation[1]}) rotate(${rotation},${pivot[0]},${pivot[1]})scale(${scale[0]},${scale[1]})"> ${svg} </g>`;
}

const rng = (max) => { return Math.floor(Math.random() * max); }

////////////////////////////////////////////////////////////////////////////////////////

generateTiling('#svgContainer1', [generateCircle, generateTruchet],20,20,80);
generateTiling('#svgContainer2', [generateTruchet], 20,20,80);
generateTiling('#svgContainer3', [generateDiagonal], 20,20,80);
generateTiling('#svgContainer4', [generateTruchet,generateDiagonal, generateCross,generateArrow, generateCircle], 20,20,80);
generateTiling('#svgContainer5', [generateCross], 20,20,80);
generateTiling('#svgContainer6', [generateCross,generateTruchet], 20,20,80);


















//Test Curve
////////////////////////////////////////////////////////////////////////////////////////
// const generateCurve = (offsetX, offsetY,width,height,strokewidth) => {
//     let svg = `<path fill="none" stroke="red" stroke-width="${strokewidth}" 
//     d="M${width},${height} 
//     a${width},${height} 0 
//     0,1 
//     -${width},-${height}" />`

//     switch(rng(4))
//     {
//         case 0:
//             return createGrouping(svg, {rotation: 0, translation: [offsetX*width,offsetY*height], pivot: [width/2,height/2]});
//         case 1:
//             return createGrouping(svg, {rotation: 90, translation: [offsetX*width,offsetY*height], pivot: [width/2,height/2]});
//         case 2:
//             return createGrouping(svg, {rotation: 180, translation: [offsetX*width,offsetY*height], pivot: [width/2,height/2]});
//         case 3:
//             return createGrouping(svg, {rotation: 270, translation: [offsetX*width,offsetY*height], pivot: [width/2,height/2]});
//     }
// }
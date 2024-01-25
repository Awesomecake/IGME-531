const elementData = [
    { width: 383, height: 383, x: 80,   y: 520,  fill: '#BE2A2A',   rotation: 5  },
    { width: 383, height: 383, x: 29,   y: 200,  fill: '#6B2933',   rotation: -26},
    { width: 383, height: 383, x: 435,  y: 65,   fill: '#b61d1dfa', rotation: -3 },
    { width: 383, height: 383, x: -308, y: 395,  fill: '#E84139',   rotation: -46},
    { width: 383, height: 383, x: 162,  y: 1042, fill: '#6B2933',   rotation: -26},
    { width: 383, height: 383, x: 883,  y: 620,  fill: '#6B2933',   rotation: 4  },
    { width: 383, height: 383, x: 1420, y: -5,   fill: '#BE2A2A',   rotation: 43 },
    { width: 383, height: 383, x: 1371, y: 681,  fill: '#E52524',   rotation: 16 },
    { width: 383, height: 383, x: 551,  y: 505,  fill: '#E52524',   rotation: -10},
];

const generateSVG = (svgTarget, svgData, elementType) => {
    const svgContainer = document.querySelector(svgTarget);
    svgContainer.innerHTML = '';

    for(let element of svgData)
    {

        switch (elementType) {
            case "square":
                svgContainer.innerHTML += `
                <g transform="rotate(${element.rotation})">
                    <rect y="${element.y}" x="${element.x}" width="${element.width}" height="${element.width}" style="fill:${element.fill};" />
                </g>`;
                break;
            case "rectangle":
                svgContainer.innerHTML += `
                <g transform="rotate(${element.rotation})">
                    <rect y="${element.y}" x="${element.x}" width="${element.width}" height="${element.height}" style="fill:${element.fill};" />
                </g>`;
                break;
            case "circle":
                svgContainer.innerHTML += `
                <g transform="rotate(${element.rotation})">
                    <circle cx="${element.x+element.width/2}" cy="${element.y+element.width/2}" r="${element.width/2}" style="fill:${element.fill};"/>
                </g>`;
                break;
            case "ellipse":
                svgContainer.innerHTML += `
                <g transform="rotate(${element.rotation})">
                    <ellipse cx="${element.x+element.width/2}" cy="${element.y+element.height/2}" rx="${element.width/2}" ry="${element.height/2}" style="fill:${element.fill};" />
                </g>`;
                break;
            case "triangle":
                svgContainer.innerHTML += `
                <g transform="rotate(${element.rotation})">
                    <polygon points="${element.x+element.width/2},${element.y} ${element.x},${element.y+element.height} ${element.x+element.width},${element.y+element.height}" style="fill:${element.fill};" />
                </g>`;
                break;
            case "line":
                svgContainer.innerHTML += `
                <g transform="rotate(${element.rotation})">
                    <line x1="${element.x}" y1="${element.y}" x2="${element.x+element.width}" y2="${element.y+element.height}" style="stroke:${element.fill};stroke-width:2" />
                </g>`;
                break;
        }
    }
}

generateSVG("#svgContainer1",elementData, "rectangle");
generateSVG("#svgContainer2",elementData, "circle");
generateSVG("#svgContainer3",elementData, "triangle");
generateSVG("#svgContainer4",elementData, "line");
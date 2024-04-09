

function renderFlowField({svg, distanceBetweenPoints, angle, color, strokeWidth}) {
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    const delta = distanceBetweenPoints;

    for (let x = 0; x < width; x += delta) {
        for (let y = 0; y < height; y += delta) {
            let adjustedX = x + (Math.random() - 0.5) * delta;
            let adjustedY = y + (Math.random() - 0.5) * delta;

            const lineAngle = angle(adjustedX, adjustedY);
            const lineColor = color(adjustedX, adjustedY);
            const lineStrokeWidth = strokeWidth(adjustedX, adjustedY);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', adjustedX);
            line.setAttribute('y1', adjustedY);
            line.setAttribute('x2', adjustedX + Math.cos(lineAngle) * 10);
            line.setAttribute('y2', adjustedY + Math.sin(lineAngle) * 10);
            line.setAttribute('stroke', lineColor);
            line.setAttribute('stroke-width', lineStrokeWidth);
            svg.appendChild(line);
        }
    }

    return svg;
}

export {
    renderFlowField
}
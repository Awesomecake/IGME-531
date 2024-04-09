function renderColorField(pointToRgba, canvas) {
    // Get width and height of canvas
    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const clr = pointToRgba(x - width / 2, y - height / 2) || [0, 0, 0, 0];

            const pixelPos = (y * width + x) * 4;
            pixels.data[pixelPos + 0] = 255 * clr[0];
            pixels.data[pixelPos + 1] = 255 * clr[1];
            pixels.data[pixelPos + 2] = 255 * clr[2];
            pixels.data[pixelPos + 3] = 255 * clr[3];
        }
    }
    ctx.putImageData(pixels, 0, 0);

    return canvas
}

function sdfToColorField(sdf) {
    return (x, y) => {
        const colorBandWidth = 20;
        const surfaceLineWidth = 3;

        const dist = sdf(x, y);
        const distQuantized = dist % colorBandWidth;

        // If we're basically at the surface of the shape, return black
        if (Math.abs(dist) < surfaceLineWidth) return [0, 0, 0, 1];

        // if we're inside the shape
        if (dist < 0) return [0, Math.abs(distQuantized / colorBandWidth), 0.7, 1];
        // if (dist < 0) return [1, 0, 0, 1];

        // otherwise we're outside of the shape
        return [0.7, Math.abs(distQuantized / colorBandWidth), 0, 1];
        // return [0, 0, 1, 1];
    }
}

export {
    renderColorField,
    sdfToColorField
}
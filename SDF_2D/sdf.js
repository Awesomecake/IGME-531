
/*
    2-d signed distance functions
*/

function circle(radius) {
    return (x, y) => {
        const distToCenter = Math.sqrt(x*x + y*y);
        return distToCenter - radius;
    }
}

/*
float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

*/
function rect(width, height) {
    return (x, y) => {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // Convert input to absolute values to simplify things
        const absX = Math.abs(x);
        const absY = Math.abs(y);

        // Calculate the distance from the point to the rectangle's edges
        const dx = Math.max(absX - halfWidth, 0);
        const dy = Math.max(absY - halfHeight, 0);

        // Calculate the distance inside the rectangle (negative if inside, zero if on the edge)
        const insideDistance = Math.min(Math.max(absX - halfWidth, absY - halfHeight), 0);

        // Return the combined distance (outside distance + inside distance)
        // This effectively gives us the signed distance
        return Math.sqrt(dx * dx + dy * dy) + insideDistance;
    };
}

function translate(byX, byY, sdf) {
    return (x, y) => {
        return sdf(x - byX, y - byY);
    }
}

function rotate(byRadians, sdf) {
    return (x, y) => {
        const x1 = x * Math.cos(byRadians) + y * Math.sin(byRadians);
        const y1 = -x * Math.sin(byRadians) + y * Math.cos(byRadians);
        return sdf(x1, y1);
    }
}

function scale(byFactor, sdf) {
    return (x, y) => {
        return byFactor * sdf(x / byFactor, y / byFactor);
    }
}

function reflectX(sdf) {
    return (x, y) => {
        return sdf(-x, y);
    }
}

function round(amount, sdf) {
    return (x, y) => {
        return sdf(x, y) - amount;
    }
}

function union(sdf1, sdf2) {
    return (x, y) => {
        return Math.min(sdf1(x, y), sdf2(x, y));
    }
}

function subtract(sdf1, sdf2) {
    return (x, y) => {
        return Math.max(sdf1(x, y), -sdf2(x, y));
    }
}

function intersect(sdf1, sdf2) {
    return (x, y) => {
        return Math.max(sdf1(x, y), sdf2(x, y));
    }
}

function invert(sdf) {
    return (x, y) => {
        return -sdf(x, y);
    }
}

const smoothX = (k, a, b) => {
    k = k * 4.0;

    const h = Math.max(k - Math.abs(a - b), 0.0) / k;
    return Math.min(a, b) - h * h * k * (1.0 / 4.0);
}

function smoothUnion(transitionSize, sdf1, sdf2) {
    return (x, y) => {
        const a = sdf1(x, y);
        const b = sdf2(x, y);
        
        // const k = transitionSize * 4.0;

        // const h = Math.max(k - Math.abs(a - b), 0.0) / k;
        // return Math.min(a, b) - h * h * k * (1.0 / 4.0);
        return smoothX(transitionSize, a, b);
    }
}

function smoothSubtract(transitionSize, sdf1, sdf2) {
    return (x, y) => {
        const a = sdf1(x, y);
        const b = sdf2(x, y);
        const k = transitionSize;

        return -smoothX(transitionSize, -a, b);
    }
}

function smoothIntersect(transitionSize, sdf1, sdf2) {
    return (x, y) => {
        return -smoothX(transitionSize, -sdf1(x, y), -sdf2(x, y));
    }
}

function repeatX(spacing, sdf) {
    return (x, y) => {
        x = x - spacing * Math.round(x / spacing)
        return sdf(x, y);
    }
}

function repeatY(spacing, sdf) {
    return (x, y) => {
        y = y - spacing * Math.round(y / spacing)
        return sdf(x, y);
    }
}

function repeat(spacingX, spacingY, sdf) {
    return (x, y) => {
        x = x - spacingX * Math.round(x / spacingX)
        y = y - spacingY * Math.round(y / spacingY)
        return sdf(x, y);
    }
}

const shape = {
    circle,
    rect
}
const transform = {
    translate,
    rotate,
    scale,
    reflectX,
    round,
    repeatX,
    repeatY,
    repeat
};
const op = {
    union,
    subtract,
    intersect,
    smooth: {
        union: smoothUnion,
        subtract: smoothSubtract,
        intersect: smoothIntersect
    }
};

export {
    shape,
    transform,
    op
}

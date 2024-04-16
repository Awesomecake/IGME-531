import { render } from './render.js';

const { booleans, colors, primitives, transforms, geometries } = jscadModeling // modeling comes from the included MODELING library
const { translate, scale, rotate } = transforms;

const { intersect, subtract, union } = booleans
const { colorize, colorNameToRgb } = colors
const { cube, cuboid, sphere, polyhedron, geodesicSphere } = primitives
const { toPoints } = geometries.geom3

const d20 = (params) => {
    return geodesicSphere({ ...params, frequency: 6 })
}

const d20Points = uniq(toPoints(d20({radius:1})).flat());

const fractal = (params, iterations) => {
    if (iterations === 0) {
        return d20({ radius: params.size, frequency: 6 });
    }
    const next = d20Points.map(point => {
        const p = point.map(i => i * 0.5*params.size);
        // debugger
        return translate([p[0], p[1], p[2]], fractal({ size: params.size / 2 }, iterations - 1));
    });
    return next;
}

/**
 * 
 * @param {*} a 
 * @author https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
 * @returns 
 */
function uniq(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

export const theFractal = rotate([Math.acos(-Math.sqrt(5) / 3) / 2, 0, 0], fractal({ size: 100 }, 3));
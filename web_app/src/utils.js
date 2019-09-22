import lib_store from '../lib/constants_store';

export function getConst (key) {
    return lib_store.getConst(CONSTANTS, key);
}

export function getResponsiveConst (key, media_size) {
    return lib_store.getResponsiveConst(CONSTANTS, key, media_size);
}

export function cardCssTransformation (x, y, rot, width, height) {
    x = Math.ceil(x - 0.5 * width);
    y = Math.ceil(y - 0.5 * height);
    rot = (rot * Math.PI).toFixed(4);
    return `translateX(${x}px) translateY(${y}px) rotate(${rot}rad)`;
}

export function spreadInsideCircle (radius, angle) {
    return [
        (Math.cos(angle) * radius * Math.random()),
        (Math.sin(angle) * radius * Math.random()),
    ];
}

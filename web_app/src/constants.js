import lib_store from '../lib/constants_store';

export function getConst (key) {
    return lib_store.getConst(CONSTANTS, key);
}

export function getResponsiveConst (key, media_size) {
    return lib_store.getResponsiveConst(CONSTANTS, key, media_size);
}

const slice = require('lodash/slice');

function getConst (store, key) {
    const keys = key.split('.');
    let value = store;

    for (let i=0; i<keys.length; i+=1) {
        value = value[keys[i]];
        if (value === undefined) {
            const bad_key = slice(keys, 0, i + 1).join('.');
            throw `constants_store: undefined at ${bad_key}`;
        }
    }

    return value;
}

function getConstSafe (store, key, failover) {
    const keys = key.split('.');
    let value = store;

    for (let i=0; i<keys.length; i+=1) {
        value = value[keys[i]];
        if (value === undefined) {
            if (failover) return failover(key, keys, i);
            else return `no value at ${key}`;
        }
    }

    return value;
}

function getResponsiveConst (store, key, media_size, media_sizes_list) {
    let value = getConst(store, key);
    if (typeof value !== 'object') {
        throw `constants_store: not responsive at ${key}`;
    }

    if (media_sizes_list === undefined) media_sizes_list = store['media_sizes'];
    const sizes = inherentMediaSizes(media_size, media_sizes_list);
    if (media_size === undefined) media_size = sizes[0];

    for (let i=sizes.length-1; i>=0; i-=1) {
        const size_value = value[sizes[i]];
        if (size_value !== undefined) return  size_value;
    }

    throw `constants_store: no value for ${media_size} at ${key}`;
}

function inherentMediaSizes (top, all_sizes) {
    if (all_sizes === undefined) throw 'constants_store: no media sizes given';
    if (top === undefined) return [all_sizes[0]];

    const top_index = all_sizes.indexOf(top);
    if (top_index !== -1) return slice(all_sizes, 0, top_index + 1);

    throw `constants_store: bad media size ${top}`;
}

module.exports = {
    getConst,
    getConstSafe,
    getResponsiveConst
};

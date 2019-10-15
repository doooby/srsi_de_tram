const sass = require('sass');
const constants = require('./constants');
const lib_store = require('../lib/constants_store');

function getConst (key) {
    if (!(key instanceof sass.types.String)) {
        throw `sass_constants: given key is not a string`;
    }

    return castSassValue(
        lib_store.getConst(constants, key.getValue())
    );
}

function getResponsiveConst (key, media_size) {
    if (!(key instanceof sass.types.String)) {
        throw `sass_constants: given key is not a string`;
    }

    key = key.getValue();
    media_size = media_size instanceof sass.types.String ?
        media_size.getValue() :
        undefined;

    return castSassValue(
        lib_store.getResponsiveConst(constants, key, media_size)
    );
}

function castSassValue (value) {
    switch (typeof value) {
        case 'string':
            value = new sass.types.String(value);
            // this value is unquoted
            // https://sass-lang.com/documentation/values/strings#quoted
            // therefore would need in scss `content: "#{constant('key')}";`
            value.dartValue.hasQuotes = true;
            return value;
        case 'number':
            return new sass.types.Number(value);
        default:
            throw `environment_constants: cannot cast value of type ${typeof value}`;
    }
}

module.exports = {
    getConst,
    getResponsiveConst
};

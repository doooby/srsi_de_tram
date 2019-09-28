const cs = require('GAME_PATH/texts/cs');
const { getConstSafe } = require('./constants_store');

const LOCALES = {
    cs
};

function localizedGetter (locale) {
    const locales = LOCALES[locale];
    if (typeof locales !== 'object')
        throw `game_texts: unknown locale ${locale}`;
    return function (key) {
        return getConstSafe(
            locales,
            key,
            missing_key => `{${missing_key}}`
        );
    }
}

module.exports = {
    localizedGetter
};

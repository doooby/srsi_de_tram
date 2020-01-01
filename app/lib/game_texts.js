const cs = require('GAME_PATH/texts/cs');
const { getConstSafe } = require('./constants_store');

const LOCALES = {
    cs
};

function localizedGetter (locale) {
    const locales = LOCALES[locale];
    if (typeof locales !== 'object')
        throw `game_texts: unknown locale ${locale}`;

    let fn = localizedGetter.locale;
    if (!fn) {
        fn = function (key, interpolations) {
            return getText(locales, key, interpolations);
        };
        localizedGetter.locale = fn;
    }

    return fn;
}

function getText (store, key, interpolations) {
    let text = getConstSafe(
        store,
        key,
        missing_key => `{${missing_key}}`
    );

    if (interpolations) {
        Object.keys(interpolations).forEach(term => {
            text = text.replace(
                `%{${term}}`,
                interpolations[term]
            );
        });
    }

    return text;
}

module.exports = {
    localizedGetter,
    getText,
};

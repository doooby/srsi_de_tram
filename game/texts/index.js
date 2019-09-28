import cs from './cs';
import { getConstSafe } from '../../web_app/lib/constants_store';

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

export {
    localizedGetter
};


function card_width (ratio) {
    return ratio * 7;
}

function card_height (ratio) {
    return ratio * 10;
}

module.exports = {

    media_sizes: ['sm'],

    card: {
        regular: {
            width: { sm: card_width(20) },
            height: { sm: card_height(20) },
        },

        small: {
            width: { sm: card_width(8) },
            height: { sm: card_height(8) },
        },
    },

};

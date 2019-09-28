const webpack = require('webpack');
const path = require('path');
const constants = require('./config/constants');
const {getConst, getResponsiveConst} = require('./config/sass_constants');

module.exports = {

    css: {
        loaderOptions: {
            scss: {
                functions: {
                    'const($key)': function (key) {
                        return getConst(key);
                    },
                    'constr($key, $media_size: null)': function (key, media_size) {
                        return getResponsiveConst(key, media_size);
                    }
                }
            }
        }
    },

    configureWebpack: {
        resolve: {
            alias: {
                GAME_PATH: path.resolve(__dirname, '../game')
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                CONSTANTS: JSON.stringify(constants)
            })
        ]
    }

};

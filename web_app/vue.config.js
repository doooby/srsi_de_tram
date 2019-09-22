const webpack = require('webpack');
const constants = require('./config/constants');
const {getConst, getResponsiveConst} = require('./config/sass_constants');

module.exports = {

    css: {
        loaderOptions: {
            scss: {
                functions: {
                    'constant($key)': function (key) {
                        return getConst(key);
                    },
                    'constant-responsive($key, $media_size: null)': function (key, media_size) {
                        return getResponsiveConst(key, media_size);
                    }
                }
            }
        }
    },

    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                CONSTANTS: JSON.stringify(constants)
            })
        ]
    }

};

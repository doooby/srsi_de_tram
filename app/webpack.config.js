const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const constants = require('./config/constants');
const {getConst, getResponsiveConst} = require('./config/sass_constants');

module.exports = (_, argv) => {
    const production = argv.mode !== 'development';
    const build_path = path.resolve(
        __dirname,
        `../${production ? 'public' : 'tmp/build'}`
    );
    const assets_path = path.resolve(build_path, 'assets');

    return {
        mode: (production ? 'production' : 'development'),
        devtool: (production ? false : 'eval-source-map'),

        output: {
            filename: outputFile('app', 'js', production),
            path: assets_path
        },

        module: {
            rules: buildModuleRules(production)
        },

        resolve: {
            extensions: ['.js', '.json', '.vue'],
            alias: {
                GAME_PATH: path.resolve(__dirname, '../game')
            }
        },

        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                CONSTANTS: JSON.stringify(constants)
            }),
            new CopyWebpackPlugin(filesToCopy(production)),
            new AssetsManifestPlugin(assets_path)
        ]
    };
};

function buildModuleRules (production) {
    return [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.s?css$/,
            use: [
                { loader: 'file-loader', options: { name: outputFile('[name]', 'css', production) } },
                { loader: 'sass-loader', options: {
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
            ]
        },
    ];
}

function filesToCopy (production) {
    const to_copy = [
        {
            from: './assets/**/*.png',
            to: outputFile(null, 'png', production)
        }
    ];

    if (!production) {
        to_copy.push({
            from: './static.html',
            to: '../index.html'
        });
    }

    return to_copy;
}

function outputFile (name, extension, production) {
    return [
        name,
        (production ? '.[hash]' : ''),
        '.',
        extension
    ].join('');
}

class AssetsManifestPlugin {

    constructor (assets_path) {
        this.working_dir = assets_path + '/';
    }

    apply (compiler) {
        const name = 'AssetsManifestPlugin';
        // compiler.hooks.beforeCompile.tap(name, () => {
        //     fs.emptyDirSync(this.working_dir);
        // });

        compiler.hooks.done.tap(name, () => {
            this.buildManifest();
        });
    }

    buildManifest () {
        const regex = /([\w\d-\/]+)(\.[\w\d]+)?(\.\w+)/;
        const manifest = {};

        glob.sync(`${this.working_dir}**/*`).forEach(file => {
            file = file.replace(this.working_dir, '');
            if (file === 'manifest.json') return;
            const parts = regex.exec(file);

            if (parts) {
                const asset = `${parts[1]}${parts[3]}`;
                manifest[asset] = file;
            }
        });

        fs.writeJsonSync(`${this.working_dir}manifest.json`, manifest);
    }

}

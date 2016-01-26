module.exports = function karmaConfig(config) {
    config.set({

        browsers: [ 'Chrome' ],

        singleRun: true,

        frameworks: [ 'mocha' ],

        files: [
            'web/client/libs/Cesium/Build/Cesium/Cesium.js',
            'tests-travis.webpack.js',
            { pattern: './web/client/test-resources/**/*', included: false }
        ],

        preprocessors: {
            'tests-travis.webpack.js': [ 'webpack', 'sourcemap' ]
        },

        reporters: [ 'mocha', 'coverage', 'coveralls' ],

        junitReporter: {
            outputDir: './web/target/karma-tests-results',
            suite: ''
        },

        coverageReporter: {
            dir: './coverage/',
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
                { type: 'lcovonly', subdir: '.' }
            ],
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
        },

        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    { test: /\.jsx?$/, exclude: /(ol\.js$)/, loader: 'babel-loader', query: {stage: 0} },
                    { test: /\.css$/, loader: 'style!css'},
                    { test: /\.(png|jpg|gif|svg)$/, loader: 'url-loader?name=[path][name].[ext]&limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
                ],
                postLoaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /(__tests__|node_modules|legacy|libs\\Cesium)\\|(__tests__|node_modules|legacy|libs\/Cesium)\/|webpack\.js|utils\/(openlayers|leaflet)/,
                        loader: 'istanbul-instrumenter'
                    }
                ]
            },
            resolve: {
                extensions: ['', '.js', '.json', '.jsx']
            }
        },

        webpackServer: {
            noInfo: true
        }

    });
};

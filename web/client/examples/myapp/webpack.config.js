import path from "path";
import LoaderOptionsPlugin from "webpack/lib/LoaderOptionsPlugin";

export default {
    entry: {
        myapp: path.join(__dirname, "app")
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "myapp.js"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                }]

            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new LoaderOptionsPlugin({
            debug: true
        })
    ]
};

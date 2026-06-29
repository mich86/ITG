const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === "production";

    return {
    entry: {
        index: path.resolve(__dirname, "src", "index.js")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: isProd ? "[name].[contenthash].js" : "[name].js"
    },
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
        hot: true,
        inline: true,
        open: true,
        contentBase: path.join(__dirname, 'public')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html")
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public", "api"),
                    to: "api"
                },
                {
                    from: path.resolve(__dirname, "public", "images"),
                    to: "images"
                },
                {
                    from: path.resolve(__dirname, "public", "robots.txt"),
                    to: "robots.txt"
                }
            ],
        }),
    ]
    };
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        filename: path.resolve(__dirname,'src/index.js'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'RSS agregator',
            template: 'index.html'
        }),
        new CleanWebpackPlugin
    ],
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'index.js'
    },
    devServer: {
        port: 9000,
        compress: true,
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist')
        }
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: { 
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}